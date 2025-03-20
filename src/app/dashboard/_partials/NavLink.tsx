"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  activeClassName?: string;
}

export default function NavLink({
  href,
  children,
  onClick,
  className = "",
  activeClassName = "opacity-100",
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`${className} ${isActive ? activeClassName : "opacity-50"}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
