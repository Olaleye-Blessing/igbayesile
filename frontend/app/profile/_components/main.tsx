import dynamic from "next/dynamic";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import useAuthStore from "@/stores/auth";
import useSearchParameters from "@/hooks/use-search-parameters";
import Header from "./header";
import Profile from "./profile";
import Loading from "@/app/loading";

const Bookings = dynamic(() => import("./bookings"), {
  ssr: false,
  loading: () => <Loading />,
});

const Hotels = dynamic(() => import("./hotels"), {
  ssr: false,
  loading: () => <Loading />,
});
const Settings = dynamic(() => import("./settings"), {
  ssr: false,
  loading: () => <Loading />,
});

export default function Main() {
  const user = useAuthStore((state) => state.user);
  const searchParams = useSearchParameters();
  const tab = searchParams.getParam("tab") || "bookings";

  if (!user) return null;

  return (
    <main className="body-min-screen-h">
      <div className="layout pt-4 px-0 sm:flex sm:items-start sm:justify-start sm:pt-0">
        <Profile user={user} />
        <Tabs value={tab} className="w-full">
          <Header user={user} />
          <TabsContent
            value="bookings"
            className="px-4 sm:px-0 sm:pr-4 lg:pr-0"
          >
            <Bookings />
          </TabsContent>
          <TabsContent value="hotels" className="px-4 sm:px-0 sm:pr-4 lg:pr-0">
            <Hotels user={user} />
          </TabsContent>
          <TabsContent
            value="settings"
            className="px-4 sm:px-0 sm:pr-4 lg:pr-0"
          >
            <Settings user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
