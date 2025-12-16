import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  addDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  User,
  MedicalCondition,
  MedicalScan,
  PatientProfile,
  Medication,
  ShareLink,
  LabResult,
  CommunityMessage,
} from "@/types/medical";

// Helper to convert Firestore Timestamp to ISO string
const toISOString = (timestamp: Timestamp | string | undefined): string => {
  if (!timestamp) return new Date().toISOString();
  if (typeof timestamp === "string") return timestamp;
  return timestamp.toDate().toISOString();
};

// Helper to convert ISO string to Firestore Timestamp
const toTimestamp = (dateString: string | undefined): Timestamp | null => {
  if (!dateString) return null;
  return Timestamp.fromDate(new Date(dateString));
};

// Helper to remove undefined values from object (Firestore doesn't accept undefined)
const removeUndefined = (obj: any): any => {
  const cleaned: any = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  }
  return cleaned;
};

// ==================== USER MANAGEMENT ====================

export const saveUser = async (user: User): Promise<void> => {
  if (!db) return;
  await setDoc(doc(db, "users", user.id), {
    ...user,
    createdAt: toTimestamp(user.createdAt) || Timestamp.now(),
  });
};

export const getUser = async (userId: string): Promise<User | null> => {
  if (!db) return null;
  const userDoc = await getDoc(doc(db, "users", userId));
  if (!userDoc.exists()) return null;
  const data = userDoc.data();
  return {
    ...data,
    createdAt: toISOString(data.createdAt),
  } as User;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  if (!db) return null;
  const q = query(collection(db, "users"), where("email", "==", email), limit(1));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const data = querySnapshot.docs[0].data();
  return {
    ...data,
    createdAt: toISOString(data.createdAt),
  } as User;
};

// ==================== MEDICAL CONDITIONS ====================

export const saveCondition = async (condition: MedicalCondition): Promise<void> => {
  if (!db) return;
  const data = removeUndefined({
    ...condition,
    diagnosisDate: toTimestamp(condition.diagnosisDate),
    createdAt: toTimestamp(condition.createdAt) || Timestamp.now(),
    updatedAt: toTimestamp(condition.updatedAt) || Timestamp.now(),
  });
  await setDoc(doc(db, "conditions", condition.id), data);
};

export const getConditions = async (userId?: string): Promise<MedicalCondition[]> => {
  if (!db) return [];
  try {
    let q;
    if (userId) {
      q = query(collection(db, "conditions"), where("userId", "==", userId));
    } else {
      q = query(collection(db, "conditions"));
    }
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        diagnosisDate: toISOString(data.diagnosisDate),
        createdAt: toISOString(data.createdAt),
        updatedAt: toISOString(data.updatedAt),
      } as MedicalCondition;
    });
    // Sort by createdAt descending in JavaScript (no index needed)
    return results.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error: any) {
    console.error("Error fetching conditions:", error);
    // Return empty array on permission errors
    if (error.code === "permission-denied" || error.message?.includes("permission")) {
      return [];
    }
    throw error;
  }
};

export const deleteCondition = async (id: string): Promise<void> => {
  if (!db) return;
  await deleteDoc(doc(db, "conditions", id));
};

// ==================== MEDICATIONS ====================

export const saveMedication = async (medication: Medication): Promise<void> => {
  if (!db) return;
  const data = removeUndefined({
    ...medication,
    startDate: toTimestamp(medication.startDate),
    endDate: medication.endDate ? toTimestamp(medication.endDate) : null,
    createdAt: toTimestamp(medication.createdAt) || Timestamp.now(),
    updatedAt: toTimestamp(medication.updatedAt) || Timestamp.now(),
  });
  await setDoc(doc(db, "medications", medication.id), data);
};

export const getMedications = async (userId?: string): Promise<Medication[]> => {
  if (!db) return [];
  try {
    let q;
    if (userId) {
      q = query(collection(db, "medications"), where("userId", "==", userId));
    } else {
      q = query(collection(db, "medications"));
    }
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        startDate: toISOString(data.startDate),
        endDate: data.endDate ? toISOString(data.endDate) : undefined,
        createdAt: toISOString(data.createdAt),
        updatedAt: toISOString(data.updatedAt),
      } as Medication;
    });
    // Sort by createdAt descending in JavaScript (no index needed)
    return results.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error: any) {
    console.error("Error fetching medications:", error);
    // Return empty array on permission errors
    if (error.code === "permission-denied" || error.message?.includes("permission")) {
      return [];
    }
    throw error;
  }
};

export const deleteMedication = async (id: string): Promise<void> => {
  if (!db) return;
  await deleteDoc(doc(db, "medications", id));
};

// ==================== MEDICAL SCANS ====================

export const saveScan = async (scan: MedicalScan): Promise<void> => {
  if (!db) return;
  const data = removeUndefined({
    ...scan,
    scanDate: toTimestamp(scan.scanDate),
    createdAt: toTimestamp(scan.createdAt) || Timestamp.now(),
  });
  await setDoc(doc(db, "scans", scan.id), data);
};

export const getScans = async (userId?: string): Promise<MedicalScan[]> => {
  if (!db) return [];
  try {
    let q;
    if (userId) {
      q = query(collection(db, "scans"), where("userId", "==", userId));
    } else {
      q = query(collection(db, "scans"));
    }
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        scanDate: toISOString(data.scanDate),
        createdAt: toISOString(data.createdAt),
      } as MedicalScan;
    });
    // Sort by createdAt descending in JavaScript (no index needed)
    return results.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error: any) {
    console.error("Error fetching scans:", error);
    // Return empty array on permission errors
    if (error.code === "permission-denied" || error.message?.includes("permission")) {
      return [];
    }
    throw error;
  }
};

export const deleteScan = async (id: string): Promise<void> => {
  if (!db) return;
  await deleteDoc(doc(db, "scans", id));
};

// ==================== LAB RESULTS ====================

export const saveLabResult = async (labResult: LabResult): Promise<void> => {
  if (!db) return;
  const data = removeUndefined({
    ...labResult,
    testDate: toTimestamp(labResult.testDate),
    createdAt: toTimestamp(labResult.createdAt) || Timestamp.now(),
  });
  await setDoc(doc(db, "labResults", labResult.id), data);
};

export const getLabResults = async (userId?: string): Promise<LabResult[]> => {
  if (!db) return [];
  let q;
  if (userId) {
    q = query(collection(db, "labResults"), where("userId", "==", userId));
  } else {
    q = query(collection(db, "labResults"));
  }
  const querySnapshot = await getDocs(q);
  const results = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      testDate: toISOString(data.testDate),
      createdAt: toISOString(data.createdAt),
    } as LabResult;
  });
  // Sort by createdAt descending in JavaScript (no index needed)
  return results.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const deleteLabResult = async (id: string): Promise<void> => {
  if (!db) return;
  await deleteDoc(doc(db, "labResults", id));
};

// ==================== PATIENT PROFILES ====================

export const saveProfile = async (profile: PatientProfile): Promise<void> => {
  if (!db) return;
  const data = removeUndefined({
    userId: profile.userId,
    fullName: profile.fullName,
    dateOfBirth: profile.dateOfBirth ? toTimestamp(profile.dateOfBirth) : undefined,
    bloodType: profile.bloodType,
    allergies: profile.allergies,
    profilePicture: profile.profilePicture,
    emergencyContact: profile.emergencyContact,
    updatedAt: toTimestamp(profile.updatedAt) || Timestamp.now(),
  });
  await setDoc(doc(db, "profiles", profile.userId), data);
};

export const getProfile = async (userId: string): Promise<PatientProfile | null> => {
  if (!db) return null;
  const profileDoc = await getDoc(doc(db, "profiles", userId));
  if (!profileDoc.exists()) return null;
  const data = profileDoc.data();
  return {
    ...data,
    dateOfBirth: data.dateOfBirth ? toISOString(data.dateOfBirth) : undefined,
    updatedAt: toISOString(data.updatedAt),
  } as PatientProfile;
};

// ==================== SHARE LINKS ====================

export const saveShareLink = async (shareLink: ShareLink): Promise<void> => {
  if (!db) return;
  await setDoc(doc(db, "shareLinks", shareLink.id), {
    ...shareLink,
    createdAt: toTimestamp(shareLink.createdAt) || Timestamp.now(),
    expiresAt: toTimestamp(shareLink.expiresAt),
    lastAccessedAt: shareLink.lastAccessedAt ? toTimestamp(shareLink.lastAccessedAt) : null,
  });
};

export const getShareLinks = async (userId?: string, includeExpired: boolean = false): Promise<ShareLink[]> => {
  if (!db) return [];
  try {
    let q;
    if (userId) {
      q = query(collection(db, "shareLinks"), where("userId", "==", userId));
    } else {
      q = query(collection(db, "shareLinks"));
    }
    const querySnapshot = await getDocs(q);
    const now = new Date();
    const results = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: toISOString(data.createdAt),
          expiresAt: toISOString(data.expiresAt),
          lastAccessedAt: data.lastAccessedAt ? toISOString(data.lastAccessedAt) : undefined,
        } as ShareLink;
      })
      .filter((link) => {
        if (!includeExpired) {
          const expiresAt = new Date(link.expiresAt);
          // Treat missing isActive as active for backwards compatibility
          const isActive =
            typeof link.isActive === "boolean" ? link.isActive : true;
          return expiresAt > now && isActive;
        }
        return true;
      });
    // Sort by createdAt descending in JavaScript (no index needed)
    return results.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error: any) {
    console.error("Error fetching share links:", error);
    // Return empty array on permission errors
    if (error.code === "permission-denied" || error.message?.includes("permission")) {
      return [];
    }
    throw error;
  }
};

export const getShareLinkByToken = async (token: string): Promise<ShareLink | null> => {
  if (!db) return null;
  const q = query(collection(db, "shareLinks"), where("token", "==", token), limit(1));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const doc = querySnapshot.docs[0];
  const data = doc.data();
  const link = {
    ...data,
    id: doc.id,
    createdAt: toISOString(data.createdAt),
    expiresAt: toISOString(data.expiresAt),
    lastAccessedAt: data.lastAccessedAt ? toISOString(data.lastAccessedAt) : undefined,
  } as ShareLink;

  // Check if active and not expired
  // Treat missing isActive as active for backwards compatibility
  if (link.isActive === false) return null;
  const expiresAt = new Date(link.expiresAt);
  const now = new Date();
  if (expiresAt.getTime() <= now.getTime()) return null;

  return link;
};

export const deleteShareLink = async (id: string): Promise<void> => {
  if (!db) return;
  await deleteDoc(doc(db, "shareLinks", id));
};

export const revokeShareLink = async (id: string): Promise<void> => {
  if (!db) return;
  await updateDoc(doc(db, "shareLinks", id), { isActive: false });
};

export const incrementShareLinkAccess = async (token: string): Promise<void> => {
  if (!db) return;
  const q = query(collection(db, "shareLinks"), where("token", "==", token), limit(1));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docRef = doc(db, "shareLinks", querySnapshot.docs[0].id);
    await updateDoc(docRef, {
      accessCount: increment(1),
      lastAccessedAt: Timestamp.now(),
    });
  }
};

// ==================== COMMUNITY MESSAGES ====================

export const saveCommunityMessage = async (message: CommunityMessage): Promise<void> => {
  if (!db) return;
  await addDoc(collection(db, "communityMessages"), {
    ...message,
    createdAt: toTimestamp(message.createdAt) || Timestamp.now(),
  });
};

export const getCommunityMessages = async (messageLimit?: number): Promise<CommunityMessage[]> => {
  if (!db) return [];
  let q = query(collection(db, "communityMessages"));
  if (messageLimit) {
    q = query(collection(db, "communityMessages"), limit(messageLimit));
  }
  const querySnapshot = await getDocs(q);
  const results = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: toISOString(data.createdAt),
    } as CommunityMessage;
  });
  // Sort by createdAt ascending in JavaScript (no index needed)
  const sorted = results.sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  return sorted;
};

// Real-time subscription for community messages
export const subscribeToCommunityMessages = (
  callback: (messages: CommunityMessage[]) => void,
  messageLimit: number = 100
): (() => void) => {
  if (!db) return () => {};
  const q = query(collection(db, "communityMessages"), limit(messageLimit));
  return onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: toISOString(data.createdAt),
      } as CommunityMessage;
    });
    // Sort by createdAt ascending in JavaScript (no index needed)
    const sorted = messages.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    callback(sorted);
  });
};

export const deleteCommunityMessage = async (id: string): Promise<void> => {
  if (!db) return;
  await deleteDoc(doc(db, "communityMessages", id));
};

