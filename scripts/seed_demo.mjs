import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
  console.error('Copy values into .env.local and `source .env.local` or pass them in the environment before running.');
  process.exit(1);
}

const supabase = createClient(url, key);

async function seed() {
  console.log('Seeding demo instructor...');
  const { data: instructor, error: errI } = await supabase.from('users').select('*').eq('email', 'instructor@edunexis.demo').single();
  if (errI && errI.code !== 'PGRST116') {
    // ignore not found
  }

  let instructorId = instructor?.id;
  if (!instructorId) {
    const { data: created } = await supabase.from('users').insert([{ email: 'instructor@edunexis.demo', full_name: 'Instructor Demo', role: 'instructor' }]).select().single();
    instructorId = created.id;
  }

  console.log('Instructor id:', instructorId);

  console.log('Creating demo paid course...');
  const { data: course } = await supabase.from('courses').insert([{ title: 'Demo: Build with EduNexis', slug: 'demo-build', description: 'Demo course with Stripe Checkout and YouTube lessons', price_cents: 2500, instructor_id: instructorId, published: true }]).select().single();
  console.log('Demo course id:', course.id);

  console.log('Creating lessons...');
  await supabase.from('lessons').insert([
    { course_id: course.id, title: 'Welcome — Intro & Setup', youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', position: 1 },
    { course_id: course.id, title: 'Lesson 2 — Basics & Playback', youtube_url: 'https://www.youtube.com/watch?v=2Z4m4lnjxkY', position: 2 }
  ]);

  console.log('Creating free demo course...');
  const { data: freeCourse } = await supabase.from('courses').insert([{ title: 'Free Demo Course', slug: 'demo-free', description: 'Free course for testing enroll endpoint', price_cents: 0, instructor_id: instructorId, published: true }]).select().single();
  await supabase.from('lessons').insert([{ course_id: freeCourse.id, title: 'Free Course — Welcome', youtube_url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U', position: 1 }]);

  console.log('Done. Demo courses seeded.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
