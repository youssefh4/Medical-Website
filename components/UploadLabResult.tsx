"use client";

import { useState } from "react";
import { LabResult } from "@/types/medical";

interface UploadLabResultProps {
  userId: string;
  onSave: (labResult: LabResult) => void;
  onCancel: () => void;
}

export default function UploadLabResult({
  userId,
  onSave,
  onCancel,
}: UploadLabResultProps) {
  const [formData, setFormData] = useState({
    title: "",
    testType: "",
    testDate: "",
    notes: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !preview) {
      alert("Please select a file");
      return;
    }

    const newLabResult: LabResult = {
      id: Date.now().toString(),
      userId,
      title: formData.title,
      testType: formData.testType,
      testDate: new Date(formData.testDate).toISOString(),
      imageUrl: preview,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    };

    onSave(newLabResult);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Lab Result Title *
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Blood Test, Complete Blood Count"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="testType"
          className="block text-sm font-medium text-gray-700"
        >
          Test Type *
        </label>
        <input
          type="text"
          id="testType"
          required
          placeholder="e.g., Blood Test, Urine Test, Lipid Panel"
          value={formData.testType}
          onChange={(e) =>
            setFormData({ ...formData, testType: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="testDate"
          className="block text-sm font-medium text-gray-700"
        >
          Test Date *
        </label>
        <input
          type="date"
          id="testDate"
          required
          value={formData.testDate}
          onChange={(e) =>
            setFormData({ ...formData, testDate: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="file"
          className="block text-sm font-medium text-gray-700"
        >
          Lab Result File * (PDF or Image)
        </label>
        <input
          type="file"
          id="file"
          accept="image/*,.pdf"
          required
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
        {preview && (
          <div className="mt-2">
            {file?.type === "application/pdf" ? (
              <div className="border border-gray-300 dark:border-gray-700 rounded p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-center h-48">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">{file.name}</p>
                    <p className="text-xs text-gray-500">PDF Document</p>
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="max-w-full h-48 object-contain border border-gray-300 rounded"
              />
            )}
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
          placeholder="Additional notes about this lab result..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          Upload Lab Result
        </button>
      </div>
    </form>
  );
}

