import Main from "./_components/main";
import { TPage } from "@ui/types/page";

type PageProps = TPage<{ room: string }>;

export default function Page({ params }: PageProps) {
  return (
    <main className="min-h-screen pb-8">
      <div className="layout">
        <Main roomId={params.room} />
      </div>
    </main>
  );
}
