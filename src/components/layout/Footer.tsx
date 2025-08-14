'use client';

import { ArrowUpRight } from "lucide-react";
export default function Footer() {
  const navigation = [
    { name: "Love In Action", href: "#" }
  ];

  const social = [
    { name: "Instagram", href: "https://www.instagram.com/loveinaction_lia/" },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/loveinaction_/" },
  ];

  const legal = [{ name: "© All rights reserved", href: "#" }];

  return (
    <section className="flex flex-col items-center gap-14 py-32">
      <nav className=" flex flex-col items-center gap-4">
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {navigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="font-medium transition-opacity hover:opacity-75"
              >
                {item.name}
              </a>
            </li>
          ))}
          {social.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="flex items-center gap-0.5 font-medium transition-opacity hover:opacity-75"
              >
                {item.name} <ArrowUpRight className="size-4" />
              </a>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {legal.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="text-sm text-muted-foreground transition-opacity hover:opacity-75"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
};

 
