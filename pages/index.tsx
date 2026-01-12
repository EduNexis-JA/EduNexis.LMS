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
  // If Supabase is not configured, use demo data
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const demoPath = path.join(process.cwd(), "data", "demo.json");
      const raw = await fs.readFile(demoPath, "utf8");
      const demo = JSON.parse(raw);
      return { props: { courses: demo.courses || [] } };
    } catch (err) {
      console.error("Error loading demo data:", err);
      return { props: { courses: [] } };
    }
  }

  // Try to fetch from Supabase
  try {
    const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    // If no courses, fallback to demo data
    if (!data || data.length === 0) {
      const fs = await import("fs/promises");
      const path = await import("path");
      const demoPath = path.join(process.cwd(), "data", "demo.json");
      const raw = await fs.readFile(demoPath, "utf8");
      const demo = JSON.parse(raw);
      return { props: { courses: demo.courses || [] } };
    }
    return { props: { courses: data || [] } };
  } catch (err) {
    console.error("Error fetching courses from Supabase:", err);
    // fallback to demo data
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const demoPath = path.join(process.cwd(), "data", "demo.json");
      const raw = await fs.readFile(demoPath, "utf8");
      const demo = JSON.parse(raw);
      return { props: { courses: demo.courses || [] } };
    } catch (demoErr) {
      console.error("Error loading demo data:", demoErr);
      return { props: { courses: [] } };
    }
  }
}
