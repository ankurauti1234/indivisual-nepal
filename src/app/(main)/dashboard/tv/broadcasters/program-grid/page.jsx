import NewTVSchedule from "./new-tv";
import { TVSchedule } from "./tv-schedule";

export default function Page() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <section className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Viewership For a Day
        </h1>
        <TVSchedule />
      </section>
      <section className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Programs Running For a Day
        </h1>
        <NewTVSchedule />
      </section>
    </div>
  );
}
