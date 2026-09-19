"use client";

import React, { useState, useCallback } from "react";
import { UploadCloud, FileImage, X, Globe2 } from "lucide-react";

interface ImageUploadProps {
  onImageSelected: (file: File | null) => void;
  isLoading?: boolean;
}

export default function ImageUpload({
  onImageSelected,
  isLoading = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setFileDetails({
      name: file.name,
      size: formatFileSize(file.size),
    });
    onImageSelected(file);
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setFileDetails(null);
    onImageSelected(null);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full min-h-[320px] rounded-3xl transition-all duration-300 overflow-hidden cursor-pointer group animate-pulse-slow ${
        isDragging
          ? "bg-eco-900/40 border-2 border-eco-500 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
          : "bg-slate-900/40 border-2 border-slate-700/50 hover:border-eco-500/50 hover:bg-slate-800/60"
      } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !preview && document.getElementById("file-upload")?.click()}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*"
        onChange={onFileInputChange}
      />
      
      {/* Subtle background glow effect when hovering */}
      {!preview && (
        <div className="absolute inset-0 bg-gradient-to-tr from-eco-600/0 via-eco-500/0 to-eco-400/0 group-hover:from-eco-900/10 group-hover:via-eco-800/5 group-hover:to-transparent transition-all duration-700 pointer-events-none" />
      )}

      {preview ? (
        <div className="flex flex-col md:flex-row w-full h-full p-6 items-center gap-6">
          <div className="relative w-full md:w-1/2 h-64 md:h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-col flex-1 w-full text-left bg-slate-900/50 p-6 rounded-2xl border border-slate-700/30">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-eco-500 mb-1">Ready for Analysis</p>
                <h4 className="text-xl font-bold text-white truncate max-w-[200px] sm:max-w-xs">{fileDetails?.name}</h4>
              </div>
              <FileImage className="text-slate-500" size={32} />
            </div>
            
            <p className="text-slate-400 font-medium mb-8">Size: {fileDetails?.size}</p>
            
            <button
              onClick={clearImage}
              className="mt-auto self-start px-4 py-2 rounded-lg font-medium text-sm border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 hover:border-slate-500 transition-colors flex items-center gap-2"
            >
              <X size={16} />
              Change Image
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-8 z-10">
          <div className="w-20 h-20 bg-slate-800/80 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-700/50 group-hover:scale-110 transition-transform duration-500 group-hover:bg-eco-900/50 group-hover:border-eco-500/30">
            <Globe2 size={40} className="text-eco-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Upload an environmental image
          </h3>
          <p className="text-slate-400 text-lg mb-6">
            Drag & drop your image here or <span className="text-eco-400 group-hover:text-eco-300 transition-colors">browse files</span>
          </p>
          <div className="flex items-center gap-3 text-xs font-semibold tracking-widest uppercase text-slate-500">
            <span>JPG</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span>PNG</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span>WEBP</span>
          </div>
        </div>
      )}
    </div>
  );
}
