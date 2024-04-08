import { ShieldCheck } from "lucide-react";

export default function Header() {
  return (
    <header className="header mt-8 rounded-md overflow-hidden">
      <div className="header__layout pt-16 pb-20 px-6 md:max-w-[70%] lg:max-w-[51%]">
        <h1>
          Find Deals On <span className="font-bold">Hotels</span> and Enjoy Your
          Dream Vacation.
        </h1>
        <p className="my-6 font-semibold">
          We have got you covered with amazing deals at thousands upon thousands
          of top hotels in cities and countries worldwide
        </p>
        <div className="flex items-center justify-start">
          <span className="w-8 h-8 flex items-center justify-center border border-primary rounded-full mr-2">
            <ShieldCheck className="w-4 h-5 text-blue-900" />
          </span>
          <span className="text-sm font-bold">Tested and Trusted</span>
        </div>
      </div>
    </header>
  );
}
