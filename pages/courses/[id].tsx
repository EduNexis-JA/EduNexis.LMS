import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import LessonPlayer from "../../components/LessonPlayer";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CoursePage({ course, lessons }: any) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // Get currently logged-in user (if any)
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleBuy() {
    try {
      // Require login for paid checkout to link purchase to user
      if (!user) {
        alert("Please sign in to purchase this course.");
        return;
      }

      const payload = {
        courseId: course.id,
        userId: user.id,
        userEmail: user.email
      };

      const res = await axios.post("/api/create-checkout-session", payload);
      const { sessionUrl } = res.data;
      if (sessionUrl) {
        window.location.href = sessionUrl;
      } else {
        alert("Checkout session not created.");
      }
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
  try {
    const { data: course } = await supabase.from("courses").select("*").eq("id", id).single();
    const { data: lessons } = await supabase.from("lessons").select("*").eq("course_id", id).order("position", { ascending: true });

    if (!course) return { notFound: true };
    return { props: { course: course, lessons: lessons || [] } };
  } catch (err) {
    console.error("Error fetching course or lessons from Supabase:", err);
    return { props: { course: null, lessons: [] } };
  }
}
