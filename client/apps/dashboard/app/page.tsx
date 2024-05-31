import Bookings from "./_home/bookings";
import Rooms from "./_home/rooms";

// TODO: Use this design to create the landing page: https://www.behance.net/gallery/141655009/Hotel-Aid-Hotel-Management-Web-App
export default function Page() {
  return (
    <main className="">
      <Bookings />
      <section>
        <Rooms />
      </section>
      <aside></aside>
    </main>
  );
}
