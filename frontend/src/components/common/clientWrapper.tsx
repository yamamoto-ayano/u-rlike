// components/common/ClientProviders.tsx
"use client";

import { ReactNode } from "react";
import { ModalProvider } from "../folder/FolderFormContext";
import { SidebarProvider } from "@/components/common/SidebarContext";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen z-10000000">
      <SidebarProvider>
        <ModalProvider>
          {children}
        </ModalProvider>
      </SidebarProvider>
  </div>
  )
}
