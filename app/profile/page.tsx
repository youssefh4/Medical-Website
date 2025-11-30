"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navigation from "@/components/Navigation";
import { getAuthUser } from "@/lib/auth";
import {
  getConditions,
  getScans,
  getMedications,
  saveCondition,
  deleteCondition,
  saveScan,
  deleteScan,
  saveMedication,
  deleteMedication,
  getProfile,
  saveProfile,
  getLabResults,
  saveLabResult,
  deleteLabResult,
} from "@/lib/storage";
import { MedicalCondition, MedicalScan, PatientProfile, Medication, LabResult } from "@/types/medical";
import MedicalRecordCard from "@/components/MedicalRecordCard";
import ConditionForm from "@/components/ConditionForm";
import ScanGallery from "@/components/ScanGallery";
import UploadScan from "@/components/UploadScan";
import LabResultGallery from "@/components/LabResultGallery";
import UploadLabResult from "@/components/UploadLabResult";
import ProfileForm from "@/components/ProfileForm";
import MedicationForm from "@/components/MedicationForm";
import MedicationCard from "@/components/MedicationCard";
import MedicationScheduleTable from "@/components/MedicationScheduleTable";
import MedicationReminderAlerts from "@/components/MedicationReminderAlerts";
import { useMedicationReminders } from "@/components/useMedicationReminders";
import ShareLinkManager from "@/components/ShareLinkManager";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [conditions, setConditions] = useState<MedicalCondition[]>([]);
  const [scans, setScans] = useState<MedicalScan[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [showConditionForm, setShowConditionForm] = useState(false);
  const [showScanForm, setShowScanForm] = useState(false);
  const [showLabResultForm, setShowLabResultForm] = useState(false);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingCondition, setEditingCondition] =
    useState<MedicalCondition | null>(null);
  const [editingMedication, setEditingMedication] =
    useState<Medication | null>(null);

  // Medication reminders
  const {
    activeReminders,
    dismissReminder,
    notificationPermission,
    requestNotificationPermission,
  } = useMedicationReminders(medications);

  useEffect(() => {
    const loadData = async () => {
      const currentUser = getAuthUser();
      if (currentUser) {
        setUser(currentUser);
        const [conditionsData, scansData, labResultsData, medicationsData, userProfile] = await Promise.all([
          getConditions(currentUser.id),
          getScans(currentUser.id),
          getLabResults(currentUser.id),
          getMedications(currentUser.id),
          getProfile(currentUser.id),
        ]);
        setConditions(conditionsData);
        setScans(scansData);
        setLabResults(labResultsData);
        setMedications(medicationsData);
        if (userProfile) {
          setProfile(userProfile);
        } else {
          // Create default profile
          const newProfile: PatientProfile = {
            userId: currentUser.id,
            fullName: currentUser.name,
            updatedAt: new Date().toISOString(),
          };
          await saveProfile(newProfile);
          setProfile(newProfile);
        }
      }
    };
    loadData();
  }, []);

  const handleSaveCondition = async (condition: MedicalCondition) => {
    await saveCondition(condition);
    if (user) {
      const conditionsData = await getConditions(user.id);
      setConditions(conditionsData);
    }
    setShowConditionForm(false);
    setEditingCondition(null);
  };

  const handleDeleteCondition = async (id: string) => {
    if (confirm("Are you sure you want to delete this condition?")) {
      await deleteCondition(id);
      if (user) {
        const conditionsData = await getConditions(user.id);
        setConditions(conditionsData);
      }
    }
  };

  const handleEditCondition = (condition: MedicalCondition) => {
    setEditingCondition(condition);
    setShowConditionForm(true);
  };

  const handleSaveScan = async (scan: MedicalScan) => {
    await saveScan(scan);
    if (user) {
      const scansData = await getScans(user.id);
      setScans(scansData);
    }
    setShowScanForm(false);
  };

  const handleDeleteScan = async (id: string) => {
    if (confirm("Are you sure you want to delete this scan?")) {
      await deleteScan(id);
      if (user) {
        const scansData = await getScans(user.id);
        setScans(scansData);
      }
    }
  };

  const handleSaveLabResult = async (labResult: LabResult) => {
    await saveLabResult(labResult);
    if (user) {
      const labResultsData = await getLabResults(user.id);
      setLabResults(labResultsData);
    }
    setShowLabResultForm(false);
  };

  const handleDeleteLabResult = async (id: string) => {
    if (confirm("Are you sure you want to delete this lab result?")) {
      await deleteLabResult(id);
      if (user) {
        const labResultsData = await getLabResults(user.id);
        setLabResults(labResultsData);
      }
    }
  };

  const handleSaveMedication = async (medication: Medication) => {
    await saveMedication(medication);
    if (user) {
      const medicationsData = await getMedications(user.id);
      setMedications(medicationsData);
    }
    setShowMedicationForm(false);
    setEditingMedication(null);
  };

  const handleDeleteMedication = async (id: string) => {
    if (confirm("Are you sure you want to delete this medication?")) {
      await deleteMedication(id);
      if (user) {
        const medicationsData = await getMedications(user.id);
        setMedications(medicationsData);
      }
    }
  };

  const handleEditMedication = (medication: Medication) => {
    setEditingMedication(medication);
    setShowMedicationForm(true);
  };

  const handleUpdateMedicationSchedule = async (medicationId: string, schedules: any[]) => {
    const medication = medications.find((m) => m.id === medicationId);
    if (medication) {
      const updatedMedication: Medication = {
        ...medication,
        schedules,
        updatedAt: new Date().toISOString(),
      };
      await saveMedication(updatedMedication);
      if (user) {
        const medicationsData = await getMedications(user.id);
        setMedications(medicationsData);
      }
    }
  };

  const handleSaveProfile = async (updatedProfile: PatientProfile) => {
    await saveProfile(updatedProfile);
    if (user) {
      const profileData = await getProfile(user.id);
      setProfile(profileData);
    }
    setIsEditingProfile(false);
  };

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-black">
        <Navigation />
        {/* Medication Reminder Alerts */}
        <MedicationReminderAlerts
          reminders={activeReminders}
          onDismiss={dismissReminder}
          notificationPermission={notificationPermission}
          onRequestPermission={requestNotificationPermission}
        />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Patient Profile
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Manage your medical information and records
              </p>
            </div>

            {/* Patient Information */}
            <div className="bg-white dark:bg-gray-900 shadow rounded-lg mb-6" id="profile">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Personal Information
                  </h2>
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditingProfile && profile ? (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <ProfileForm
                      profile={profile}
                      onSave={handleSaveProfile}
                      onCancel={() => setIsEditingProfile(false)}
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Profile Picture Display */}
                    <div className="flex items-center space-x-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="relative">
                        {profile?.profilePicture ? (
                          <div className="relative">
                            <img
                              src={profile.profilePicture}
                              alt="Profile"
                              className="w-32 h-32 rounded-full object-cover border-4 border-primary-200 shadow-lg ring-4 ring-primary-50"
                            />
                            <div className="absolute inset-0 rounded-full border-4 border-white"></div>
                          </div>
                        ) : (
                          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 border-4 border-primary-300 shadow-lg flex items-center justify-center ring-4 ring-primary-50">
                            <svg
                              className="w-16 h-16 text-primary-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {profile?.fullName || user.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                          Patient Profile
                        </p>
                        {!profile?.profilePicture && (
                          <button
                            onClick={() => setIsEditingProfile(true)}
                            className="mt-3 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                          >
                            Upload profile picture →
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                          Full Name
                        </label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {profile?.fullName || user.name}
                        </p>
                      </div>
                      {profile?.dateOfBirth && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Date of Birth
                          </label>
                          <p className="mt-1 text-sm text-gray-900 dark:text-white">
                            {new Date(profile.dateOfBirth).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {profile?.bloodType && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Blood Type
                          </label>
                          <p className="mt-1 text-sm text-gray-900 dark:text-white">
                            {profile.bloodType}
                          </p>
                        </div>
                      )}
                    </div>

                    {profile?.allergies && profile.allergies.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                          Allergies
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {profile.allergies.map((allergy, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                            >
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile?.emergencyContact &&
                      (profile.emergencyContact.name ||
                        profile.emergencyContact.phone ||
                        profile.emergencyContact.relationship) && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                            Emergency Contact
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {profile.emergencyContact.name && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                  Name
                                </label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                  {profile.emergencyContact.name}
                                </p>
                              </div>
                            )}
                            {profile.emergencyContact.phone && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                  Phone Number
                                </label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                  {profile.emergencyContact.phone}
                                </p>
                              </div>
                            )}
                            {profile.emergencyContact.relationship && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                  Relationship
                                </label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                  {profile.emergencyContact.relationship}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    {(!profile?.dateOfBirth &&
                      !profile?.bloodType &&
                      (!profile?.allergies || profile.allergies.length === 0) &&
                      (!profile?.emergencyContact ||
                        (!profile.emergencyContact.name &&
                          !profile.emergencyContact.phone &&
                          !profile.emergencyContact.relationship))) && (
                      <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-300 mb-4">
                          Complete your profile by adding additional information.
                        </p>
                        <button
                          onClick={() => setIsEditingProfile(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                        >
                          Add Information
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Medical Conditions */}
            <div className="bg-white dark:bg-gray-900 shadow rounded-lg mb-6" id="conditions">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Medical Conditions
                  </h2>
                  <button
                    onClick={() => {
                      setEditingCondition(null);
                      setShowConditionForm(!showConditionForm);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    {showConditionForm ? "Cancel" : "Add Condition"}
                  </button>
                </div>

                {showConditionForm && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <ConditionForm
                      condition={editingCondition}
                      userId={user.id}
                      onSave={handleSaveCondition}
                      onCancel={() => {
                        setShowConditionForm(false);
                        setEditingCondition(null);
                      }}
                    />
                  </div>
                )}

                {conditions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-300 mb-4">
                      No medical conditions recorded yet.
                    </p>
                    <button
                      onClick={() => setShowConditionForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Add Your First Condition
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {conditions.map((condition) => (
                      <MedicalRecordCard
                        key={condition.id}
                        condition={condition}
                        onEdit={handleEditCondition}
                        onDelete={handleDeleteCondition}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Medications */}
            <div className="bg-white dark:bg-gray-900 shadow rounded-lg mb-6" id="medications">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Medications
                  </h2>
                  <button
                    onClick={() => {
                      setEditingMedication(null);
                      setShowMedicationForm(!showMedicationForm);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    {showMedicationForm ? "Cancel" : "Add Medication"}
                  </button>
                </div>

                {showMedicationForm && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <MedicationForm
                      medication={editingMedication}
                      userId={user.id}
                      onSave={handleSaveMedication}
                      onCancel={() => {
                        setShowMedicationForm(false);
                        setEditingMedication(null);
                      }}
                    />
                  </div>
                )}

                {medications.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-300 mb-4">
                      No medications recorded yet.
                    </p>
                    <button
                      onClick={() => setShowMedicationForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Add Your First Medication
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {medications.map((medication) => (
                      <MedicationCard
                        key={medication.id}
                        medication={medication}
                        onEdit={handleEditMedication}
                        onDelete={handleDeleteMedication}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Medication Schedule Table */}
            {medications.length > 0 && (
              <div className="mb-6" id="medication-schedule">
                <MedicationScheduleTable
                  medications={medications}
                  onUpdateSchedule={handleUpdateMedicationSchedule}
                />
              </div>
            )}

            {/* Medical Scans */}
            <div className="bg-white dark:bg-gray-900 shadow rounded-lg mb-6" id="scans">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Medical Scans
                  </h2>
                  <button
                    onClick={() => setShowScanForm(!showScanForm)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    {showScanForm ? "Cancel" : "Upload Scan"}
                  </button>
                </div>

                {showScanForm && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <UploadScan
                      userId={user.id}
                      onSave={handleSaveScan}
                      onCancel={() => setShowScanForm(false)}
                    />
                  </div>
                )}

                <ScanGallery scans={scans} onDelete={handleDeleteScan} />
              </div>
            </div>

            {/* Lab Results */}
            <div className="bg-white dark:bg-gray-900 shadow rounded-lg" id="lab-results">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Lab Results
                  </h2>
                  <button
                    onClick={() => setShowLabResultForm(!showLabResultForm)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    {showLabResultForm ? "Cancel" : "Upload Lab Result"}
                  </button>
                </div>

                {showLabResultForm && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <UploadLabResult
                      userId={user.id}
                      onSave={handleSaveLabResult}
                      onCancel={() => setShowLabResultForm(false)}
                    />
                  </div>
                )}

                <LabResultGallery
                  labResults={labResults}
                  onDelete={handleDeleteLabResult}
                />
              </div>
            </div>

            {/* Share Medical Records */}
            <div className="bg-white dark:bg-gray-900 shadow rounded-lg mt-6" id="share">
              <div className="px-4 py-5 sm:p-6">
                <ShareLinkManager userId={user.id} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

