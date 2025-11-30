"use client";

import { useState } from "react";
import { Medication, MedicationSchedule } from "@/types/medical";

interface MedicationScheduleTableProps {
  medications: Medication[];
  onUpdateSchedule: (medicationId: string, schedules: MedicationSchedule[]) => void;
}

export default function MedicationScheduleTable({
  medications,
  onUpdateSchedule,
}: MedicationScheduleTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSchedules, setEditSchedules] = useState<MedicationSchedule[]>([]);

  // Filter only active medications
  const activeMedications = medications.filter((m) => m.status === "active");

  const handleEdit = (medication: Medication) => {
    setEditingId(medication.id);
    setEditSchedules(medication.schedules || []);
  };

  const handleAddSchedule = () => {
    const newSchedule: MedicationSchedule = {
      id: Date.now().toString(),
      time: "09:00",
      amount: "1 tablet",
      enabled: true,
    };
    setEditSchedules([...editSchedules, newSchedule]);
  };

  const handleRemoveSchedule = (scheduleId: string) => {
    setEditSchedules(editSchedules.filter((s) => s.id !== scheduleId));
  };

  const handleUpdateSchedule = (scheduleId: string, field: keyof MedicationSchedule, value: string | boolean) => {
    setEditSchedules(
      editSchedules.map((s) =>
        s.id === scheduleId ? { ...s, [field]: value } : s
      )
    );
  };

  const handleSave = (medicationId: string) => {
    onUpdateSchedule(medicationId, editSchedules);
    setEditingId(null);
    setEditSchedules([]);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditSchedules([]);
  };

  if (activeMedications.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Medication Schedule
        </h2>
        <p className="text-gray-500 dark:text-gray-300 text-center py-8">
          No active medications. Add medications and set their schedules to receive reminders.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Medication Schedule & Reminders
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Set specific times and amounts for each medication to receive reminders.
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Medication
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {activeMedications.map((medication) => {
                const schedules = medication.schedules || [];
                const isEditing = editingId === medication.id;

                if (isEditing) {
                  return (
                    <tr key={medication.id} className="bg-blue-50 dark:bg-gray-800">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {medication.name}
                            </h3>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSave(medication.id)}
                                className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancel}
                                className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>

                          {editSchedules.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                              No schedules set. Click "Add Schedule" to add one.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {editSchedules.map((schedule) => (
                                <div
                                  key={schedule.id}
                                  className="flex items-center gap-4 p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700"
                                >
                                  <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-white mb-1">
                                      Time
                                    </label>
                                    <input
                                      type="time"
                                      value={schedule.time}
                                      onChange={(e) =>
                                        handleUpdateSchedule(
                                          schedule.id,
                                          "time",
                                          e.target.value
                                        )
                                      }
                                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-white mb-1">
                                      Amount
                                    </label>
                                    <input
                                      type="text"
                                      value={schedule.amount}
                                      onChange={(e) =>
                                        handleUpdateSchedule(
                                          schedule.id,
                                          "amount",
                                          e.target.value
                                        )
                                      }
                                      placeholder="e.g., 1 tablet, 2 pills"
                                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    />
                                  </div>
                                  <div className="flex items-center">
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={schedule.enabled}
                                        onChange={(e) =>
                                          handleUpdateSchedule(
                                            schedule.id,
                                            "enabled",
                                            e.target.checked
                                          )
                                        }
                                        className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                                      />
                                      <span className="ml-2 text-sm text-gray-700 dark:text-white">
                                        Enabled
                                      </span>
                                    </label>
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleRemoveSchedule(schedule.id)
                                    }
                                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <button
                            onClick={handleAddSchedule}
                            className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-primary-500 dark:hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            + Add Schedule
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                if (schedules.length === 0) {
                  return (
                    <tr key={medication.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {medication.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {medication.dosage}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        No schedule set
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        -
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                          Not Scheduled
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(medication)}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                        >
                          Set Schedule
                        </button>
                      </td>
                    </tr>
                  );
                }

                return schedules.map((schedule, index) => (
                  <tr key={`${medication.id}-${schedule.id}`}>
                    {index === 0 && (
                      <td
                        rowSpan={schedules.length}
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {medication.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {medication.dosage}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {schedule.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {schedule.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          schedule.enabled
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {schedule.enabled ? "Active" : "Disabled"}
                      </span>
                    </td>
                    {index === 0 && (
                      <td
                        rowSpan={schedules.length}
                        className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                      >
                        <button
                          onClick={() => handleEdit(medication)}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                        >
                          Edit
                        </button>
                      </td>
                    )}
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

