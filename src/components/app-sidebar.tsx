"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { BarChart3, LayoutDashboard, LogOut, Users } from "lucide-react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { currentUser } from "@/lib/data";
import { cn } from "@/lib/utils";

const links = [
  { label: "Visão geral", href: "/", icon: LayoutDashboard },
  { label: "Clientes", href: "/clientes", icon: Users },
  { label: "Análise", href: "/analise", icon: BarChart3 },
];

export function AppSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 border-r bg-neutral-50">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <Logo open={open} />
          <nav className="mt-8 flex flex-col gap-1">
            {links.map(({ label, href, icon: Icon }) => (
              <SidebarLink
                key={href}
                link={{
                  label,
                  href,
                  icon: (
                    <Icon
                      className={cn(
                        "size-5 shrink-0 text-neutral-500",
                        isActive(href) && "text-neutral-900",
                      )}
                    />
                  ),
                }}
                className={cn(
                  "rounded-md px-2",
                  isActive(href) && "bg-white shadow-sm ring-1 ring-neutral-200",
                )}
              />
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-1">
          <SidebarLink
            link={{
              label: "Sair",
              href: "/login",
              icon: <LogOut className="size-5 shrink-0 text-neutral-500" />,
            }}
            className="px-2"
          />
          <SidebarLink
            link={{
              label: currentUser.name,
              href: "/",
              icon: (
                <Avatar size="sm" className="shrink-0">
                  <AvatarFallback className="bg-neutral-900 text-[10px] text-white">
                    {currentUser.initials}
                  </AvatarFallback>
                </Avatar>
              ),
            }}
            className="px-1"
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

function Logo({ open }: { open: boolean }) {
  return (
    <div className="flex items-center gap-2 px-1 py-1">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-neutral-900 text-xs font-bold text-white">
        I1
      </div>
      <motion.span
        animate={{ opacity: open ? 1 : 0 }}
        className="whitespace-pre text-sm font-semibold tracking-tight text-neutral-900"
      >
        ISTORIA <span className="text-neutral-400">ONE</span>
      </motion.span>
    </div>
  );
}
