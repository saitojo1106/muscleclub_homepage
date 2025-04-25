import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid'; // UUIDパッケージをインストール: npm install uuid @types/uuid

type ResizeOptions = {
  bucket?: string;
  width?: number;
  height?: number;
  quality?: number;
  folder?: string;
};

// 画像をアップロードする関数
// エラー時のリトライロジックを追加
export async function uploadImage(file: File, bucket: string = 'members', retryCount: number = 3): Promise<string | null> {
  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      // ファイル名の作成（ユニークな名前にする）
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${bucket}/${fileName}`;
      
      // ファイルをアップロード
      const { error: uploadError } = await supabase
        .storage
        .from(bucket)
        .upload(filePath, file);
        
      if (uploadError) {
        console.error('ファイルアップロードエラー:', uploadError);
        return null;
      }
      
      // 公開URLを取得
      const { data } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error(`画像アップロード失敗 (試行 ${attempt}/${retryCount}):`, error);
      
      // 最後の試行以外は再試行
      if (attempt < retryCount) {
        await new Promise(r => setTimeout(r, 1000)); // 1秒待機
      }
    }
  }
  
  return null; // すべての試行が失敗
}

// 画像をリサイズしてアップロード
export async function uploadResizedImage(file: File, options: ResizeOptions = {}): Promise<string | null> {
  const {
    bucket = 'members',
    width = 800,
    height,
    quality = 0.8,
    folder
  } = options;
  
  // Canvas要素を使った画像リサイズ
  try {
    const resizedFile = await resizeImageFile(file, width, height, quality);
    const actualBucket = folder ? `${bucket}/${folder}` : bucket;
    return uploadImage(resizedFile, actualBucket);
  } catch (error) {
    console.error('画像リサイズエラー:', error);
    return null;
  }
}

// 画像リサイズ用のヘルパー関数
async function resizeImageFile(file: File, maxWidth: number, maxHeight?: number, quality = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // 元のアスペクト比を維持
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      
      if (maxHeight && height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
      
      // Canvas要素を作成
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      // 画像を描画
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context could not be created'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      
      // Blobに変換
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas to Blob conversion failed'));
          return;
        }
        
        // 新しいFileオブジェクトを作成
        const resizedFile = new File([blob], file.name, {
          type: file.type,
          lastModified: Date.now()
        });
        
        resolve(resizedFile);
      }, file.type, quality);
    };
    
    img.onerror = () => {
      reject(new Error('Image loading failed'));
    };
    
    img.src = URL.createObjectURL(file);
  });
}

// 画像を削除する関数
export async function deleteImage(url: string, bucket: string = 'members'): Promise<boolean> {
  try {
    // URLからファイルパスを抽出
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    // URLパスから「storage/v1/object/public/」の部分を除去して正確なパスを取得
    const relevantPathIndex = pathSegments.findIndex(segment => segment === 'public');
    
    if (relevantPathIndex === -1) {
      console.error('URLから正確なファイルパスを抽出できませんでした:', url);
      return false;
    }
    
    const filePath = pathSegments.slice(relevantPathIndex + 1).join('/');
    
    // ファイルを削除
    const { error } = await supabase
      .storage
      .from(bucket)
      .remove([filePath]);
      
    if (error) {
      console.error('ファイル削除エラー:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('画像削除中にエラーが発生しました:', error);
    return false;
  }
}