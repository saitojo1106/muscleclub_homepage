// src/app/_components/image-upload.tsx
"use client";

import { useState } from "react";
import { uploadResizedImage } from "@/lib/storage";

type ImageUploadProps = {
  onUpload: (url: string) => void;
  bucket?: string;
  accept?: string;
  maxSizeMB?: number;
};

export default function ImageUpload({ 
  onUpload, 
  bucket = 'members',
  accept = 'image/jpeg,image/png,image/webp',
  maxSizeMB = 5
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // ファイルサイズチェック
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`ファイルサイズが大きすぎます。${maxSizeMB}MB以下の画像を選択してください。`);
      return;
    }
    
    // MIMEタイプチェック
    if (!accept.includes(file.type)) {
      setError(`サポートされていないファイル形式です。${accept.split(',').join(', ')}のいずれかを選択してください。`);
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      // アップロード処理をシミュレート
      setProgress(30);
      await new Promise(r => setTimeout(r, 500));
      setProgress(60);
      
      const url = await uploadResizedImage(file, { bucket });
      
      if (url) {
        setProgress(100);
        onUpload(url);
      } else {
        setError('アップロードに失敗しました。再度お試しください。');
      }
    } catch (error) {
      console.error('アップロードエラー:', error);
      setError('アップロード中にエラーが発生しました。');
    } finally {
      setIsUploading(false);
      // 入力フィールドをリセット
      e.target.value = '';
    }
  };
  
  return (
    <div className="my-4">
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={isUploading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      
      {isUploading && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">アップロード中... {progress}%</p>
        </div>
      )}
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}