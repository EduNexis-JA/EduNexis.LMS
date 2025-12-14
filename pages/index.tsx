import { supabase } from "../lib/supabaseClient";
import CourseCard from "../components/CourseCard";

export default function Home({ courses }: any) {
  return (
    <main className="container py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">EduNexis — Courses</h1>
        <p className="text-gray-600">Self-paced courses with Stripe Checkout + YouTube lessons</p>
      </header>

      <section className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {courses.length === 0 && <div>No courses yet. Create one in Supabase.</div>}
        {courses.map((c: any) => <CourseCard key={c.id} course={c} />)}
      </section>
    </main>
  );
}

export async function getServerSideProps() {
  const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
  return { props: { courses: data || [] } };
}
