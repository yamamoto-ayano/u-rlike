// components/common/ClientProviders.tsx
"use client";

import { ReactNode } from "react";
import { ModalProvider } from "../folder/FolderFormContext";
import { SidebarProvider } from "@/components/common/SidebarContext";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
  <SidebarProvider>
    <ModalProvider>
      {children}
    </ModalProvider>
  </SidebarProvider>
  )
}
