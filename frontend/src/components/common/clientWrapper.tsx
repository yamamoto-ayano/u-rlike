// components/common/ClientProviders.tsx
"use client"

import { ReactNode } from "react"
import SidebarContext from "@/components/common/SidebarContext"

const folderNav = {
  subItems: [
    { id: 1, name: "HP仕事", path: "/folder/hp-work", count: 4 },
    { id: 2, name: "LiT!", path: "/folder/lit", count: 3 },
  ],
}

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SidebarContext.Provider value={folderNav}>
      {children}
    </SidebarContext.Provider>
  )
}
