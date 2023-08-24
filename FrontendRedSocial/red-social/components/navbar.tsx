"use client";

import { siteConfig } from "@/config/site";

import NextLink from "next/link";

import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();
  return (
    <>
      {siteConfig.navItems.map((item) => (
        <div key={item.href} className="flex gap-1">
          {item.icon}

          <NextLink
            className={`text-2xl ${pathname === item.href && "font-bold"}`}
            key={item.href}
            color="foreground"
            href={item.href}
          >
            {item.label}
          </NextLink>
        </div>
      ))}
    </>
  );
};
