import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import LessonPlayer from "../../components/LessonPlayer";
import axios from "axios";

export default function CoursePage({ course, lessons }: any) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;

  async function handleBuy() {
    try {
      const res = await axios.post("/api/create-checkout-session", { courseId: course.id });
      const { sessionUrl } = res.data;
      window.location.href = sessionUrl;
    } catch (err) {
      console.error(err);
      alert("Could not create checkout session");
    }
  }

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <p className="text-gray-600 mt-2">{course.description}</p>

      <div className="mt-6">
        <button onClick={handleBuy} className="px-4 py-2 bg-green-600 text-white rounded">
          {course.price_cents ? `Buy for $${(course.price_cents / 100).toFixed(2)}` : "Enroll (Free)"}
        </button>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Lessons</h2>
        {lessons.map((l: any) => (
          <div key={l.id} className="mb-6">
            <h3 className="font-medium">{l.title}</h3>
            {l.youtube_url ? <div className="mt-2"><LessonPlayer youtubeUrl={l.youtube_url} /></div> : <p>No content</p>}
          </div>
        ))}
      </section>
    </main>
  );
}

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const { data: courses } = await supabase.from("courses").select("*").eq("id", id).single();
  const { data: lessons } = await supabase.from("lessons").select("*").eq("course_id", id).order("position", { ascending: true });

  if (!courses) return { notFound: true };
  return { props: { course: courses, lessons: lessons || [] } };
}
