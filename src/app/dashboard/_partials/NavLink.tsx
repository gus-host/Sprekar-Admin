'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}

export default function NavLink({
  href,
  children,
  className = '',
  activeClassName = 'opacity-100',
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname.includes(href);

  return (
    <Link
      href={href}
      className={`${className} ${isActive ? activeClassName : 'opacity-50'}`}
    >
      {children}
    </Link>
  );
}
