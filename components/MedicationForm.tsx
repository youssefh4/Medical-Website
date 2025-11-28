"use client";

import { useState, useEffect } from "react";
import { Medication } from "@/types/medical";

interface MedicationFormProps {
  medication?: Medication | null;
  userId: string;
  onSave: (medication: Medication) => void;
  onCancel: () => void;
}

export default function MedicationForm({
  medication,
  userId,
  onSave,
  onCancel,
}: MedicationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    startDate: "",
    endDate: "",
    prescriber: "",
    notes: "",
    status: "active" as "active" | "completed" | "discontinued",
  });

  useEffect(() => {
    if (medication) {
      setFormData({
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        startDate: medication.startDate.split("T")[0],
        endDate: medication.endDate ? medication.endDate.split("T")[0] : "",
        prescriber: medication.prescriber || "",
        notes: medication.notes || "",
        status: medication.status,
      });
    }
  }, [medication]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const newMedication: Medication = {
      id: medication?.id || Date.now().toString(),
      userId,
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      prescriber: formData.prescriber || undefined,
      notes: formData.notes || undefined,
      status: formData.status,
      createdAt: medication?.createdAt || now,
      updatedAt: now,
    };
    onSave(newMedication);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Medication Name *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="e.g., Aspirin, Metformin"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="dosage"
            className="block text-sm font-medium text-gray-700"
          >
            Dosage *
          </label>
          <input
            type="text"
            id="dosage"
            required
            value={formData.dosage}
            onChange={(e) =>
              setFormData({ ...formData, dosage: e.target.value })
            }
            placeholder="e.g., 100mg, 2 tablets"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="frequency"
            className="block text-sm font-medium text-gray-700"
          >
            Frequency *
          </label>
          <input
            type="text"
            id="frequency"
            required
            value={formData.frequency}
            onChange={(e) =>
              setFormData({ ...formData, frequency: e.target.value })
            }
            placeholder="e.g., Once daily, Twice daily, Every 8 hours"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status *
          </label>
          <select
            id="status"
            required
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as "active" | "completed" | "discontinued",
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="discontinued">Discontinued</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            required
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700"
          >
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave blank if medication is ongoing
          </p>
        </div>

        <div>
          <label
            htmlFor="prescriber"
            className="block text-sm font-medium text-gray-700"
          >
            Prescribed By
          </label>
          <input
            type="text"
            id="prescriber"
            value={formData.prescriber}
            onChange={(e) =>
              setFormData({ ...formData, prescriber: e.target.value })
            }
            placeholder="Doctor's name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
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
          onChange={(e) =>
            setFormData({ ...formData, notes: e.target.value })
          }
          placeholder="Additional notes about this medication..."
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
          {medication ? "Update" : "Add"} Medication
        </button>
      </div>
    </form>
  );
}

