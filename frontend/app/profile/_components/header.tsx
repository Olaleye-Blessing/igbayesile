import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tabs as _tabs } from "../_utils/tabs";
import useSearchParameters from "@/hooks/use-search-parameters";
import { IUser } from "@/interfaces/user";

interface HeaderProps {
  user: IUser;
}

export default function Header({ user }: HeaderProps) {
  const searchParams = useSearchParameters();

  const tabs = [..._tabs].filter(
    (tab) => !tab.access || tab.access === user.role,
  );

  // TODO: Make the bg transparent. Then change it to white when user scrolls to the top.
  return (
    <TabsList className="h-auto w-full max-w-none flex-wrap py-2 sticky top-0 left-0 border-b border-gray-500 border-opacity-30 rounded-none">
      {tabs.map((tab) => {
        return (
          <TabsTrigger
            key={tab.label}
            value={tab.label}
            className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
            onClick={() => {
              if (tab.label === "bookings")
                return searchParams.deleteParams(["tab"], "push");

              searchParams.updateParams({ tab: tab.label }, "push");
            }}
          >
            <span className="mr-1">{<tab.Icon className="h-5 w-4" />}</span>
            <span className="capitalize">{tab.label}</span>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
}
