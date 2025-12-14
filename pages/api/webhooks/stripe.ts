import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../lib/stripe";
import { supabaseAdmin } from "../../lib/supabaseClient";

export const config = {
  api: {
    bodyParser: false
  }
};

import getRawBody from "raw-body";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sig = req.headers["stripe-signature"] as string | undefined;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  const buf = await getRawBody(req);
  let event;
  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig || "", webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const courseId = session.metadata?.course_id;
    const metadataUserId = session.metadata?.user_id || null;
    const customerEmail = session.customer_details?.email || session.customer_email || null;
    const amount_total = session.amount_total || 0;

    // Prefer linking to metadata.user_id (set at session creation). Fallback to email lookup.
    try {
      let userId = metadataUserId;

      if (!userId && customerEmail) {
        // Find or create profile by email
        const { data: users } = await supabaseAdmin.from("users").select("*").eq("email", customerEmail).limit(1);
        if (users && users.length > 0) {
          userId = users[0].id;
        } else {
          const { data: newUser } = await supabaseAdmin
            .from("users")
            .insert([{ email: customerEmail, role: "student" }])
            .select()
            .single();
          userId = newUser.id;
        }
      }

      // Create enrollment (link to found userId if available)
      await supabaseAdmin.from("enrollments").insert([
        {
          user_id: userId,
          course_id: courseId,
          status: "active",
          purchased_at: new Date().toISOString(),
          price_cents: amount_total
        }
      ]);

      // Create payment record
      await supabaseAdmin.from("payments").insert([
        {
          enrollment_id: null,
          stripe_payment_id: session.payment_intent || session.id,
          amount_cents: amount_total,
          status: "succeeded",
          created_at: new Date().toISOString()
        }
      ]);
    } catch (err) {
      console.error("Error writing to supabase:", err);
    }
  }

  res.json({ received: true });
}
