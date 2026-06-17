import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/utils/utils';
import { Button } from '@/components/common/Button';

export function FileUpload({ 
  label, 
  accept, 
  maxSizeMB = 5, 
  onFileSelect, 
  onRemove,
  selectedFiles = [],
  multiple = false,
  error = null,
  helperText,
  disabled = false
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const validFiles = [];
    const newErrors = [];

    Array.from(files).forEach((file) => {
      // Validate Size
      if (file.size > maxSizeBytes) {
        newErrors.push(`${file.name} melebihi batas ukuran ${maxSizeMB}MB.`);
        return;
      }
      validFiles.push(file);
    });

    if (newErrors.length > 0) {
      // Could show toast or pass error up, assuming parent handles it or just alerting
      alert(newErrors.join('\n'));
    }

    if (validFiles.length > 0) {
      onFileSelect(multiple ? validFiles : [validFiles[0]]);
    }
    
    // Reset input
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const onButtonClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full space-y-2">
      {label && <label className="text-sm font-medium leading-none">{label}</label>}
      
      <div 
        className={cn(
          "relative flex flex-col items-center justify-center w-full px-6 py-8 border-2 border-dashed rounded-lg transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 bg-background",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-accent/50",
          error ? "border-destructive" : ""
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <div className="p-3 bg-primary/10 rounded-full">
            <UploadCloud className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              <span className="text-primary hover:underline">Pilih file</span> atau drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              {helperText || `Maksimal ${maxSizeMB}MB`}
            </p>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-destructive font-medium">{error}</p>}

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          {selectedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg bg-card">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="p-2 bg-secondary rounded-md shrink-0">
                  <File className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate">{file.name || file.file_name}</span>
                  <span className="text-xs text-muted-foreground">{formatFileSize(file.size || file.file_size)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                {file.uploadProgress !== undefined && file.uploadProgress < 100 && (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                )}
                {file.uploadProgress === 100 && (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                )}
                {!disabled && onRemove && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemove(idx, file)}
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
