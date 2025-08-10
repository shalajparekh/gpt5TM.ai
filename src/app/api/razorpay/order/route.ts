import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Razorpay keys not set" }, { status: 500 });
    }
    const amount = Math.max(
      1,
      Math.trunc(
        (items as Array<{ price: number; qty: number }>).reduce(
          (sum: number, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 1),
          0
        ) * 100
      )
    );
    const instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await instance.orders.create({ amount, currency: "INR" });
    return NextResponse.json(order);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


