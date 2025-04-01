"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "like", path: "/like" },
    { name: "superlike", path: "/superlike" },
    { name: "recomend", path: "/recommend" },
    {
      name: "フォルダ",
      path: "/folder",
      isFolder: true,
      subItems: [
        { name: "HP仕事", path: "/folder/hp-work" },
        { name: "LiT!", path: "/folder/lit" },
      ],
    },
  ]

  return (
    <div className={cn("flex flex-col p-4 border-r w-64 ", className)}>
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <div key={item.path}>
            <Link
              href={item.path}
              className={cn(
                "flex items-center w-full px-2 py-2 text-lg font-bold border-b",
                pathname === item.path ? "text-primary" : "text-foreground",
              )}
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
                  >
                    <span className="mr-2">▶</span> {subItem.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <Button variant="ghost" className="mt-auto w-full justify-center p-2 rounded-full">
        <Plus className="h-8 w-8" />
      </Button>
    </div>
  )
}

