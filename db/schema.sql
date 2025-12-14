-- Supabase starter schema for EduNexis
-- Run this in Supabase SQL editor (or via migrations)

-- Simple users table (Supabase Auth exists; this is optional for profile data)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  full_name text,
  role text default 'student',
  created_at timestamptz default now()
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  description text,
  price_cents int default 0,
  instructor_id uuid references users(id) on delete set null,
  published boolean default false,
  created_at timestamptz default now()
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  youtube_url text,
  position int default 0,
  created_at timestamptz default now()
);

create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  status text default 'active',
  purchased_at timestamptz,
  access_expires_at timestamptz,
  price_cents int,
  created_at timestamptz default now()
);

create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete cascade,
  completed_at timestamptz
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid references enrollments(id) on delete set null,
  stripe_payment_id text,
  amount_cents int,
  status text,
  created_at timestamptz default now()
);
