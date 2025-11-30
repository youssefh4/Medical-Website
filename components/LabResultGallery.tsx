"use client";

import { LabResult } from "@/types/medical";
import { format } from "date-fns";

interface LabResultGalleryProps {
  labResults: LabResult[];
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}

export default function LabResultGallery({
  labResults,
  onDelete,
  readOnly = false,
}: LabResultGalleryProps) {
  if (labResults.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No lab results uploaded yet.</p>
      </div>
    );
  }

  const handleView = (labResult: LabResult) => {
    // Open in new window/tab
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>${labResult.title}</title></head>
          <body style="margin:0; padding:20px; background:#f5f5f5;">
            <h1>${labResult.title}</h1>
            <p><strong>Test Type:</strong> ${labResult.testType}</p>
            <p><strong>Test Date:</strong> ${format(new Date(labResult.testDate), "MMM dd, yyyy")}</p>
            ${labResult.notes ? `<p><strong>Notes:</strong> ${labResult.notes}</p>` : ""}
            <div style="margin-top:20px;">
              ${labResult.imageUrl.startsWith("data:application/pdf") ? (
                `<iframe src="${labResult.imageUrl}" style="width:100%; height:80vh; border:none;"></iframe>`
              ) : (
                `<img src="${labResult.imageUrl}" style="max-width:100%; height:auto;" alt="${labResult.title}" />`
              )}
            </div>
          </body>
        </html>
      `);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {labResults.map((labResult) => (
        <div
          key={labResult.id}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="relative h-48 bg-gray-100">
            {labResult.imageUrl.startsWith("data:application/pdf") ? (
              <div className="w-full h-full flex items-center justify-center bg-red-50">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 text-red-400 mx-auto"
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
                  <p className="mt-2 text-sm text-gray-600">PDF Document</p>
                </div>
              </div>
            ) : labResult.imageUrl.startsWith("data:") ? (
              <img
                src={labResult.imageUrl}
                alt={labResult.title}
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {labResult.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{labResult.testType}</p>
            <p className="text-xs text-gray-500 mt-1">
              {format(new Date(labResult.testDate), "MMM dd, yyyy")}
            </p>
            {labResult.notes && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {labResult.notes}
              </p>
            )}
            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => handleView(labResult)}
                className="text-primary-600 hover:text-primary-800 text-sm font-medium"
              >
                View
              </button>
              {!readOnly && onDelete && (
                <button
                  onClick={() => onDelete(labResult.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

