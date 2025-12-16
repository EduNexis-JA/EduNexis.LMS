-- Demo seed for EduNexis starter
-- Run this SQL in your Supabase SQL editor to create a demo instructor, course, and lessons

-- Create an instructor
insert into users (email, full_name, role)
values ('instructor@edunexis.demo', 'Instructor Demo', 'instructor')
on conflict (email) do nothing;

-- Get instructor id
-- Copy the id from the select below and replace <INSTRUCTOR_ID> in the following statements if desired
select id, email from users where email = 'instructor@edunexis.demo';

-- Insert a demo paid course (if it does not exist)
insert into courses (title, slug, description, price_cents, instructor_id, published)
values (
  'Demo: Build with EduNexis',
  'demo-build',
  'A short demo course showing EduNexis features (Stripe checkout + YouTube lessons).',
  2500,
  (select id from users where email = 'instructor@edunexis.demo' limit 1),
  true
)
on conflict (slug) do update set title = excluded.title;

-- Get course id
select id, title, slug from courses where slug = 'demo-build';

-- Insert lessons for the demo course
insert into lessons (course_id, title, youtube_url, position)
values (
  (select id from courses where slug = 'demo-build' limit 1),
  'Welcome — Intro & Setup',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  1
), (
  (select id from courses where slug = 'demo-build' limit 1),
  'Lesson 2 — Basics & Playback',
  'https://www.youtube.com/watch?v=2Z4m4lnjxkY',
  2
);

-- Optional: create a free course to test enroll endpoint
insert into courses (title, slug, description, price_cents, instructor_id, published)
values (
  'Free Demo Course',
  'demo-free',
  'A free demo course to test enroll endpoint',
  0,
  (select id from users where email = 'instructor@edunexis.demo' limit 1),
  true
)
on conflict (slug) do update set title = excluded.title;

insert into lessons (course_id, title, youtube_url, position)
values (
  (select id from courses where slug = 'demo-free' limit 1),
  'Free Course — Welcome',
  'https://www.youtube.com/watch?v=ysz5S6PUM-U',
  1
)
on conflict do nothing;
