import Logo from "./Logo";
import NavLinkHomeLayout from "./NavLinkHomeLayout";

export default function Header() {
  return (
    <div className={"max-w-[1000px] p-[20px] mx-auto"}>
      <header className="flex gap-3 justify-between items-center px-[30px] py-[15px] bg-[#1D1D1D] rounded-[15px]">
        <Logo color="text-white" type="home-logo" />
        <nav className="text-white">
          <ul className="flex items-center gap-[20px] text-[14px]">
            <li>
              <NavLinkHomeLayout className="hover:opacity-[100]" href="#">
                Features
              </NavLinkHomeLayout>
            </li>
            <li>
              <NavLinkHomeLayout className={"hover:opacity-[100]"} href="#">
                Join event
              </NavLinkHomeLayout>
            </li>
            <li>
              <NavLinkHomeLayout className={"hover:opacity-[100]"} href="#">
                Host an event
              </NavLinkHomeLayout>
            </li>
            <li>
              <NavLinkHomeLayout className={"hover:opacity-[100]"} href="#">
                About Us
              </NavLinkHomeLayout>
            </li>
            <li>
              <NavLinkHomeLayout className={"hover:opacity-[100]"} href="#">
                FAQs
              </NavLinkHomeLayout>
            </li>
            <li>
              <NavLinkHomeLayout className={"hover:opacity-[100]"} href="#">
                Contact
              </NavLinkHomeLayout>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}
