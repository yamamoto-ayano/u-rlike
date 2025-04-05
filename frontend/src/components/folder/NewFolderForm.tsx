// components/folder/NewFolderForm.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSidebar, SubItem } from "@/components/common/SidebarContext";
import { useModal } from "@/components/folder/FolderFormContext"; 

interface NewFolderFormProps {
  onClose: () => void;
}

export function NewFolderForm({ onClose }: NewFolderFormProps) {
  const { subItems, setSubItems } = useSidebar();
  const [name, setName] = useState("");
  const { isOpen, closeModal, openModal } = useModal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId =subItems.length > 0 ? Math.max(...subItems.map((item) => item.folderid)) + 1 : 1; // IDの生成
    const newFolder: SubItem = {
      folderid: newId,
      name,
      path: `/folder/${newId}`, // 👈 パスは自動生成
      count: 0,
    };
    setSubItems([...subItems, newFolder]);
    onClose(); // 作成後はフォームを閉じる
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow bg-white">
      <div>
        <label className="block text-sm font-medium mb-1">フォルダ名</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例：デザイン案件"
          required
        />
      </div>
      {/* 👇 パス入力欄は削除しました */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={closeModal}>
          キャンセル
        </Button>
        <Button type="submit">作成</Button>
      </div>
    </form>
  );
}
