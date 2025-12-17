-- Demo seed for EduNexis
insert into users (id, email, full_name, role) values ('11111111-1111-1111-1111-111111111111', 'instructor@edunexis.test', 'Instructor Demo', 'instructor');

insert into courses (id, title, slug, description, price_cents, instructor_id, published)
values ('22222222-2222-2222-2222-222222222222', 'Intro to EduNexis (Demo)', 'intro-edunexis-demo', 'Demo course with lessons and sample content', 0, '11111111-1111-1111-1111-111111111111', true);

insert into lessons (id, course_id, title, youtube_url, position)
values ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Welcome & Overview', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1),
       ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Lesson 2: Basics', 'https://www.youtube.com/watch?v=2Z4m4lnjxkY', 2);
