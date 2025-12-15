"use client";

import { MedicalCondition } from "@/types/medical";
import { format } from "date-fns";

interface MedicalRecordCardProps {
  condition: MedicalCondition;
  onEdit: (condition: MedicalCondition) => void;
  onDelete: (id: string) => void;
}

export default function MedicalRecordCard({
  condition,
  onEdit,
  onDelete,
}: MedicalRecordCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {condition.condition}
          </h3>
          {condition.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{condition.description}</p>
          )}
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>
              Diagnosed: {format(new Date(condition.diagnosisDate), "MMM dd, yyyy")}
            </span>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                condition.status === "active"
                  ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                  : condition.status === "chronic"
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                  : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
              }`}
            >
              {condition.status}
            </span>
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(condition)}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(condition.id)}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

