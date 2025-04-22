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
    width,
    height,
    quality = 0.8,
    folder
  } = options;
  
  // 現在の実装では実際のリサイズは行わず、そのままアップロード
  // 実際のリサイズ機能は、canvas要素やsharp、resizeライブラリなどを使用して実装が必要
  
  // フォルダを指定した場合、パスに含める
  const actualBucket = folder ? `${bucket}/${folder}` : bucket;
  
  return uploadImage(file, actualBucket);
}

// 画像を削除する関数
export async function deleteImage(url: string, bucket: string = 'members'): Promise<boolean> {
  try {
    // URLからファイルパスを抽出
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf(bucket) + 1).join('/');
    
    const { error } = await supabase
      .storage
      .from(bucket)
      .remove([filePath]);
      
    if (error) {
      console.error('画像削除エラー:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('画像削除中にエラーが発生しました:', error);
    return false;
  }
}