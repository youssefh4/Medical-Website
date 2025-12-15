"use client";

import { Medication } from "@/types/medical";
import { format } from "date-fns";

interface MedicationCardProps {
  medication: Medication;
  onEdit: (medication: Medication) => void;
  onDelete: (id: string) => void;
}

export default function MedicationCard({
  medication,
  onEdit,
  onDelete,
}: MedicationCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {medication.name}
            </h3>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                medication.status === "active"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                  : medication.status === "completed"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
              }`}
            >
              {medication.status}
            </span>
          </div>
          
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
            <p>
              <span className="font-medium">Dosage:</span> {medication.dosage}
            </p>
            <p>
              <span className="font-medium">Frequency:</span> {medication.frequency}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span>
                <span className="font-medium">Started:</span>{" "}
                {format(new Date(medication.startDate), "MMM dd, yyyy")}
              </span>
              {medication.endDate && (
                <span>
                  <span className="font-medium">Ended:</span>{" "}
                  {format(new Date(medication.endDate), "MMM dd, yyyy")}
                </span>
              )}
            </div>
            {medication.prescriber && (
              <p>
                <span className="font-medium">Prescribed by:</span> {medication.prescriber}
              </p>
            )}
            {medication.notes && (
              <p className="mt-2 text-gray-500 dark:text-gray-400 italic">{medication.notes}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(medication)}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(medication.id)}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

