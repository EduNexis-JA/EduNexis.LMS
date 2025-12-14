import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../lib/stripe";
import { supabaseAdmin } from "../../lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { courseId, userId, userEmail } = req.body;
  if (!courseId) return res.status(400).json({ error: "Missing courseId" });

  // Fetch course and price
  const { data: course } = await supabaseAdmin.from("courses").select("*").eq("id", courseId).single();
  if (!course) return res.status(404).json({ error: "Course not found" });

  try {
    const price = course.price_cents || 0;
    // Basic validation: if userId provided, ensure it exists in users table
    if (userId) {
      const { data: profiles } = await supabaseAdmin.from("users").select("id").eq("id", userId).limit(1);
      if (!profiles || profiles.length === 0) {
        // create a minimal profile row for this user (optional)
        await supabaseAdmin.from("users").insert([{ id: userId, email: userEmail, role: "student" }]);
      }
    }

    // For free courses, create an enrollment directly (skip Stripe)
    if (price === 0) {
      // In a real app this endpoint should be protected and require authentication.
      return res.status(200).json({ message: "Free course — implement auth enrollment on client" });
    }

    // Create Stripe Checkout session
    const sessionCreateParams: any = {
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: course.title, description: course.description || "" },
            unit_amount: price
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/?checkout=cancel`,
      metadata: { course_id: courseId }
    };

    // Prefer setting customer email & metadata.user_id so webhook can link purchase to user
    if (userEmail) sessionCreateParams.customer_email = userEmail;
    if (userId) sessionCreateParams.metadata.user_id = userId;

    const session = await stripe.checkout.sessions.create(sessionCreateParams);

    res.status(200).json({ sessionUrl: session.url });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Stripe session creation failed" });
  }
}
