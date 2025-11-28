"use client";

import { useState } from "react";
import { MedicalScan } from "@/types/medical";

interface UploadScanProps {
  userId: string;
  onSave: (scan: MedicalScan) => void;
  onCancel: () => void;
}

export default function UploadScan({
  userId,
  onSave,
  onCancel,
}: UploadScanProps) {
  const [formData, setFormData] = useState({
    title: "",
    scanType: "",
    scanDate: "",
    notes: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !preview) {
      alert("Please select an image file");
      return;
    }

    const newScan: MedicalScan = {
      id: Date.now().toString(),
      userId,
      title: formData.title,
      scanType: formData.scanType,
      scanDate: new Date(formData.scanDate).toISOString(),
      imageUrl: preview,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    };

    onSave(newScan);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Scan Title *
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="scanType"
          className="block text-sm font-medium text-gray-700"
        >
          Scan Type *
        </label>
        <input
          type="text"
          id="scanType"
          required
          placeholder="e.g., X-Ray, MRI, CT Scan"
          value={formData.scanType}
          onChange={(e) =>
            setFormData({ ...formData, scanType: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="scanDate"
          className="block text-sm font-medium text-gray-700"
        >
          Scan Date *
        </label>
        <input
          type="date"
          id="scanDate"
          required
          value={formData.scanDate}
          onChange={(e) =>
            setFormData({ ...formData, scanDate: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Scan Image *
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          required
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
        {preview && (
          <div className="mt-2">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full h-48 object-contain border border-gray-300 rounded"
            />
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          Upload Scan
        </button>
      </div>
    </form>
  );
}

