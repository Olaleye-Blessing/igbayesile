import { TPage } from "@ui/types/page";
import Main from "./_components/main";

export default function Page(props: TPage<{ hotel: string }>) {
  return <Main hotel={props.params.hotel} />;
}
