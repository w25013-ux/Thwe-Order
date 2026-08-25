import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { accessoryProducts } from "@/lib/accessories";

type OrderItem = { id: string; name: string; price: number; quantity: number };

const catalog = new Map([
  ["gw-125-city", { name: "GW 125 CITY", price: 298000 }],
  ["gw-155-r", { name: "GW 155 R", price: 428000 }],
  ["gw-250-roadster", { name: "GW 250 ROADSTER", price: 568000 }],
  ["gw-300-x", { name: "GW 300 X", price: 698000 }],
  ["gw-400-classic", { name: "GW 400 CLASSIC", price: 748000 }],
  ["gw-500-naked", { name: "GW 500 NAKED", price: 868000 }],
  ["gw-650-heritage", { name: "GW 650 HERITAGE", price: 980000 }],
  ["gw-700-street", { name: "GW 700 STREET", price: 1120000 }],
  ["gw-750-tourer", { name: "GW 750 TOURER", price: 1380000 }],
  ["gw-900-adventure", { name: "GW 900 ADVENTURE", price: 1580000 }],
  ["gw-900-cruiser", { name: "GW 900 CRUISER", price: 1690000 }],
  ["gw-1200-muscle", { name: "GW 1200 MUSCLE", price: 2180000 }],
  ["gw-1200-bobber", { name: "GW 1200 BOBBER", price: 2280000 }],
  ["gw-1300-chopper", { name: "GW 1300 CHOPPER", price: 2480000 }],
  ["gw-1800-grand-tour", { name: "GW 1800 GRAND TOUR", price: 3280000 }],
  ["gw-1000-rr", { name: "GW 1000 RR", price: 1980000 }],
  ["acc-helmet", { name: "GW AERO FULL-FACE HELMET", price: 42800 }],
  ["acc-jacket", { name: "GW ARMORED RIDING JACKET", price: 36800 }],
  ["acc-gloves", { name: "GW LEATHER RIDING GLOVES", price: 12800 }],
  ["acc-boots", { name: "GW TOURING BOOTS", price: 24800 }],
  ["acc-top-case", { name: "GW 45L TOP CASE", price: 29800 }],
  ["acc-phone-mount", { name: "GW SECURE PHONE MOUNT", price: 6800 }],
  ["acc-chain-lock", { name: "GW HARDENED CHAIN LOCK", price: 15800 }],
  ["acc-cover", { name: "GW ALL-WEATHER COVER", price: 9800 }],
  ["helmet-sport", { name: "GW R1 SPORT FULL-FACE", price: 46800 }],
  ["helmet-modular", { name: "GW FLIP MODULAR", price: 52800 }],
  ["helmet-adventure", { name: "GW TRAIL ADVENTURE", price: 49800 }],
  ["helmet-open", { name: "GW CLASSIC OPEN-FACE", price: 26800 }],
  ["helmet-racing", { name: "GW NEON RACING", price: 56800 }],
  ["helmet-touring", { name: "GW SILVER TOURING", price: 54800 }],
  ["helmet-motocross", { name: "GW MX OFF-ROAD", price: 39800 }],
  ["helmet-vintage", { name: "GW VINTAGE FULL-FACE", price: 43800 }],
]);
accessoryProducts.forEach((item)=>catalog.set(item.id,{name:item.name,price:item.price}));

const accessoryIds = new Set(accessoryProducts.map((item)=>item.id));

export async function GET() {
  return Response.json(
    { error: "Order management is not available on the customer website." },
    { status: 403 },
  );
}

export async function POST(request: Request) {
  try {
    const payload = await request.json() as { customerName?: string; email?: string; phone?: string; paymentMethod?: string; items?: OrderItem[] };
    const customerName = payload.customerName?.trim() ?? "";
    const email = payload.email?.trim().toLowerCase() || "sample@goldenwheel.invalid";
    const phone = payload.phone?.trim() ?? "";
    const requestedItems = payload.items ?? [];
    if (!customerName || !phone || requestedItems.length === 0) return Response.json({ error: "Please enter a name and phone number, then add a product." }, { status: 400 });
    if (customerName.length > 100 || email.length > 254 || phone.length > 40 || !email.includes("@")) {
      return Response.json({ error: "Please check your contact information." }, { status: 400 });
    }
    if (requestedItems.length > 12) return Response.json({ error: "Please order no more than twelve different products at once." }, { status: 400 });
    const uniqueIds = [...new Set(requestedItems.map((item) => item.id))];
    const items = uniqueIds.map((id) => {
      const product = catalog.get(id);
      const requested = requestedItems.find((item) => item.id === id);
      const quantity = accessoryIds.has(id) ? Math.min(5, Math.max(1, Number(requested?.quantity) || 1)) : 1;
      return product ? { id, name: product.name, price: product.price, quantity } : null;
    }).filter((item): item is OrderItem => item !== null);
    if (items.length !== uniqueIds.length) return Response.json({ error: "One or more products are no longer available." }, { status: 400 });
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderNumber = `GW-${Date.now().toString(36).toUpperCase()}`;
    const [order] = await getDb().insert(orders).values({ orderNumber, customerName, email, phone, address: "Portfolio demo order", paymentMethod: "Demo card payment", itemsJson: JSON.stringify(items), total, status: "Order confirmed" }).returning();
    return Response.json({ order: { ...order, items } }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Could not save order" }, { status: 500 });
  }
}
