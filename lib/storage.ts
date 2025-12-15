import { User, MedicalCondition, MedicalScan, PatientProfile, Medication, ShareLink, LabResult, CommunityMessage } from "@/types/medical";
import * as firebaseService from "./firebaseService";
import { db } from "./firebase";

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

// Check if Firebase is configured
const useFirebase = () => {
  return typeof window !== "undefined" && db !== undefined;
};

// User Management
export const saveUser = async (user: User): Promise<void> => {
  if (useFirebase()) {
    await firebaseService.saveUser(user);
  } else {
    const users = getUsers();
    const existingIndex = users.findIndex((u) => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
};

export const getUsers = (): User[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  if (useFirebase()) {
    return await firebaseService.getUserByEmail(email);
  } else {
    const users = getUsers();
    return users.find((u) => u.email === email) || null;
  }
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
export const saveCondition = async (condition: MedicalCondition): Promise<void> => {
  if (useFirebase()) {
    await firebaseService.saveCondition(condition);
  } else {
    const conditions = await getConditions();
    const existingIndex = conditions.findIndex((c) => c.id === condition.id);
    if (existingIndex >= 0) {
      conditions[existingIndex] = condition;
    } else {
      conditions.push(condition);
    }
    localStorage.setItem(STORAGE_KEYS.CONDITIONS, JSON.stringify(conditions));
  }
};

export const getConditions = async (userId?: string): Promise<MedicalCondition[]> => {
  if (useFirebase()) {
    return await firebaseService.getConditions(userId);
  } else {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.CONDITIONS);
    const allConditions = data ? JSON.parse(data) : [];
    return userId
      ? allConditions.filter((c: MedicalCondition) => c.userId === userId)
      : allConditions;
  }
};

export const deleteCondition = async (id: string): Promise<void> => {
  if (useFirebase()) {
    await firebaseService.deleteCondition(id);
  } else {
    const conditions = await getConditions();
    const filtered = conditions.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CONDITIONS, JSON.stringify(filtered));
  }
};

// Medical Scans
export const saveScan = async (scan: MedicalScan): Promise<void> => {
  if (useFirebase()) {
    await firebaseService.saveScan(scan);
  } else {
    const scans = await getScans();
    const existingIndex = scans.findIndex((s) => s.id === scan.id);
    if (existingIndex >= 0) {
      scans[existingIndex] = scan;
    } else {
      scans.push(scan);
    }
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(scans));
  }
};

export const getScans = async (userId?: string): Promise<MedicalScan[]> => {
  if (useFirebase()) {
    return await firebaseService.getScans(userId);
  } else {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.SCANS);
    const allScans = data ? JSON.parse(data) : [];
    return userId
      ? allScans.filter((s: MedicalScan) => s.userId === userId)
      : allScans;
  }
};

export const deleteScan = async (id: string): Promise<void> => {
  if (useFirebase()) {
    await firebaseService.deleteScan(id);
  } else {
    const scans = await getScans();
    const filtered = scans.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(filtered));
  }
};

// Patient Profiles
export const saveProfile = async (profile: PatientProfile): Promise<void> => {
  if (useFirebase()) {
    await firebaseService.saveProfile(profile);
  } else {
    const profiles = getProfiles();
    const existingIndex = profiles.findIndex((p) => p.userId === profile.userId);
    if (existingIndex >= 0) {
      profiles[existingIndex] = profile;
    } else {
      profiles.push(profile);
    }
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  }
};

export const getProfile = async (userId: string): Promise<PatientProfile | null> => {
  if (useFirebase()) {
    return await firebaseService.getProfile(userId);
  } else {
    const profiles = getProfiles();
    return profiles.find((p) => p.userId === userId) || null;
  }
};

export const getProfiles = (): PatientProfile[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
  return data ? JSON.parse(data) : [];
};

// Medications
export const saveMedication = async (medication: Medication): Promise<void> => {
  if (useFirebase()) {
    await firebaseService.saveMedication(medication);
  } else {
    const medications = await getMedications();
    const existingIndex = medications.findIndex((m) => m.id === medication.id);
    if (existingIndex >= 0) {
      medications[existingIndex] = medication;
    } else {
      medications.push(medication);
    }
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(medications));
  }
};

export const getMedications = async (userId?: string): Promise<Medication[]> => {
  if (useFirebase()) {
    return await firebaseService.getMedications(userId);
  } else {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
    const allMedications = data ? JSON.parse(data) : [];
    return userId
      ? allMedications.filter((m: Medication) => m.userId === userId)
      : allMedications;
  }
};

export const deleteMedication = async (id: string): Promise<void> => {
  if (useFirebase()) {
    await firebaseService.deleteMedication(id);
  } else {
    const medications = await getMedications();
    const filtered = medications.filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(filtered));
  }
};

// Share Links
export const saveShareLink = async (shareLink: ShareLink): Promise<void> => {
  if (useFirebase()) {
    await firebaseService.saveShareLink(shareLink);
  } else {
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
  }
};

export const getShareLinks = async (userId?: string, includeExpired: boolean = false): Promise<ShareLink[]> => {
  if (useFirebase()) {
    return await firebaseService.getShareLinks(userId, includeExpired);
  } else {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.SHARE_LINKS);
    const allShareLinks = data ? JSON.parse(data) : [];
    let filtered = userId
      ? allShareLinks.filter((s: ShareLink) => s.userId === userId)
      : allShareLinks;
    
    if (!includeExpired) {
      const now = new Date();
      filtered = filtered.filter((s: ShareLink) => {
        const expiresAt = new Date(s.expiresAt);
        return expiresAt > now && s.isActive;
      });
    }
    
    return filtered;
  }
};

export const getShareLinkByToken = async (token: string): Promise<ShareLink | null> => {
  if (useFirebase()) {
    return await firebaseService.getShareLinkByToken(token);
  } else {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(STORAGE_KEYS.SHARE_LINKS);
    if (!data) return null;
    
    const allShareLinks = JSON.parse(data);
    const link = allShareLinks.find((s: ShareLink) => s.token === token);
    
    if (!link || !link.isActive) return null;
    
    const expiresAtDate = new Date(link.expiresAt);
    const nowDate = new Date();
    if (expiresAtDate.getTime() <= nowDate.getTime()) return null;
    
    return link;
  }
};

export const deleteShareLink = async (id: string): Promise<void> => {
  if (useFirebase()) {
    await firebaseService.deleteShareLink(id);
  } else {
    if (typeof window === "undefined") return;
    const data = localStorage.getItem(STORAGE_KEYS.SHARE_LINKS);
    const allShareLinks: ShareLink[] = data ? JSON.parse(data) : [];
    const filtered = allShareLinks.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SHARE_LINKS, JSON.stringify(filtered));
  }
};

export const revokeShareLink = async (id: string): Promise<void> => {
  if (useFirebase()) {
    await firebaseService.revokeShareLink(id);
  } else {
    if (typeof window === "undefined") return;
    const data = localStorage.getItem(STORAGE_KEYS.SHARE_LINKS);
    const allShareLinks: ShareLink[] = data ? JSON.parse(data) : [];
    const link = allShareLinks.find((s) => s.id === id);
    if (link) {
      link.isActive = false;
      await saveShareLink(link);
    }
  }
};

export const incrementShareLinkAccess = async (token: string): Promise<void> => {
  if (useFirebase()) {
    await firebaseService.incrementShareLinkAccess(token);
  } else {
    if (typeof window === "undefined") return;
    const data = localStorage.getItem(STORAGE_KEYS.SHARE_LINKS);
    const allShareLinks: ShareLink[] = data ? JSON.parse(data) : [];
    const link = allShareLinks.find((s) => s.token === token);
    if (link) {
      link.accessCount += 1;
      link.lastAccessedAt = new Date().toISOString();
      await saveShareLink(link);
    }
  }
};

// Lab Results
export const saveLabResult = async (labResult: LabResult): Promise<void> => {
  if (useFirebase()) {
    await firebaseService.saveLabResult(labResult);
  } else {
    const labResults = await getLabResults();
    const existingIndex = labResults.findIndex((l) => l.id === labResult.id);
    if (existingIndex >= 0) {
      labResults[existingIndex] = labResult;
    } else {
      labResults.push(labResult);
    }
    localStorage.setItem(STORAGE_KEYS.LAB_RESULTS, JSON.stringify(labResults));
  }
};

export const getLabResults = async (userId?: string): Promise<LabResult[]> => {
  if (useFirebase()) {
    return await firebaseService.getLabResults(userId);
  } else {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.LAB_RESULTS);
    const allLabResults = data ? JSON.parse(data) : [];
    return userId
      ? allLabResults.filter((l: LabResult) => l.userId === userId)
      : allLabResults;
  }
};

export const deleteLabResult = async (id: string): Promise<void> => {
  if (useFirebase()) {
    await firebaseService.deleteLabResult(id);
  } else {
    const labResults = await getLabResults();
    const filtered = labResults.filter((l) => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LAB_RESULTS, JSON.stringify(filtered));
  }
};

// Community Messages
export const saveCommunityMessage = async (message: CommunityMessage): Promise<void> => {
  if (useFirebase()) {
    await firebaseService.saveCommunityMessage(message);
  } else {
    const messages = await getCommunityMessages();
    messages.push(message);
    const recentMessages = messages.slice(-1000);
    localStorage.setItem(STORAGE_KEYS.COMMUNITY_MESSAGES, JSON.stringify(recentMessages));
  }
};

export const getCommunityMessages = async (limit?: number): Promise<CommunityMessage[]> => {
  if (useFirebase()) {
    return await firebaseService.getCommunityMessages(limit);
  } else {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.COMMUNITY_MESSAGES);
    const allMessages = data ? JSON.parse(data) : [];
    const sorted = allMessages.sort((a: CommunityMessage, b: CommunityMessage) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return limit ? sorted.slice(-limit) : sorted;
  }
};

export const deleteCommunityMessage = async (id: string): Promise<void> => {
  if (useFirebase()) {
    await firebaseService.deleteCommunityMessage(id);
  } else {
    const messages = await getCommunityMessages();
    const filtered = messages.filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.COMMUNITY_MESSAGES, JSON.stringify(filtered));
  }
};

// Export Firebase real-time subscription function
export const subscribeToCommunityMessages = firebaseService.subscribeToCommunityMessages;

