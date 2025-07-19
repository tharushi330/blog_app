// pages/api/webhook.ts (Next.js Pages Router)
import Stripe from 'stripe';
import { buffer } from 'micro';
import { supabase } from '../lib/supabaseClient';

export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ Correct API version used (replace with your actual version like '2022-11-15')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil' as any,
});

export default async function handler(req: any, res: any) {
  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);
  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook Error:', errorMessage);
    return res.status(400).send(`Webhook Error: ${errorMessage}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const email = session.customer_email;
    
    await supabase
      .from('users')
      .update({ is_premium: true })
      .eq('email', email);
  }

  res.status(200).json({ received: true });
}
