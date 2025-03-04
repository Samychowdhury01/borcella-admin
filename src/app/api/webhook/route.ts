import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;
  let event: Stripe.Event;
  console.log("Raw Body:", body); // Check against Stripe's dashboard payload
  console.log("Signature Header:", signature);
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerClerkId = session.client_reference_id;

      if (!customerClerkId) {
        return NextResponse.json({
          statusCode: 400,
          success: false,
          message: "Invalid user",
          data: [],
        });
      }

      // Customer Info
      const customerInfo = {
        clerkId: customerClerkId,
        name: session.customer_details?.name || "",
        email: session.customer_details?.email || "",
      };

      // Shipping Address
      const shippingAddress = {
        street: session.shipping_details?.address?.line1 || "",
        city: session.shipping_details?.address?.city || "",
        state: session.shipping_details?.address?.state || "",
        postalCode: session.shipping_details?.address?.postal_code || "",
        country: session.shipping_details?.address?.country || "",
      };

      // Find or create customer
      let customer = await prisma.customer.findUnique({
        where: { clerkId: customerClerkId },
      });

      if (!customer) {
        customer = await prisma.customer.create({ data: customerInfo });
      }

      // Retrieve expanded session details
      const retrieveSession = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ["line_items.data.price.product"] }
      );

      const lineItems = retrieveSession.line_items?.data;

      // Prepare order items with product IDs from line item metadata
      const orderItems = lineItems?.map((item: any) => {
        const productId = item.price.product.metadata.productId;
        return {
          product: { connect: { id: productId } },
          color: item.price.product.metadata.color || "N/A",
          size: item.price.product.metadata.size || "N/A",
          quantity: item.quantity,
        };
      });

      // Create new order
      const createNewOrder = await prisma.order.create({
        data: {
          customerId: customer.id,
          shippingAddress: { create: shippingAddress },
          totalAmount: session.amount_total ? session.amount_total / 100 : 0,
          shippingRate: session.metadata?.shippingRate || "standard",
          products: { create: orderItems || [] },
          customerClerkId: customerInfo.clerkId,
        },
      });

      // Update customer with new order ID
      await prisma.customer.update({
        where: { clerkId: customerClerkId },
        data: { orderIds: { push: createNewOrder.id } },
      });
      console.log(customer, 'from webhook')

      return NextResponse.json({
        statusCode: 200,
        success: true,
        message: "Order created successfully!",
        data: [],
      });
    } else {
      return NextResponse.json({
        statusCode: 400,
        success: false,
        message: "Unhandled event type",
        data: [],
      });
    }
  } catch (error) {
    console.error("[WEBHOOK_ERROR]", error);
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
}
