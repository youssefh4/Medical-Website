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
} from "@/lib/storage";
import { MedicalCondition, MedicalScan, PatientProfile, Medication } from "@/types/medical";
import MedicalRecordCard from "@/components/MedicalRecordCard";
import ConditionForm from "@/components/ConditionForm";
import ScanGallery from "@/components/ScanGallery";
import UploadScan from "@/components/UploadScan";
import ProfileForm from "@/components/ProfileForm";
import MedicationForm from "@/components/MedicationForm";
import MedicationCard from "@/components/MedicationCard";
import ShareLinkManager from "@/components/ShareLinkManager";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [conditions, setConditions] = useState<MedicalCondition[]>([]);
  const [scans, setScans] = useState<MedicalScan[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [showConditionForm, setShowConditionForm] = useState(false);
  const [showScanForm, setShowScanForm] = useState(false);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingCondition, setEditingCondition] =
    useState<MedicalCondition | null>(null);
  const [editingMedication, setEditingMedication] =
    useState<Medication | null>(null);

  useEffect(() => {
    const currentUser = getAuthUser();
    if (currentUser) {
      setUser(currentUser);
      setConditions(getConditions(currentUser.id));
      setScans(getScans(currentUser.id));
      setMedications(getMedications(currentUser.id));
      const userProfile = getProfile(currentUser.id);
      if (userProfile) {
        setProfile(userProfile);
      } else {
        // Create default profile
        const newProfile: PatientProfile = {
          userId: currentUser.id,
          fullName: currentUser.name,
          updatedAt: new Date().toISOString(),
        };
        saveProfile(newProfile);
        setProfile(newProfile);
      }
    }
  }, []);

  const handleSaveCondition = (condition: MedicalCondition) => {
    saveCondition(condition);
    if (user) {
      setConditions(getConditions(user.id));
    }
    setShowConditionForm(false);
    setEditingCondition(null);
  };

  const handleDeleteCondition = (id: string) => {
    if (confirm("Are you sure you want to delete this condition?")) {
      deleteCondition(id);
      if (user) {
        setConditions(getConditions(user.id));
      }
    }
  };

  const handleEditCondition = (condition: MedicalCondition) => {
    setEditingCondition(condition);
    setShowConditionForm(true);
  };

  const handleSaveScan = (scan: MedicalScan) => {
    saveScan(scan);
    if (user) {
      setScans(getScans(user.id));
    }
    setShowScanForm(false);
  };

  const handleDeleteScan = (id: string) => {
    if (confirm("Are you sure you want to delete this scan?")) {
      deleteScan(id);
      if (user) {
        setScans(getScans(user.id));
      }
    }
  };

  const handleSaveMedication = (medication: Medication) => {
    saveMedication(medication);
    if (user) {
      setMedications(getMedications(user.id));
    }
    setShowMedicationForm(false);
    setEditingMedication(null);
  };

  const handleDeleteMedication = (id: string) => {
    if (confirm("Are you sure you want to delete this medication?")) {
      deleteMedication(id);
      if (user) {
        setMedications(getMedications(user.id));
      }
    }
  };

  const handleEditMedication = (medication: Medication) => {
    setEditingMedication(medication);
    setShowMedicationForm(true);
  };

  const handleSaveProfile = (updatedProfile: PatientProfile) => {
    saveProfile(updatedProfile);
    if (user) {
      setProfile(getProfile(user.id));
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
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Patient Profile
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your medical information and records
              </p>
            </div>

            {/* Patient Information */}
            <div className="bg-white shadow rounded-lg mb-6" id="profile">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
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
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <ProfileForm
                      profile={profile}
                      onSave={handleSaveProfile}
                      onCancel={() => setIsEditingProfile(false)}
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Profile Picture Display */}
                    <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
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
                        <h3 className="text-2xl font-bold text-gray-900">
                          {profile?.fullName || user.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Patient Profile
                        </p>
                        {!profile?.profilePicture && (
                          <button
                            onClick={() => setIsEditingProfile(true)}
                            className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Upload profile picture →
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {profile?.fullName || user.name}
                        </p>
                      </div>
                      {profile?.dateOfBirth && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Date of Birth
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {new Date(profile.dateOfBirth).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {profile?.bloodType && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Blood Type
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {profile.bloodType}
                          </p>
                        </div>
                      )}
                    </div>

                    {profile?.allergies && profile.allergies.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Allergies
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {profile.allergies.map((allergy, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
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
                        <div className="border-t border-gray-200 pt-4">
                          <h3 className="text-lg font-medium text-gray-900 mb-3">
                            Emergency Contact
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {profile.emergencyContact.name && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Name
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                  {profile.emergencyContact.name}
                                </p>
                              </div>
                            )}
                            {profile.emergencyContact.phone && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Phone Number
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                  {profile.emergencyContact.phone}
                                </p>
                              </div>
                            )}
                            {profile.emergencyContact.relationship && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Relationship
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
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
                      <div className="text-center py-8 border-t border-gray-200">
                        <p className="text-gray-500 mb-4">
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
            <div className="bg-white shadow rounded-lg mb-6" id="conditions">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
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
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
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
                    <p className="text-gray-500 mb-4">
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
            <div className="bg-white shadow rounded-lg mb-6" id="medications">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
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
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
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
                    <p className="text-gray-500 mb-4">
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

            {/* Medical Scans */}
            <div className="bg-white shadow rounded-lg" id="scans">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
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
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
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

            {/* Share Medical Records */}
            <div className="bg-white shadow rounded-lg mt-6" id="share">
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

