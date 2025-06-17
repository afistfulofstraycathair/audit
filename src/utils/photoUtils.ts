import { PhotoUpload } from "../types/audit";
import { generateUniqueId } from "./storage";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const validateImageFile = (
  file: File
): { isValid: boolean; error?: string } => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: "Invalid file type. Please upload JPEG, PNG, or WebP images only.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: "File size too large. Please upload images smaller than 5MB.",
    };
  }

  return { isValid: true };
};

export const createPhotoPreview = (file: File): Promise<PhotoUpload> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const preview = e.target?.result as string;

      resolve({
        id: generateUniqueId(),
        file,
        preview,
        uploadDate: new Date(),
      });
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
};

export const compressImage = (
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Apply image enhancements
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      // Try WebP first for better compression
      const tryWebP = () => {
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, ".webp"),
                {
                  type: "image/webp",
                  lastModified: Date.now(),
                }
              );
              resolve(compressedFile);
            } else {
              // Fallback to original format
              fallbackCompress();
            }
          },
          "image/webp",
          quality
        );
      };

      const fallbackCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file); // Fallback to original if compression fails
            }
          },
          file.type,
          quality
        );
      };

      // Check WebP support
      if (canvas.toBlob && typeof canvas.toBlob === "function") {
        tryWebP();
      } else {
        fallbackCompress();
      }
    };

    img.onerror = () => {
      resolve(file); // Return original if image loading fails
    };

    img.src = URL.createObjectURL(file);
  });
};

export const handleFileUpload = async (
  files: FileList | null,
  existingPhotos: PhotoUpload[] = []
): Promise<{ success: PhotoUpload[]; errors: string[] }> => {
  if (!files || files.length === 0) {
    return { success: [], errors: [] };
  }

  const results: PhotoUpload[] = [];
  const errors: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      errors.push(`${file.name}: ${validation.error}`);
      continue;
    }

    try {
      // Compress image if needed
      const compressedFile = await compressImage(file);

      // Create preview
      const photoUpload = await createPhotoPreview(compressedFile);
      results.push(photoUpload);
    } catch (error) {
      errors.push(`${file.name}: Failed to process image`);
    }
  }

  return { success: results, errors };
};

export const removePhoto = (
  photoId: string,
  photos: PhotoUpload[]
): PhotoUpload[] => {
  const photo = photos.find((p) => p.id === photoId);
  if (photo && photo.preview) {
    // Clean up object URL if it exists
    URL.revokeObjectURL(photo.preview);
  }

  return photos.filter((p) => p.id !== photoId);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getImageDimensions = (
  file: File
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = URL.createObjectURL(file);
  });
};

// Enhanced photo utilities for mobile and camera integration

// Check camera support
export const isCameraSupported = (): boolean => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

// Check if device has camera
export const hasCamera = async (): Promise<boolean> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some((device) => device.kind === "videoinput");
  } catch {
    return false;
  }
};

// Capture photo from camera
export const captureFromCamera = (): Promise<File | null> => {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment"; // Use back camera on mobile

    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      resolve(file || null);
    };

    input.oncancel = () => resolve(null);
    input.click();
  });
};

// Generate thumbnail
export const generateThumbnail = (
  file: File,
  size: number = 150
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    img.onload = () => {
      // Calculate square thumbnail dimensions
      const minDimension = Math.min(img.width, img.height);

      canvas.width = size;
      canvas.height = size;

      // Center crop
      const offsetX = (img.width - minDimension) / 2;
      const offsetY = (img.height - minDimension) / 2;

      ctx.drawImage(
        img,
        offsetX,
        offsetY,
        minDimension,
        minDimension,
        0,
        0,
        size,
        size
      );

      const thumbnail = canvas.toDataURL("image/jpeg", 0.7);
      resolve(thumbnail);
    };

    img.onerror = () => resolve("");
    img.src = URL.createObjectURL(file);
  });
};

// Batch compress multiple images with progress tracking
export const batchCompressImages = (
  files: File[],
  onProgress?: (progress: number, fileName: string) => void
): Promise<File[]> => {
  return new Promise(async (resolve) => {
    const compressedFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const compressed = await compressImage(file);
        compressedFiles.push(compressed);

        if (onProgress) {
          onProgress(((i + 1) / files.length) * 100, file.name);
        }
      } catch (error) {
        console.error(`Failed to compress ${file.name}:`, error);
        compressedFiles.push(file); // Use original on error
      }
    }

    resolve(compressedFiles);
  });
};

// Create photo metadata for audit trail
export const createPhotoMetadata = (file: File, questionId: string) => {
  return {
    id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    questionId,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    uploadedAt: new Date().toISOString(),
    deviceInfo: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
    },
  };
};
