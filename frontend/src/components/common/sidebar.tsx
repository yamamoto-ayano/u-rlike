"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/common/SidebarContext"
import { useModal } from "@/components/folder/FolderFormContext"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { isOpen, closeModal, openModal } = useModal()
  const pathname = usePathname()
  const { subItems } = useSidebar()
  const { isSidebarOpen, closeSidebar } = useSidebar()

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "like", path: "/like" },
    { name: "superlike", path: "/superlike" },
    { name: "recomend", path: "/recommend" },
    {
      name: "フォルダ",
      path: "/folder",
      isFolder: true,
      subItems,
    },
  ]

  return (
    <>
      {/* モバイル用サイドバー（オーバーレイ） */}
      <div className={cn(
        "fixed inset-0 z-200 bg-black/50 transition-opacity lg:hidden",
        isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )} onClick={closeSidebar} />

      <div className={cn(
        // PCもモバイルも縦レイアウト。高さは画面いっぱいに
        "fixed top-8px left-0 z-1000   bg-white w-64 p-4 transform transition-transform lg:relative lg:translate-x-0 flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}>
        {/* 閉じるボタン（モバイル用） */}
        <div className="flex justify-end lg:hidden">
        </div>

        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <div key={item.path}>
              <Link
                href={item.path}
                className={cn(
                  "flex items-center w-full px-2 py-2 text-lg font-bold border-b",
                  pathname === item.path ? "text-primary" : "text-foreground",
                )}
                onClick={closeSidebar}
              >
                {item.name}
              </Link>

              {item.isFolder && item.subItems && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.path}
                      href={subItem.path}
                      className={cn(
                        "flex items-center w-full px-2 py-2 text-lg font-bold border-b",
                        pathname === subItem.path ? "text-primary" : "text-muted-foreground",
                      )}
                      onClick={closeSidebar}
                    >
                      <span className="mr-2">▶</span> {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <Button 
          variant="ghost" 
          className="mt-auto w-full justify-center p-2 rounded-full"
          onClick={() => {
            openModal()
            closeSidebar()
          }}
        >
          <Plus className="h-8 w-8" />
        </Button>
      </div>
    </>
  )
}
