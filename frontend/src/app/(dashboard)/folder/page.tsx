"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Folder, Plus } from "lucide-react"
import Link from "next/link"
import { useSidebar } from "@/components/common/SidebarContext"
import { NewFolderForm } from "@/components/folder/NewFolderForm"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

export default function FolderPage() {
  const { subItems } = useSidebar()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex h-screen">
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">フォルダ</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                新規フォルダ
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>新規フォルダを作成</DialogTitle>
              </DialogHeader>
              <NewFolderForm onClose={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subItems.map((folder) => (
            <Link key={folder.id} href={`${folder.path}`} className="block">
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <Folder className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold">{folder.name}</h3>
                </div>
                <p className="text-sm text-gray-500">{folder.count}件のアイテム</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
