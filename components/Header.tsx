"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  return (
    <header>
      <nav>
        <Link href={"/"} className="logo">
          <Image src={"/icons/logo.png"} width={24} height={24} alt="logo" />
          <p>DevEvent</p>
        </Link>
        <ul>
          <Link
            href={"/"}
            className={`${pathname === "/" && "text-[#5dfeca] border-b-2 border-b-[#5dfeca]"}`}
          >
            Home
          </Link>
          <Link
            href={"/events"}
            className={`${pathname === "/events" && "text-[#5dfeca] border-b-2 border-b-[#5dfeca]"}`}
          >
            Events
          </Link>
          <Link
            href={"/create-event"}
            className={`${pathname === "/create-event" && "text-[#5dfeca] border-b-2 border-b-[#5dfeca]"}`}
          >
            Create Event
          </Link>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
