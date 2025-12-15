"use client";

import { MedicalScan } from "@/types/medical";
import { format } from "date-fns";

interface ScanGalleryProps {
  scans: MedicalScan[];
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}

export default function ScanGallery({
  scans,
  onDelete,
  readOnly = false,
}: ScanGalleryProps) {
  if (scans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No medical scans uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {scans.map((scan) => (
        <div
          key={scan.id}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="relative h-48 bg-gray-100">
            {scan.imageUrl.startsWith("data:") ? (
              <img
                src={scan.imageUrl}
                alt={scan.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {scan.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{scan.scanType}</p>
            <p className="text-xs text-gray-500 mt-1">
              {format(new Date(scan.scanDate), "MMM dd, yyyy")}
            </p>
            {scan.notes && (
              <p className="text-sm text-gray-600 mt-2">{scan.notes}</p>
            )}
            {!readOnly && onDelete && (
              <button
                onClick={() => onDelete(scan.id)}
                className="mt-3 text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

