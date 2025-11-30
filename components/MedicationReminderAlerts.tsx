"use client";

import { Reminder } from "./useMedicationReminders";

interface MedicationReminderAlertsProps {
  reminders: Reminder[];
  onDismiss: (scheduleId: string) => void;
  notificationPermission: NotificationPermission;
  onRequestPermission: () => void;
}

export default function MedicationReminderAlerts({
  reminders,
  onDismiss,
  notificationPermission,
  onRequestPermission,
}: MedicationReminderAlertsProps) {
  if (reminders.length === 0 && notificationPermission !== "default") {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      {/* Notification Permission Banner */}
      {notificationPermission === "default" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-blue-800">
                Enable Medication Reminders
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                Allow browser notifications to receive medication reminders even when you're not on this page.
              </p>
              <button
                onClick={onRequestPermission}
                className="mt-2 text-sm font-medium text-blue-800 hover:text-blue-900 underline"
              >
                Enable Notifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Reminders */}
      {reminders.map((reminder) => (
        <div
          key={reminder.scheduleId}
          className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 shadow-lg animate-pulse"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-semibold text-yellow-800">
                Time to take medication
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p className="font-medium">{reminder.medicationName}</p>
                <p className="mt-1">
                  Take <span className="font-semibold">{reminder.amount}</span> at{" "}
                  <span className="font-semibold">{reminder.time}</span>
                </p>
              </div>
              <button
                onClick={() => onDismiss(reminder.scheduleId)}
                className="mt-3 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
              >
                Dismiss
              </button>
            </div>
            <button
              onClick={() => onDismiss(reminder.scheduleId)}
              className="ml-4 flex-shrink-0 text-yellow-400 hover:text-yellow-500"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

