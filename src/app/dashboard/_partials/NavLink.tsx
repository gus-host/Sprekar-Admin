"use client";

import { cn } from "@/lib/utils";
import { removeUserTokenCookie } from "@/utils/helper/auth/cookieUtility";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
}

export default function NavLink({
  href,
  children,
  className = "",
  onClick,
  activeClassName = "opacity-100",
}: NavLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  // If this is a normal route, highlight it when active:
  const isActive =
    href !== "/dashboard" ? pathname.includes(href) : pathname === href;

  // Logout handler
  const handleLogout = async () => {
    // 1) Hit our logout API to clear the cookies
    await fetch("/api/auth/logout", {
      method: "GET",
      credentials: "include", // ensures cookies are sent back
    });

    // 2) Now redirect to /login
    router.replace("/login");
  };

  // If this NavLink is pointing at /login, render a button that logs out instead:
  if (href === "/login") {
    return (
      <button
        onClick={handleLogout}
        className={cn(
          className,
          "opacity-100", // always fully opaque for login/logout
          activeClassName // in case you want to style it when active
        )}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        {children}
      </button>
    );
  }

  // Otherwise render a normal Link
  return (
    <Link
      href={href}
      className={cn(className, isActive ? activeClassName : "opacity-50")}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
