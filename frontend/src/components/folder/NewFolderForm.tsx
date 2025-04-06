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
  const { closeModal } = useModal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // サーバーの POST /bookmarks エンドポイントにフォルダ作成リクエストを送信
      const response = await fetch("http://localhost:8787/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // description はここでは空文字として送信
        body: JSON.stringify({ name, description: "" }),
      });
      if (!response.ok) {
        throw new Error("フォルダの作成に失敗しました");
      }
      const folder = await response.json();
      // API から返ってきた id と name を使って subItems を更新
      const newFolder: SubItem = {
        folderid: folder.id, // Prisma の id は string のため
        name: folder.name,
        path: `/folder/${folder.id}`,
        count: 0,
      };
      setSubItems([...subItems, newFolder]);
      onClose(); // フォームを閉じる
    } catch (error) {
      console.error("Error creating folder:", error);
    }
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
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={closeModal}>
          キャンセル
        </Button>
        <Button type="submit">作成</Button>
      </div>
    </form>
  );
}
