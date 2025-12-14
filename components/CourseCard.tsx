import Link from "next/link";

type Props = {
  course: {
    id: string;
    title: string;
    description: string | null;
    price_cents: number | null;
  };
};

export default function CourseCard({ course }: Props) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold">{course.title}</h3>
      <p className="text-sm text-gray-600 mt-2">{course.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm font-medium">
          {course.price_cents ? `$${(course.price_cents / 100).toFixed(2)}` : "Free"}
        </div>
        <Link href={`/courses/${course.id}`} className="px-3 py-2 bg-blue-600 text-white rounded">View</Link>
      </div>
    </div>
  );
}
