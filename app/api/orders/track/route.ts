import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders } from "@/db/schema";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const orderNumber = url.searchParams.get("orderNumber")?.trim().toUpperCase() ?? "";
    if (!orderNumber) return Response.json({ error: "Enter your order number." }, { status: 400 });

    const [order] = await getDb().select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
    if (!order) return Response.json({ error: "No matching order was found." }, { status: 404 });

    return Response.json({ order: {
      orderNumber: order.orderNumber,
      status: order.status,
      items: JSON.parse(order.itemsJson),
      total: order.total,
      createdAt: order.createdAt,
      paidAt: order.paidAt,
    }});
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Could not check the order." }, { status: 500 });
  }
}
