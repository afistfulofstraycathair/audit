import React, { useRef, useState } from "react";
import { Camera, X, Upload } from "lucide-react";
import { PhotoUpload as PhotoUploadType } from "../types/audit";
import {
  handleFileUpload,
  removePhoto,
  formatFileSize,
} from "../utils/photoUtils";

interface PhotoUploadProps {
  questionId: string;
  photos: PhotoUploadType[];
  onChange: (photos: PhotoUploadType[]) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  questionId,
  photos,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    setUploadErrors([]);

    try {
      const { success, errors } = await handleFileUpload(files, photos);

      if (errors.length > 0) {
        setUploadErrors(errors);
      }

      if (success.length > 0) {
        onChange([...photos, ...success]);
      }
    } catch (error) {
      setUploadErrors(["Failed to upload photos. Please try again."]);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePhoto = (photoId: string) => {
    const updatedPhotos = removePhoto(photoId, photos);
    onChange(updatedPhotos);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="photo-upload-section">
      <div className="photo-upload-header">
        <h4 className="photo-upload-title">
          <Camera size={16} style={{ marginRight: "0.5rem" }} />
          Photo Documentation ({photos.length})
        </h4>
        <button
          type="button"
          className="photo-upload-button"
          onClick={triggerFileSelect}
          disabled={isUploading}
        >
          <Upload size={16} />
          {isUploading ? "Uploading..." : "Add Photos"}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {uploadErrors.length > 0 && (
        <div className="upload-errors">
          {uploadErrors.map((error, index) => (
            <div key={index} className="upload-error">
              {error}
            </div>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <div className="photo-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="photo-preview">
              <img
                src={photo.preview || ""}
                alt={`Photo for ${questionId}`}
                className="photo-image"
                loading="lazy"
              />
              <button
                type="button"
                className="photo-remove"
                onClick={() => handleRemovePhoto(photo.id)}
                title="Remove photo"
              >
                <X size={12} />
              </button>
              {photo.file && (
                <div className="photo-info">
                  <div className="photo-filename">{photo.file.name}</div>
                  <div className="photo-filesize">
                    {formatFileSize(photo.file.size)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && (
        <div className="photo-placeholder">
          <Camera size={32} />
          <p>No photos uploaded yet</p>
          <p className="photo-placeholder-hint">
            Click "Add Photos" to document compliance evidence
          </p>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
