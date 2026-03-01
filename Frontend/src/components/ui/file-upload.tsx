import { useRef, useState } from "react";
import { Upload, X, FileIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

type UploadResult = {
  url: string;
  filename: string;
  type: string;
};

interface FileUploadProps {
  onUploadComplete: (result: UploadResult) => void;
  accept?: string;
  label?: string;
  className?: string;
}

export function FileUpload({ onUploadComplete, accept, label = "Ajouter un fichier", className }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      onUploadComplete({ url: data.url, filename: data.filename, type: data.type });
    } catch (error) {
      console.error("Upload error:", error);
      setFileName(null);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Upload className="h-4 w-4 mr-2" />
        )}
        {uploading ? "Upload..." : label}
      </Button>
      {fileName && !uploading && (
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <FileIcon className="h-3 w-3" />
          {fileName}
          <button
            type="button"
            onClick={() => setFileName(null)}
            className="hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}
    </div>
  );
}
