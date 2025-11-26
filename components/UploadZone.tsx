import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import { ImageFile } from '../types';

interface UploadZoneProps {
  onImageSelected: (image: ImageFile | null) => void;
  selectedImage: ImageFile | null;
  disabled: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected, selectedImage, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Extract base64 data without prefix for API
      const base64 = result.split(',')[1];
      
      onImageSelected({
        file,
        previewUrl: result,
        base64,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [disabled, processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  const clearImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onImageSelected(null);
  }, [onImageSelected]);

  if (selectedImage) {
    return (
      <div className="relative group w-full h-64 md:h-96 rounded-2xl overflow-hidden border-2 border-gray-700 bg-gray-900 shadow-2xl transition-all duration-300">
        <img 
          src={selectedImage.previewUrl} 
          alt="Preview" 
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
          <button 
            onClick={clearImage}
            className="p-3 bg-red-500/80 hover:bg-red-600 text-white rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-200"
            disabled={disabled}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <label 
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        relative w-full h-64 md:h-96 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300
        ${isDragging 
          ? 'border-blue-500 bg-blue-500/10 scale-[0.99]' 
          : 'border-gray-700 hover:border-blue-400 hover:bg-gray-800/50 bg-gray-900'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input 
        type="file" 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileInput}
        disabled={disabled}
      />
      
      <div className="flex flex-col items-center gap-4 p-6 text-center">
        <div className={`p-4 rounded-full ${isDragging ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-400'} transition-colors`}>
          {isDragging ? <UploadCloud className="w-10 h-10 animate-bounce" /> : <ImageIcon className="w-10 h-10" />}
        </div>
        <div className="space-y-1">
          <p className="text-lg font-medium text-gray-200">
            {isDragging ? 'Drop it here!' : 'Click or drop an image'}
          </p>
          <p className="text-sm text-gray-500">Supports JPG, PNG, WEBP</p>
        </div>
      </div>
    </label>
  );
};