// components/common/ClientProviders.tsx
"use client";

import { ReactNode } from "react";
import { SidebarProvider } from "@/components/common/SidebarContext";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
