// app/api/checkout/route.ts
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil' as any,
});

export async function POST(req: Request) {
  const { userEmail } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment', // or 'subscription'
    line_items: [
      {
        price: 'price_1234567890', // Your Stripe Price ID
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/premium?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    customer_email: userEmail,
  });

  return NextResponse.json({ url: session.url });
}
