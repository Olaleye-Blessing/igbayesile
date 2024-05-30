import { PropsWithChildren } from "react";
import ReactQuery from "./react-query";
import { Theme } from "@ui/components/providers/theme";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <Theme
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ReactQuery>{children}</ReactQuery>
      </Theme>
    </>
  );
}
