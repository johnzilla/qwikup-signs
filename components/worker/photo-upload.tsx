'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface PhotoUploadProps {
  claimId: string;
  type: 'pickup' | 'dropoff';
  onUploaded: (url: string) => void;
}

export function PhotoUpload({ claimId, type, onUploaded }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    const supabase = createClient();

    const ext = file.name.split('.').pop();
    const path = `claims/${claimId}/${type}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('proof-photos')
      .upload(path, file, { upsert: true });

    if (error) {
      toast.error('Upload failed');
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('proof-photos').getPublicUrl(path);
    setUploading(false);
    toast.success('Photo uploaded');
    onUploaded(urlData.publicUrl);
  };

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt={`${type} proof`} className="w-full h-48 object-cover rounded-lg" />
          <Button
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={() => { setPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-blue-400 transition-colors"
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          ) : (
            <>
              <Camera className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-500">
                Take or upload {type} photo
              </span>
            </>
          )}
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
