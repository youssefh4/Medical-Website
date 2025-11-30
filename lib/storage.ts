import { User, MedicalCondition, MedicalScan, PatientProfile, Medication, ShareLink, LabResult, CommunityMessage } from "@/types/medical";

const STORAGE_KEYS = {
  USERS: "medical_app_users",
  CURRENT_USER: "medical_app_current_user",
  CONDITIONS: "medical_app_conditions",
  SCANS: "medical_app_scans",
  LAB_RESULTS: "medical_app_lab_results",
  MEDICATIONS: "medical_app_medications",
  PROFILES: "medical_app_profiles",
  SHARE_LINKS: "medical_app_share_links",
  COMMUNITY_MESSAGES: "medical_app_community_messages",
  TOKEN: "medical_app_token",
};

// User Management
export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex((u) => u.id === user.id);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getUsers = (): User[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const getUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find((u) => u.email === email) || null;
};

// Authentication
export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const setToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const clearAuth = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

// Medical Conditions
export const saveCondition = (condition: MedicalCondition): void => {
  const conditions = getConditions();
  const existingIndex = conditions.findIndex((c) => c.id === condition.id);
  if (existingIndex >= 0) {
    conditions[existingIndex] = condition;
  } else {
    conditions.push(condition);
  }
  localStorage.setItem(STORAGE_KEYS.CONDITIONS, JSON.stringify(conditions));
};

export const getConditions = (userId?: string): MedicalCondition[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.CONDITIONS);
  const allConditions = data ? JSON.parse(data) : [];
  return userId
    ? allConditions.filter((c: MedicalCondition) => c.userId === userId)
    : allConditions;
};

export const deleteCondition = (id: string): void => {
  const conditions = getConditions();
  const filtered = conditions.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CONDITIONS, JSON.stringify(filtered));
};

// Medical Scans
export const saveScan = (scan: MedicalScan): void => {
  const scans = getScans();
  const existingIndex = scans.findIndex((s) => s.id === scan.id);
  if (existingIndex >= 0) {
    scans[existingIndex] = scan;
  } else {
    scans.push(scan);
  }
  localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(scans));
};

export const getScans = (userId?: string): MedicalScan[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.SCANS);
  const allScans = data ? JSON.parse(data) : [];
  return userId
    ? allScans.filter((s: MedicalScan) => s.userId === userId)
    : allScans;
};

export const deleteScan = (id: string): void => {
  const scans = getScans();
  const filtered = scans.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(filtered));
};

// Patient Profiles
export const saveProfile = (profile: PatientProfile): void => {
  const profiles = getProfiles();
  const existingIndex = profiles.findIndex((p) => p.userId === profile.userId);
  if (existingIndex >= 0) {
    profiles[existingIndex] = profile;
  } else {
    profiles.push(profile);
  }
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
};

export const getProfile = (userId: string): PatientProfile | null => {
  const profiles = getProfiles();
  return profiles.find((p) => p.userId === userId) || null;
};

export const getProfiles = (): PatientProfile[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
  return data ? JSON.parse(data) : [];
};

// Medications
export const saveMedication = (medication: Medication): void => {
  const medications = getMedications();
  const existingIndex = medications.findIndex((m) => m.id === medication.id);
  if (existingIndex >= 0) {
    medications[existingIndex] = medication;
  } else {
    medications.push(medication);
  }
  localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(medications));
};

export const getMedications = (userId?: string): Medication[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
  const allMedications = data ? JSON.parse(data) : [];
  return userId
    ? allMedications.filter((m: Medication) => m.userId === userId)
    : allMedications;
};

export const deleteMedication = (id: string): void => {
  const medications = getMedications();
  const filtered = medications.filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(filtered));
};

// Share Links
export const saveShareLink = (shareLink: ShareLink): void => {
  if (typeof window === "undefined") return;
  const data = localStorage.getItem(STORAGE_KEYS.SHARE_LINKS);
  const allShareLinks: ShareLink[] = data ? JSON.parse(data) : [];
  const existingIndex = allShareLinks.findIndex((s) => s.id === shareLink.id);
  if (existingIndex >= 0) {
    allShareLinks[existingIndex] = shareLink;
  } else {
    allShareLinks.push(shareLink);
  }
  localStorage.setItem(STORAGE_KEYS.SHARE_LINKS, JSON.stringify(allShareLinks));
};

export const getShareLinks = (userId?: string, includeExpired: boolean = false): ShareLink[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.SHARE_LINKS);
  const allShareLinks = data ? JSON.parse(data) : [];
  let filtered = userId
    ? allShareLinks.filter((s: ShareLink) => s.userId === userId)
    : allShareLinks;
  
  // Filter out expired links if not including expired
  if (!includeExpired) {
    const now = new Date();
    filtered = filtered.filter((s: ShareLink) => {
      const expiresAt = new Date(s.expiresAt);
      return expiresAt > now && s.isActive;
    });
  }
  
  return filtered;
};

export const getShareLinkByToken = (token: string): ShareLink | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(STORAGE_KEYS.SHARE_LINKS);
  if (!data) return null;
  
  const allShareLinks = JSON.parse(data);
  const link = allShareLinks.find((s: ShareLink) => s.token === token);
  
  if (!link) return null;
  
  // Check if active first
  if (!link.isActive) {
    return null;
  }
  
  // Check if expired - compare dates properly
  const expiresAtDate = new Date(link.expiresAt);
  const nowDate = new Date();
  
  // Link is valid if expiration date is in the future
  // Using getTime() for reliable numeric comparison
  if (expiresAtDate.getTime() <= nowDate.getTime()) {
    return null;
  }
  
  return link;
};

export const deleteShareLink = (id: string): void => {
  if (typeof window === "undefined") return;
  const data = localStorage.getItem(STORAGE_KEYS.SHARE_LINKS);
  const allShareLinks: ShareLink[] = data ? JSON.parse(data) : [];
  const filtered = allShareLinks.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SHARE_LINKS, JSON.stringify(filtered));
};

export const revokeShareLink = (id: string): void => {
  if (typeof window === "undefined") return;
  const data = localStorage.getItem(STORAGE_KEYS.SHARE_LINKS);
  const allShareLinks: ShareLink[] = data ? JSON.parse(data) : [];
  const link = allShareLinks.find((s) => s.id === id);
  if (link) {
    link.isActive = false;
    saveShareLink(link);
  }
};

export const incrementShareLinkAccess = (token: string): void => {
  if (typeof window === "undefined") return;
  const data = localStorage.getItem(STORAGE_KEYS.SHARE_LINKS);
  const allShareLinks: ShareLink[] = data ? JSON.parse(data) : [];
  const link = allShareLinks.find((s) => s.token === token);
  if (link) {
    link.accessCount += 1;
    link.lastAccessedAt = new Date().toISOString();
    saveShareLink(link);
  }
};

// Lab Results
export const saveLabResult = (labResult: LabResult): void => {
  const labResults = getLabResults();
  const existingIndex = labResults.findIndex((l) => l.id === labResult.id);
  if (existingIndex >= 0) {
    labResults[existingIndex] = labResult;
  } else {
    labResults.push(labResult);
  }
  localStorage.setItem(STORAGE_KEYS.LAB_RESULTS, JSON.stringify(labResults));
};

export const getLabResults = (userId?: string): LabResult[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.LAB_RESULTS);
  const allLabResults = data ? JSON.parse(data) : [];
  return userId
    ? allLabResults.filter((l: LabResult) => l.userId === userId)
    : allLabResults;
};

export const deleteLabResult = (id: string): void => {
  const labResults = getLabResults();
  const filtered = labResults.filter((l) => l.id !== id);
  localStorage.setItem(STORAGE_KEYS.LAB_RESULTS, JSON.stringify(filtered));
};

// Community Messages
export const saveCommunityMessage = (message: CommunityMessage): void => {
  const messages = getCommunityMessages();
  messages.push(message);
  // Keep only last 1000 messages to prevent storage bloat
  const recentMessages = messages.slice(-1000);
  localStorage.setItem(STORAGE_KEYS.COMMUNITY_MESSAGES, JSON.stringify(recentMessages));
};

export const getCommunityMessages = (limit?: number): CommunityMessage[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.COMMUNITY_MESSAGES);
  const allMessages = data ? JSON.parse(data) : [];
  // Sort by creation date (oldest first for chat display)
  const sorted = allMessages.sort((a: CommunityMessage, b: CommunityMessage) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  // If limit specified, get the last N messages (most recent)
  return limit ? sorted.slice(-limit) : sorted;
};

export const deleteCommunityMessage = (id: string): void => {
  const messages = getCommunityMessages();
  const filtered = messages.filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEYS.COMMUNITY_MESSAGES, JSON.stringify(filtered));
};

