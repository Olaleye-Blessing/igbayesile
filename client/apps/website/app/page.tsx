import Footer from "@website/components/footer";
import Header from "./_home/header";
import "./_home/index.css";
import Search from "./_home/search";
import TopRatedHotel from "./_home/top-rated/top-rated-hotel";
import BestRoomDeal from "./_home/best-room-deal";
import SignUp from "./_home/sign-up";

export default function Home() {
  return (
    <>
      <main className="layout">
        <Header />
        <Search />
        <TopRatedHotel />
        <BestRoomDeal />
        <SignUp />
      </main>
      <Footer />
    </>
  );
}
