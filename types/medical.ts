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

