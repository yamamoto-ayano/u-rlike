import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative w-12 h-12 p-2">
        <Image src="/images/logo.png" alt="U'RLike Logo" fill className="object-contain" />
      </div>
      <h1 className="text-3xl font-bold font-display text-white">U'RLike</h1>
    </Link>
  )
}
