import { and, eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "@/db";
import { orders } from "@/db/schema";

type OrderItem = { id: string; name: string; price: number; quantity: number };

export async function POST(request: Request) {
  try {
    const runtimeEnv = env as unknown as Record<string, string | undefined>;
    const stripeKey = runtimeEnv.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return Response.json({ error: "Real payment is ready, but the Stripe account has not been connected yet." }, { status: 503 });
    }

    const payload = await request.json() as { orderNumber?: string; email?: string };
    const orderNumber = payload.orderNumber?.trim() ?? "";
    const email = payload.email?.trim().toLowerCase() ?? "";
    if (!orderNumber || !email) return Response.json({ error: "Order details are missing." }, { status: 400 });

    const [order] = await getDb().select().from(orders).where(and(eq(orders.orderNumber, orderNumber), eq(orders.email, email))).limit(1);
    if (!order || order.status === "Paid") return Response.json({ error: "This order cannot start a new payment." }, { status: 409 });

    const items = JSON.parse(order.itemsJson) as OrderItem[];
    const origin = new URL(request.url).origin;
    const form = new URLSearchParams({
      mode: "payment",
      submit_type: "pay",
      client_reference_id: order.orderNumber,
      customer_email: order.email,
      success_url: `${origin}/?payment=success&order=${encodeURIComponent(order.orderNumber)}`,
      cancel_url: `${origin}/?payment=cancelled&order=${encodeURIComponent(order.orderNumber)}`,
      "metadata[orderNumber]": order.orderNumber,
      "payment_method_types[0]": "card",
    });
    items.forEach((item, index) => {
      form.set(`line_items[${index}][quantity]`, String(item.quantity));
      form.set(`line_items[${index}][price_data][currency]`, "jpy");
      form.set(`line_items[${index}][price_data][unit_amount]`, String(item.price));
      form.set(`line_items[${index}][price_data][product_data][name]`, item.name);
    });

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${stripeKey}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    const session = await stripeResponse.json() as { id?: string; url?: string; error?: { message?: string } };
    if (!stripeResponse.ok || !session.id || !session.url) {
      return Response.json({ error: session.error?.message ?? "Could not start secure payment." }, { status: 502 });
    }

    await getDb().update(orders).set({ stripeSessionId: session.id }).where(eq(orders.id, order.id));
    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Could not start secure payment." }, { status: 500 });
  }
}
