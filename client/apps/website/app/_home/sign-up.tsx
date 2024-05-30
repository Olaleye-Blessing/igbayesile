import { buttonVariants } from "@ui/components/ui/button";
import Link from "next/link";

export default function SignUp() {
  return (
    <section className="signup__section cardboard mx-auto mt-8">
      <div className="flex items-start justify-between flex-wrap px-6 py-20 bg-gradient-to-r from-40% via-50% to-60% from-[#0006] via-[#0004] to-[#0002] text-white">
        <div className="mr-2">
          <header className="mb-2">
            <h2>Sign Up</h2>
          </header>
          <div>
            <p>Don&apos;t wanna miss anything? Sign up to:</p>
            <ul className="list-outside list-disc">
              <li>get alert on new deals</li>
              <li>get discount on special deals</li>
            </ul>
          </div>
        </div>
        <div className="self-stretch flex items-center justify-center">
          <Link href={"/auth/signup"} className={buttonVariants({})}>
            Sign Up
          </Link>
        </div>
      </div>
    </section>
  );
}
