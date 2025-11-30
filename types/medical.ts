export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface MedicalCondition {
  id: string;
  userId: string;
  condition: string;
  diagnosisDate: string;
  description?: string;
  status: "active" | "resolved" | "chronic";
  createdAt: string;
  updatedAt: string;
}

export interface MedicalScan {
  id: string;
  userId: string;
  title: string;
  scanType: string;
  scanDate: string;
  imageUrl: string;
  notes?: string;
  createdAt: string;
}

export interface LabResult {
  id: string;
  userId: string;
  title: string;
  testType: string;
  testDate: string;
  imageUrl: string; // PDF or image file
  notes?: string;
  createdAt: string;
}

export interface MedicationSchedule {
  id: string;
  time: string; // Time in HH:mm format (24-hour)
  amount: string; // e.g., "1 tablet", "2 pills", "100mg"
  enabled: boolean;
}

export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescriber?: string;
  notes?: string;
  status: "active" | "completed" | "discontinued";
  schedules?: MedicationSchedule[]; // Array of scheduled times and amounts
  createdAt: string;
  updatedAt: string;
}

export interface PatientProfile {
  userId: string;
  fullName: string;
  dateOfBirth?: string;
  bloodType?: string;
  allergies?: string[];
  profilePicture?: string; // Base64 encoded image
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  updatedAt: string;
}

export interface ShareLink {
  id: string;
  userId: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  accessCount: number;
  lastAccessedAt?: string;
}

export interface CommunityMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  createdAt: string;
}

