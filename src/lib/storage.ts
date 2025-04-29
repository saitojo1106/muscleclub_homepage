import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

// Bucket names
export const BUCKETS = {
  EVENTS: 'events',
  MEMBERS: 'members',
  GENERAL: 'general',
} as const;

export type BucketName = typeof BUCKETS[keyof typeof BUCKETS];

// File types we accept
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

export type AcceptedImageType = typeof ACCEPTED_IMAGE_TYPES[number];

// Size options for image optimization
export const IMAGE_SIZES = {
  THUMBNAIL: { width: 200, height: 200 },
  MEDIUM: { width: 800, height: 600 },
  LARGE: { width: 1920, height: 1080 },
} as const;

export type ImageSize = typeof IMAGE_SIZES[keyof typeof IMAGE_SIZES];

export type ImageResizeOptions = {
  width?: number;
  height?: number;
  quality?: number; // 1-100
  format?: 'jpeg' | 'webp' | 'png';
};

export type UploadOptions = {
  /**
   * The bucket to upload to
   */
  bucket: BucketName;

  /**
   * Custom path within the bucket (optional)
   * Default: Root of the bucket
   */
  path?: string;

  /**
   * Whether to make the file publicly accessible
   * Default: true
   */
  isPublic?: boolean;

  /**
   * Image resize options (optional)
   */
  resize?: ImageResizeOptions;
};

export type UploadResult = {
  /**
   * Whether the upload was successful
   */
  success: boolean;

  /**
   * The path to the file in the bucket
   */
  path?: string;

  /**
   * The public URL of the file (if isPublic is true)
   */
  publicUrl?: string;

  /**
   * Error message if upload failed
   */
  error?: string;
};

/**
 * Generate a unique file path for upload
 * @param fileName Original file name
 * @param path Optional custom path
 * @returns Unique file path
 */
export function generateFilePath(fileName: string, path?: string): string {
  const fileExtension = fileName.split('.').pop();
  const uniqueId = uuidv4();
  const basePath = path ? `${path}/` : '';
  
  // Replace spaces and special characters in the original filename
  const cleanFileName = fileName
    .split('.')
    .slice(0, -1)
    .join('.')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .toLowerCase();
  
  return `${basePath}${cleanFileName}_${uniqueId}.${fileExtension}`;
}

/**
 * Upload a file to Supabase Storage
 * @param file File to upload
 * @param options Upload options
 * @returns Upload result
 */
export async function uploadFile(
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  try {
    // Check if file type is allowed (if it's an image)
    if (
      file.type.startsWith('image/') && 
      !ACCEPTED_IMAGE_TYPES.includes(file.type as AcceptedImageType)
    ) {
      return {
        success: false,
        error: `不正なファイル形式です。次の形式のみ許可されています: ${ACCEPTED_IMAGE_TYPES.join(', ')}`,
      };
    }

    // Generate unique path to prevent overwriting existing files
    const filePath = generateFilePath(file.name, options.path);

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from(options.bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('ファイルアップロードエラー:', uploadError);
      return {
        success: false,
        error: `アップロードに失敗しました: ${uploadError.message}`,
      };
    }

    // Set public access if requested
    if (options.isPublic !== false) {
      // File is already public by default with current Supabase settings
      // This is just a placeholder in case we need to change permissions later
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from(options.bucket)
      .getPublicUrl(filePath);

    return {
      success: true,
      path: filePath,
      publicUrl: publicUrlData.publicUrl,
    };
  } catch (error) {
    console.error('ファイルアップロード中に例外が発生しました:', error);
    return {
      success: false,
      error: '予期しないエラーが発生しました',
    };
  }
}

/**
 * Get a public URL for a file in Supabase Storage
 * @param bucket Bucket name
 * @param path File path in the bucket
 * @returns Public URL or null if error
 */
export function getPublicUrl(bucket: BucketName, path: string): string | null {
  try {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  } catch (error) {
    console.error('公開URL取得エラー:', error);
    return null;
  }
}

/**
 * Delete a file from Supabase Storage
 * @param bucket Bucket name
 * @param path File path in the bucket
 * @returns Whether deletion was successful
 */
export async function deleteFile(
  bucket: BucketName, 
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    
    if (error) {
      console.error('ファイル削除エラー:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error('ファイル削除中に例外が発生しました:', error);
    return { success: false, error: '予期しないエラーが発生しました' };
  }
}

/**
 * Create a signed URL for temporary access to a file
 * @param bucket Bucket name
 * @param path File path in the bucket
 * @param expiresIn Expiration time in seconds (default: 60)
 * @returns Signed URL or null if error
 */
export async function createSignedUrl(
  bucket: BucketName,
  path: string,
  expiresIn = 60
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);
    
    if (error) {
      console.error('署名付きURL作成エラー:', error);
      return null;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('署名付きURL作成中に例外が発生しました:', error);
    return null;
  }
}

/**
 * Initialize storage buckets (useful for application startup)
 * Creates the buckets if they don't exist
 */
export async function initializeStorageBuckets(): Promise<void> {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    
    // Create buckets if they don't exist
    for (const bucketName of Object.values(BUCKETS)) {
      if (!buckets?.find(b => b.name === bucketName)) {
        await supabase.storage.createBucket(bucketName, {
          public: true,
        });
        console.log(`バケット作成: ${bucketName}`);
      }
    }
  } catch (error) {
    console.error('ストレージバケット初期化エラー:', error);
  }
}

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