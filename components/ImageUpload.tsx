import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  image: string | null;
  onImageChange: (base64: string | null) => void;
  disabled: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ image, onImageChange, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full h-full min-h-[300px] flex flex-col">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        disabled={disabled}
      />
      
      {!image ? (
        <div 
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`
            flex-1 border-3 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-colors
            ${disabled ? 'border-slate-200 bg-slate-50' : 'border-indigo-200 hover:border-indigo-400 bg-indigo-50/50 hover:bg-indigo-50 cursor-pointer'}
          `}
        >
          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-indigo-500" />
          </div>
          <p className="text-lg font-semibold text-slate-700">Upload your Photo</p>
          <p className="text-sm text-slate-500 mt-2 text-center max-w-xs">
            Choose a selfie or a portrait with space on the sides for the best result.
          </p>
        </div>
      ) : (
        <div className="relative flex-1 rounded-2xl overflow-hidden bg-slate-900 group shadow-md border border-slate-200">
          <img 
            src={image} 
            alt="Uploaded" 
            className="w-full h-full object-cover opacity-90" 
          />
          <div className="absolute inset-0 bg-black/10"></div>
          
          {!disabled && (
            <button 
              onClick={handleClear}
              className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full text-red-500 shadow-lg transition-transform hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
            <ImageIcon className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-700">Original</span>
          </div>
        </div>
      )}
    </div>
  );
};
