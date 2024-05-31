import { TriangleAlert } from "lucide-react";
// import Bookings from "./_home/bookings";
// import Rooms from "./_home/rooms";

// TODO: Use this design to create the landing page: https://www.behance.net/gallery/141655009/Hotel-Aid-Hotel-Management-Web-App
export default function Page() {
  return (
    <main className="flex items-center justify-center text-center flex-col">
      {/* <Bookings />
      <section>
        <Rooms />
      </section>
      <aside></aside> */}
      <p className="text-lg max-w-sm">
        Select one of your hotels to see its details
      </p>
      <div className="text-red-800">
        <TriangleAlert className="w-20 h-20 text-red-800" />
      </div>
    </main>
  );
}
