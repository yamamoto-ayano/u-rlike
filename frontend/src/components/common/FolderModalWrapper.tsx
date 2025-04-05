// components/folder/FolderModalWrapper.tsx
"use client";

import { NewFolderForm } from "@/components/folder/NewFolderForm";
import { useModal } from "@/components/folder/FolderFormContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const FolderModalWrapper = () => {
  const { isOpen, closeModal } = useModal();

  return (
    <div>
        <Dialog open={isOpen} onOpenChange={closeModal} >
        <DialogContent>
            <DialogHeader>
            <DialogTitle>新規フォルダを作成</DialogTitle>
            </DialogHeader>
            <NewFolderForm onClose={closeModal} />
        </DialogContent>
        </Dialog>
    </div>
  );
};
