import { ThemeToggle } from "@/components/theme-toggle";
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
      <footer className="border-t border-border mt-8">
        <div className="layout px-4 py-4 flex items-center justify-center">
          <p className="flex items-center justify-center">
            Author:{" "}
            <a
              href="https://www.linkedin.com/in/blessing-olaleye-139a22204/"
              target="_blank"
              rel="noopener"
              className="text-primary font-bold underline"
            >
              Olaleye Blessing
            </a>
            <span>
              <ThemeToggle />
            </span>
          </p>
        </div>
      </footer>
    </>
  );
}
