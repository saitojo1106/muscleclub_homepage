'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { 
  uploadFile, 
  UploadOptions, 
  UploadResult, 
  ACCEPTED_IMAGE_TYPES, 
  deleteFile,
  BucketName
} from '@/lib/storage';

export interface ImageUploadProps {
  /**
   * Bucket to upload to
   */
  bucket: BucketName;
  
  /**
   * Optional custom path within the bucket
   */
  path?: string;
  
  /**
   * Maximum file size in bytes (default: 5MB)
   */
  maxSize?: number;
  
  /**
   * Label text for the upload area
   */
  label?: string;
  
  /**
   * Custom CSS class for the container
   */
  className?: string;
  
  /**
   * Initial image URL (if editing an existing image)
   */
  initialImageUrl?: string;
  
  /**
   * Initial image path in storage (needed for deletion)
   */
  initialImagePath?: string;
  
  /**
   * Callback when an image is successfully uploaded
   */
  onUploadComplete?: (result: UploadResult) => void;
  
  /**
   * Callback when an image is removed
   */
  onImageRemoved?: () => void;
  
  /**
   * Whether to disable the component
   */
  disabled?: boolean;
}

export default function ImageUpload({
  bucket,
  path,
  maxSize = 5 * 1024 * 1024, // 5MB default
  label = 'ここに画像ファイルをドロップするか、クリックして選択してください',
  className = '',
  initialImageUrl,
  initialImagePath,
  onUploadComplete,
  onImageRemoved,
  disabled = false,
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  const [imagePath, setImagePath] = useState<string | null>(initialImagePath || null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Set up dropzone
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled || acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0]; // We only handle single file upload
    
    // Reset state for new upload
    setError(null);
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress (since Supabase doesn't provide progress updates)
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress > 90 ? 90 : newProgress;
      });
    }, 300);
    
    try {
      // Upload file to Supabase Storage
      const options: UploadOptions = {
        bucket,
        path,
        isPublic: true,
      };
      
      const result = await uploadFile(file, options);
      
      // Stop progress animation
      clearInterval(progressInterval);
      
      if (result.success) {
        // Delete previous image if there was one
        if (imagePath) {
          await deleteFile(bucket, imagePath);
        }
        
        // Update state with new image info
        setImageUrl(result.publicUrl || null);
        setImagePath(result.path || null);
        setUploadProgress(100);
        
        // Call the callback
        if (onUploadComplete) {
          onUploadComplete(result);
        }
      } else {
        setError(result.error || 'アップロードに失敗しました');
        setUploadProgress(0);
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
      console.error('アップロードエラー:', err);
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
    }
  }, [bucket, path, disabled, imagePath, onUploadComplete]);

  const { 
    getRootProps, 
    getInputProps, 
    isDragActive, 
    isDragReject 
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': ACCEPTED_IMAGE_TYPES.map(type => `.${type.split('/')[1]}`),
    },
    maxSize,
    disabled: uploading || disabled,
    multiple: false,
  });

  // Handle removing the image
  const handleRemoveImage = async () => {
    if (disabled || !imagePath) return;
    
    setError(null);
    
    try {
      if (imagePath) {
        await deleteFile(bucket, imagePath);
      }
      
      setImageUrl(null);
      setImagePath(null);
      
      if (onImageRemoved) {
        onImageRemoved();
      }
    } catch (err) {
      setError('画像の削除に失敗しました');
      console.error('削除エラー:', err);
    }
  };

  // Update the state if initialImageUrl changes
  useEffect(() => {
    if (initialImageUrl !== undefined) {
      setImageUrl(initialImageUrl || null);
    }
    if (initialImagePath !== undefined) {
      setImagePath(initialImagePath || null);
    }
  }, [initialImageUrl, initialImagePath]);

  return (
    <div className={`w-full ${className}`}>
      {!imageUrl ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300'}
            ${isDragReject ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center justify-center space-y-3">
            <svg
              className="w-12 h-12

