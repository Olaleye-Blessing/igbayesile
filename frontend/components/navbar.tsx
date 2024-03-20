import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="layout border-b">
      <Link href="/">Site logo</Link>
      <form>search from</form>
      <div>
        <p>auth link or profile</p>
      </div>
    </nav>
  );
};

export default Navbar;
