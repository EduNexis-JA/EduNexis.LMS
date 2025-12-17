/*
  Run with: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-demo.js
  This uses the service role key to insert a demo instructor, course, and lessons.
*/
const { createClient } = require('@supabase/supabase-js');

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(url, key);

  try {
    console.log('Inserting demo instructor...');
    await supabase.from('users').insert([
      { id: '00000000-0000-0000-0000-000000000001', email: 'instructor@edunexis.test', full_name: 'Instructor One', role: 'instructor' }
    ]).throwOnError();

    console.log('Inserting demo courses...');
    await supabase.from('courses').insert([
      { id: '00000000-0000-0000-0000-000000000010', title: 'Intro to EduNexis (Demo)', slug: 'intro-edunexis-demo', description: 'Full demo course seeded for local testing.', price_cents: 5000, instructor_id: '00000000-0000-0000-0000-000000000001', published: true },
      { id: '00000000-0000-0000-0000-000000000020', title: 'Intro — Free Demo', slug: 'intro-free-demo', description: 'A free demo course to test enrollment.', price_cents: 0, instructor_id: '00000000-0000-0000-0000-000000000001', published: true }
    ]).throwOnError();

    console.log('Inserting demo lessons...');
    await supabase.from('lessons').insert([
      { id: '00000000-0000-0000-0000-000000000100', course_id: '00000000-0000-0000-0000-000000000010', title: 'Welcome & Overview', youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', position: 1 },
      { id: '00000000-0000-0000-0000-000000000101', course_id: '00000000-0000-0000-0000-000000000010', title: 'Basics & Setup', youtube_url: 'https://www.youtube.com/watch?v=2Z4m4lnjxkY', position: 2 },
      { id: '00000000-0000-0000-0000-000000000102', course_id: '00000000-0000-0000-0000-000000000010', title: 'Lesson: Building the Course', youtube_url: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ', position: 3 }
    ]).throwOnError();

    console.log('Seed completed successfully.');
  } catch (err) {
    console.error('Seed error:', err.message || err);
    process.exit(1);
  }
}

main();
