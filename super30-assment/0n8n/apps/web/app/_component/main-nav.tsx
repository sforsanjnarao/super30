// file: components/main-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Make sure you have this utility from Shadcn

export function MainNav() {
  const pathname = usePathname();

  const routes = [
    { href: "/workflow", label: "Workflows" },
    { href: "/credentials", label: "Credentials" },
    { href: "/executions", label: "Executions" },
  ];

  return (
    <nav className="border-b">
      <div className="flex items-center space-x-8">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "py-4 px-1 border-b-2 text-sm font-medium",
              pathname === route.href
                ? "border-primary text-primary" // Active tab style
                : "border-transparent text-muted-foreground hover:text-primary" // Inactive tab style
            )}
          >
            {route.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}