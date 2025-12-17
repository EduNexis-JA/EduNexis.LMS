-- Demo seed for EduNexis
-- Run this in Supabase SQL editor or via the provided seeder script

-- Create an instructor
insert into users (id, email, full_name, role)
values ('00000000-0000-0000-0000-000000000001', 'instructor@edunexis.test', 'Instructor One', 'instructor')
on conflict (id) do nothing;

-- Create a demo course
insert into courses (id, title, slug, description, price_cents, instructor_id, published)
values ('00000000-0000-0000-0000-000000000010', 'Intro to EduNexis (Demo)', 'intro-edunexis-demo', 'Full demo course seeded for local testing.', 5000, '00000000-0000-0000-0000-000000000001', true)
on conflict (id) do nothing;

-- Create lessons
insert into lessons (id, course_id, title, youtube_url, position)
values
('00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000010', 'Welcome & Overview', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1),
('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000010', 'Basics & Setup', 'https://www.youtube.com/watch?v=2Z4m4lnjxkY', 2),
('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000010', 'Lesson: Building the Course', 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ', 3)
on conflict (id) do nothing;

-- Optional: create a free course demo
insert into courses (id, title, slug, description, price_cents, instructor_id, published)
values ('00000000-0000-0000-0000-000000000020', 'Intro — Free Demo', 'intro-free-demo', 'A free demo course to test enrollment.', 0, '00000000-0000-0000-0000-000000000001', true)
on conflict (id) do nothing;
-- Demo seed for EduNexis
-- Run this in Supabase SQL editor or via `scripts/seed_demo.mjs`

-- Instructors / Users
insert into users (email, full_name, role)
values
  ('demo-instructor@edunexis.test', 'Instructor Demo', 'instructor'),
  ('demo-student@edunexis.test', 'Student Demo', 'student')
on conflict (email) do nothing;

-- Create a paid course
insert into courses (title, slug, description, price_cents, published)
values ('Intro to EduNexis - Paid', 'intro-edunexis-paid', 'Demo paid course for EduNexis starter', 5000, true)
on conflict (slug) do nothing;

-- Create a free course
insert into courses (title, slug, description, price_cents, published)
values ('Intro to EduNexis - Free', 'intro-edunexis-free', 'Demo free course for EduNexis starter', 0, true)
on conflict (slug) do nothing;

-- Link lessons to the paid course
-- Replace the SELECTs below with the course id(s) returned in your Supabase query if you prefer deterministic ids.
with paid as (select id as course_id from courses where slug = 'intro-edunexis-paid')
insert into lessons (course_id, title, youtube_url, position)
select course_id, 'Welcome & Overview', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1 from paid
union all
select course_id, 'Lesson 2: Basics', 'https://www.youtube.com/watch?v=2Z4m4lnjxkY', 2 from paid
union all
select course_id, 'Lesson 3: Next Steps', 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ', 3 from paid
on conflict do nothing;

-- Link lessons to the free course
with free as (select id as course_id from courses where slug = 'intro-edunexis-free')
insert into lessons (course_id, title, youtube_url, position)
select course_id, 'Welcome (Free)', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1 from free
on conflict do nothing;

-- Optional: enroll the demo student into the free course so you can see enrolled UX
insert into enrollments (user_id, course_id, status, purchased_at, price_cents)
select u.id, c.id, 'active', now(), c.price_cents
from users u, courses c
where u.email = 'demo-student@edunexis.test' and c.slug = 'intro-edunexis-free'
on conflict do nothing;
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
