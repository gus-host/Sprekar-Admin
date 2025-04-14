"use client";

import { cn } from "@/lib/utils";
import { removeUserTokenCookie } from "@/utils/helper/auth/cookieUtility";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export interface NavLinkProps {
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
  const isActive =
    href !== "/dashboard" ? pathname.includes(href) : pathname === href;
  const router = useRouter();

  function handleClick() {
    removeUserTokenCookie();
    router.replace("/router");

    return;
  }

  return (
    <Link
      href={href}
      className={cn(
        `${className}`,
        isActive
          ? activeClassName
          : href === "/login"
          ? "opacity-100"
          : "opacity-50"
      )}
      onClick={href === "/login" ? handleClick : onClick}
    >
      {children}
    </Link>
  );
}
