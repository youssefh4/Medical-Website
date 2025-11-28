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
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {condition.condition}
          </h3>
          {condition.description && (
            <p className="mt-1 text-sm text-gray-600">{condition.description}</p>
          )}
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
            <span>
              Diagnosed: {format(new Date(condition.diagnosisDate), "MMM dd, yyyy")}
            </span>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                condition.status === "active"
                  ? "bg-red-100 text-red-800"
                  : condition.status === "chronic"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {condition.status}
            </span>
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(condition)}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(condition.id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

