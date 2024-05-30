import Main from "./_components/main";
import { TPage } from "@ui/types/page";

type PageProps = TPage<{ hotel: string }>;

export default function Page({ params }: PageProps) {
  return (
    <main className="min-h-screen pb-8">
      <div className="layout">
        <Main hotelId={params.hotel} />
      </div>
    </main>
  );
}
