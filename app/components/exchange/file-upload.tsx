import { useState } from "react";
import { Button } from "~/components/ui/button";

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  selectedFile: File | null;
}

export function FileUpload({ onFileChange, selectedFile }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="mt-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? "border-blue-500 bg-blue-50/10" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={handleChange}
          accept="image/*,.pdf"
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer text-blue-200 hover:text-blue-300"
        >
          <span className="text-lg font-medium">
            {selectedFile ? selectedFile.name : "Subir comprobante de pago"}
          </span>
          <p className="mt-2 text-sm text-blue-300">
            Arrastra y suelta aquí o haz clic para seleccionar
          </p>
        </label>
      </div>

      {selectedFile && (
        <div className="mt-4 flex justify-end">
          <Button
            variant="destructive"
            onClick={() => onFileChange(null)}
            size="sm"
          >
            Eliminar archivo
          </Button>
        </div>
      )}
    </div>
  );
}
