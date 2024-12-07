import { headers } from "next/headers";
import Stripe from "stripe";

import { env } from "@/env.mjs";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  // console.log("POST request received");

  const body = await req.text();
  // console.log("Request body parsed:", body);

  const signature = headers().get("Stripe-Signature") as string;
  // console.log("Stripe-Signature header:", signature);

  let event: Stripe.Event;

  try {
    console.log("Constructing Stripe event");
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
    // console.log("Stripe event constructed:", event);
  } catch (error) {
    console.error("Error constructing Stripe event:", error.message);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  // console.log("Stripe session object:", session);

  if (event.type === "checkout.session.completed") {
    console.log("Handling checkout.session.completed event");

    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );
    // console.log("Subscription retrieved:", subscription);

    // Update the user stripe info in our database.
    console.log("Updating user information in database");
    await prisma.user.update({
      where: {
        id: session?.metadata?.userId,
      },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
      },
    });
    console.log("User information updated in database");
  }

  if (event.type === "invoice.payment_succeeded") {
    console.log("Handling invoice.payment_succeeded event");

    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );
    // console.log("Subscription retrieved:", subscription);

    // Update the price id and set the new period end.
    console.log("Updating subscription information in database");
    await prisma.user.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
      },
    });
    console.log("Subscription information updated in database");
  }

  console.log("POST request completed successfully");
  return new Response(null, { status: 200 });
}
