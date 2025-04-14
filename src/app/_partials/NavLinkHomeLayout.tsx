"use client";

import React from "react";
import { NavLinkProps } from "../dashboard/_partials/NavLink";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NavLinkHomeLayout({
  href,
  children,
  onClick,
  className = "",
  activeClassName = "opacity-100",
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = href !== "/" ? pathname.includes(href) : false;
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
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
