import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { cartItems, customer } = await req.json();

    if (!cartItems || !customer) {
      return NextResponse.json({
        statusCode: 400,
        success: false,
        message: "Missing cart items or customer data",
        data: [],
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US", "BD", "CA"],
      },
      shipping_options: [
        { shipping_rate: "shr_1QyQ6oGYaOUUPjgrM3SMnb8v" },
        { shipping_rate: "shr_1QyPxeGYaOUUPjgrqqLVPoaj" },
        { shipping_rate: "shr_1QyPwQGYaOUUPjgrx6IWZhMB" },
      ],
      line_items: cartItems.map((cartItem: any) => ({
        price_data: {
          currency: "cad",
          product_data: {
            name: cartItem.item.title,
            metadata: {
              productId: cartItem.item.id,
              ...(cartItem.size && { size: cartItem.size }),
              ...(cartItem.color && { color: cartItem.color }),
            },
          },
          unit_amount: cartItem.item.price * 100,
        },
        quantity: cartItem.quantity,
      })),
      client_reference_id: customer.userId,
      success_url: `${process.env.ECOMMERCE_STORE_URL}/payment-success`,
      cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,
    });

    return NextResponse.json(session, { headers: corsHeaders });
  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal server error",
      data: [],
    });
  }
}