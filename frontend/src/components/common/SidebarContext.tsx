// context/SidebarContext.tsx
"use client";

import { createContext, useContext } from "react";

interface SubItem {
    id: number;
  name: string;
  path: string;
  count: number;
}

interface SidebarContextType {
  subItems: SubItem[];
}

const SidebarContext = createContext<SidebarContextType>({
  subItems: [],
});

export const useSidebar = () => useContext(SidebarContext);

export default SidebarContext;
