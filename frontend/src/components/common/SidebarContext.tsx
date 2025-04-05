// components/common/SidebarContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

export interface SubItem {
  id: number;
  name: string;
  path: string;
  count: number;
}

interface SidebarContextType {
  subItems: SubItem[];
  setSubItems: (items: SubItem[]) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  subItems: [],
  setSubItems: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [subItems, setSubItems] = useState<SubItem[]>([
    { id: 1, name: "HP仕事", path: "/folder/hp-work", count: 4 },
    { id: 2, name: "LiT!", path: "/folder/lit", count: 3 },
  ]);

  return (
    <SidebarContext.Provider value={{ subItems, setSubItems }}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarContext;
