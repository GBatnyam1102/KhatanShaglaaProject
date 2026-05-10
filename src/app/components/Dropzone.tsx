import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function Dropzone({ 
  onUpload, 
  images = [] 
}: { 
  onUpload: (files: File[]) => void, 
  images?: string[] 
}) {
  const [dragActive, setDragActive] = useState(false);

  const validateFiles = useCallback((files: File[]) => {
    return files.filter((file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error(`${file.name} файл JPG, PNG эсвэл WebP байх ёстой`);
        return false;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} файл 5MB-с бага байх ёстой`);
        return false;
      }

      return true;
    });
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const validFiles = validateFiles(Array.from(e.dataTransfer.files));
      if (validFiles.length > 0) {
        onUpload(validFiles);
      }
    }
  }, [onUpload, validateFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const validFiles = validateFiles(Array.from(e.target.files));
      if (validFiles.length > 0) {
        onUpload(validFiles);
      }
    }
  }, [onUpload, validateFiles]);

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-sm p-8 text-center transition-colors ${
          dragActive ? "border-brand-brown bg-brand-brown/5" : "border-brand-sand bg-brand-ivory hover:bg-brand-sand/10"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-8 h-8 mx-auto text-brand-brown/50 mb-4" />
        <p className="text-sm text-brand-black/70 mb-2">
          <span className="font-semibold text-brand-brown cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
            Зураг оруулах
          </span> эсвэл чирж авчрах
        </p>
        <p className="text-xs text-brand-black/50">PNG, JPG, WebP (max. 5MB)</p>
        <input 
          id="file-upload" 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          onChange={handleChange}
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div key={i} className="relative aspect-square rounded-sm border border-brand-sand overflow-hidden group bg-brand-sand/20">
              <img src={img} alt="" className="w-full h-full object-contain p-2" />
              <button className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-brand-red opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
