"use client"
import { Logo } from "./logo"
import { Flex } from "@/components/ui/flex"
import { Menu } from "lucide-react"
import { useSidebar } from "@/components/common/SidebarContext"

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="top-0 z-300 w-full bg-gradient-to-r from-blue-300 via-pink-300 to-yellow-200">
      <Flex className="items-center justify-between p-2">
        <div className="lg:hidden">
          <button onClick={toggleSidebar} className="p-2">
            <Menu className="h-6 w-6 text-black" />
          </button>
        </div>
        <div className="flex-1">
          <Logo />
        </div>
        {title && (
          <div className="hidden lg:block px-4 py-2 text-muted-foreground text-sm">
            {title}
          </div>
        )}
      </Flex>
    </header>
  )
}
