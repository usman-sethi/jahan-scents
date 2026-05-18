import React, { useState } from 'react';

export function CloudinaryUpload({ onUpload, label = "Product Image" }: { onUpload: (url: string) => void, label?: string }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onUpload(base64String);
        setUploading(false);
      };
      reader.onerror = () => {
        setError('Failed to read file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Error uploading file');
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium uppercase tracking-widest text-[#555] mb-2">{label}</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-brand-black/50 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border file:border-brand-black/20 file:text-xs file:uppercase file:bg-transparent file:text-brand-black hover:file:bg-brand-black hover:file:text-white transition-all cursor-pointer"
      />
      {uploading && <p className="text-xs text-brand-gold mt-1">Processing...</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
