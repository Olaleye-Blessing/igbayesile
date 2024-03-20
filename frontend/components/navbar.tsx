import HomeLogo from "./home-logo";

const Navbar = () => {
  return (
    <nav className="layout border-b" id="main-nav">
      <div>
        <HomeLogo />
      </div>
      <form>search from</form>
      <div>
        <p>auth link or profile</p>
      </div>
    </nav>
  );
};

export default Navbar;
