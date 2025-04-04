import { Logo } from "./logo"
import { Flex } from "@/components/ui/flex"
interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="top-0 z-10 w-full bg-gray-200">
        <Flex>
            <div className="gradient-bg p-2 w-full ">
                <Logo />
            </div>
            {title && <div className="px-4 py-2 text-muted-foreground text-sm w-full">{title}</div>}
        </Flex>
    </header>
  )
}