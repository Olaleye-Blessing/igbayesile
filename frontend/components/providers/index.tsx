import { PropsWithChildren } from "react";
import ReactQuery from "./react-query";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <ReactQuery>{children}</ReactQuery>
    </>
  );
}
