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
  lng?: string;
}

export default function NavLink({
  href,
  children,
  className = "",
  onClick,
  activeClassName = "bg-[#0143aa]",
  lng = "en",
}: NavLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  // If this is a normal route, highlight it when active:
  const isActive =
    href !== `/dashboard`
      ? pathname.includes(href)
      : pathname === `/${lng}${href}`;

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
          isActive
            ? activeClassName
            : "opacity-[100] hover:bg-[#4d4d4d] active:bg-[#0143aa] px-2 py-1 rounded-sm",
          className,
          "cursor-pointer" // always fully opaque for login/logout
        )}
      >
        {children}
      </button>
    );
  }

  // Otherwise render a normal Link
  return (
    <Link
      href={href}
      className={cn(
        "rounded-sm py-1 px-2",
        className,
        isActive
          ? activeClassName
          : "opacity-100 hover:bg-[#4d4d4d] active:bg-[#0143aa]"
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
