"use client";

import { useEffect, useState, useCallback } from "react";
import { Medication, MedicationSchedule } from "@/types/medical";

export interface Reminder {
  medicationId: string;
  medicationName: string;
  time: string;
  amount: string;
  scheduleId: string;
}

export function useMedicationReminders(medications: Medication[]) {
  const [activeReminders, setActiveReminders] = useState<Reminder[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

  // Request notification permission
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
      
      if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          setNotificationPermission(permission);
        });
      }
    }
  }, []);

  // Check for upcoming reminders
  const checkReminders = useCallback(() => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes
    const upcomingReminders: Reminder[] = [];

    medications
      .filter((m) => m.status === "active" && m.schedules)
      .forEach((medication) => {
        medication.schedules?.forEach((schedule) => {
          if (!schedule.enabled) return;

          const [hours, minutes] = schedule.time.split(":").map(Number);
          const scheduleTime = hours * 60 + minutes;
          
          // Check if it's time (within 5 minutes before or after)
          const timeDiff = Math.abs(scheduleTime - currentTime);
          
          // Show reminder if it's within 5 minutes of the scheduled time
          if (timeDiff <= 5) {
            upcomingReminders.push({
              medicationId: medication.id,
              medicationName: medication.name,
              time: schedule.time,
              amount: schedule.amount,
              scheduleId: schedule.id,
            });
          }
        });
      });

    // Update active reminders
    setActiveReminders((prev) => {
      // Add new reminders, but avoid duplicates
      const newReminders = upcomingReminders.filter(
        (newR) => !prev.some((p) => p.scheduleId === newR.scheduleId)
      );
      
      // Remove reminders that are more than 10 minutes past their time
      const filteredPrev = prev.filter((reminder) => {
        const [hours, minutes] = reminder.time.split(":").map(Number);
        const reminderTime = hours * 60 + minutes;
        const timeDiff = currentTime - reminderTime;
        return timeDiff <= 10; // Keep reminders for 10 minutes after scheduled time
      });

      const updated = [...filteredPrev, ...newReminders];

      // Show browser notifications for new reminders
      if (newReminders.length > 0 && notificationPermission === "granted") {
        newReminders.forEach((reminder) => {
          new Notification(`Time to take ${reminder.medicationName}`, {
            body: `Take ${reminder.amount} at ${reminder.time}`,
            icon: "/favicon.ico",
            tag: `medication-${reminder.scheduleId}`,
            requireInteraction: true,
          });
        });
      }

      return updated;
    });
  }, [medications, notificationPermission]);

  // Check reminders every minute
  useEffect(() => {
    checkReminders();
    const interval = setInterval(checkReminders, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [checkReminders]);

  const dismissReminder = useCallback((scheduleId: string) => {
    setActiveReminders((prev) => prev.filter((r) => r.scheduleId !== scheduleId));
  }, []);

  const requestNotificationPermission = useCallback(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission);
      });
    }
  }, []);

  return {
    activeReminders,
    dismissReminder,
    notificationPermission,
    requestNotificationPermission,
  };
}

