import { eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "@/db";
import { orders } from "@/db/schema";

function toHex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let index = 0; index < a.length; index += 1) result |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return result === 0;
}

export async function POST(request: Request) {
  const runtimeEnv = env as unknown as Record<string, string | undefined>;
  const secret = runtimeEnv.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) return Response.json({ error: "Webhook is not configured." }, { status: 503 });

  const body = await request.text();
  const timestamp = signature.split(",").find((part) => part.startsWith("t="))?.slice(2);
  const signatures = signature.split(",").filter((part) => part.startsWith("v1=")).map((part) => part.slice(3));
  if (!timestamp || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return Response.json({ error: "Invalid webhook timestamp." }, { status: 400 });

  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const expected = toHex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${body}`)));
  if (!signatures.some((candidate) => safeEqual(candidate, expected))) return Response.json({ error: "Invalid webhook signature." }, { status: 400 });

  const event = JSON.parse(body) as { type?: string; data?: { object?: { id?: string; payment_status?: string; metadata?: { orderNumber?: string } } } };
  if (event.type === "checkout.session.completed" && event.data?.object?.payment_status === "paid") {
    const orderNumber = event.data.object.metadata?.orderNumber;
    if (orderNumber) await getDb().update(orders).set({ status: "Paid", paidAt: new Date().toISOString(), stripeSessionId: event.data.object.id }).where(eq(orders.orderNumber, orderNumber));
  }
  return Response.json({ received: true });
}
