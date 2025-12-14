import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { courseId, userId } = req.body;
  if (!courseId || !userId) return res.status(400).json({ error: "Missing courseId or userId" });

  try {
    // Validate course
    const { data: course } = await supabaseAdmin.from("courses").select("*").eq("id", courseId).single();
    if (!course) return res.status(404).json({ error: "Course not found" });

    // Validate user exists
    const { data: users } = await supabaseAdmin.from("users").select("id,email").eq("id", userId).limit(1);
    if (!users || users.length === 0) return res.status(404).json({ error: "User not found" });

    // Only allow free course enrollment via this endpoint
    const price = course.price_cents || 0;
    if (price !== 0) return res.status(400).json({ error: "Only free courses may be enrolled via this endpoint" });

    // Create enrollment
    const now = new Date().toISOString();
    await supabaseAdmin.from("enrollments").insert([
      {
        user_id: userId,
        course_id: courseId,
        status: "active",
        purchased_at: now,
        price_cents: 0
      }
    ]);

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error creating enrollment:", err);
    res.status(500).json({ error: "Enrollment failed" });
  }
}
