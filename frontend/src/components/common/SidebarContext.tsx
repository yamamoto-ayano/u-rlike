"use client";

import { createContext, useContext, useState } from "react";

export interface SubItem {
  folderid: number;
  name: string;
  path: string;
  count: number;
}

interface SidebarContextType {
  subItems: SubItem[];
  setSubItems: (items: SubItem[]) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  subItems: [],
  setSubItems: () => {},
  isSidebarOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [subItems, setSubItems] = useState<SubItem[]>([
    { folderid: 1, name: "HP仕事", path: "/folder/1", count: 4 },
    { folderid: 2, name: "LiT!", path: "/folder/2", count: 3 },
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <SidebarContext.Provider
      value={{
        subItems,
        setSubItems,
        isSidebarOpen,
        toggleSidebar,
        closeSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
