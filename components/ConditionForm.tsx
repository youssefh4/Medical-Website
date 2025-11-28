"use client";

import { useState, useEffect } from "react";
import { MedicalCondition } from "@/types/medical";

interface ConditionFormProps {
  condition?: MedicalCondition | null;
  userId: string;
  onSave: (condition: MedicalCondition) => void;
  onCancel: () => void;
}

export default function ConditionForm({
  condition,
  userId,
  onSave,
  onCancel,
}: ConditionFormProps) {
  const [formData, setFormData] = useState({
    condition: "",
    diagnosisDate: "",
    description: "",
    status: "active" as "active" | "resolved" | "chronic",
  });

  useEffect(() => {
    if (condition) {
      setFormData({
        condition: condition.condition,
        diagnosisDate: condition.diagnosisDate.split("T")[0],
        description: condition.description || "",
        status: condition.status,
      });
    }
  }, [condition]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const newCondition: MedicalCondition = {
      id: condition?.id || Date.now().toString(),
      userId,
      condition: formData.condition,
      diagnosisDate: new Date(formData.diagnosisDate).toISOString(),
      description: formData.description,
      status: formData.status,
      createdAt: condition?.createdAt || now,
      updatedAt: now,
    };
    onSave(newCondition);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="condition"
          className="block text-sm font-medium text-gray-700"
        >
          Condition Name *
        </label>
        <input
          type="text"
          id="condition"
          required
          value={formData.condition}
          onChange={(e) =>
            setFormData({ ...formData, condition: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="diagnosisDate"
          className="block text-sm font-medium text-gray-700"
        >
          Diagnosis Date *
        </label>
        <input
          type="date"
          id="diagnosisDate"
          required
          value={formData.diagnosisDate}
          onChange={(e) =>
            setFormData({ ...formData, diagnosisDate: e.target.value })
          }
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
              status: e.target.value as "active" | "resolved" | "chronic",
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="active">Active</option>
          <option value="resolved">Resolved</option>
          <option value="chronic">Chronic</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
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
          {condition ? "Update" : "Add"} Condition
        </button>
      </div>
    </form>
  );
}

