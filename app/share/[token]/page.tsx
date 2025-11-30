"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MedicalCondition, Medication, MedicalScan, PatientProfile } from "@/types/medical";
import { format } from "date-fns";
import ScanGallery from "@/components/ScanGallery";
import { getShareLinkByToken, incrementShareLinkAccess, getProfile, getConditions, getMedications, getScans } from "@/lib/storage";

export default function SharePage() {
  const params = useParams();
  const token = params.token as string;
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [conditions, setConditions] = useState<MedicalCondition[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [scans, setScans] = useState<MedicalScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadShareData();
  }, [token]);

  const loadShareData = () => {
    try {
      if (!token) {
        setError("This share link is invalid. Please request a new link from the patient.");
        setLoading(false);
        return;
      }

      // Get share link by token
      const shareLink = getShareLinkByToken(token);
      
      console.log("Token:", token);
      console.log("Share link found:", shareLink);
      
      if (!shareLink) {
        console.error("Share link not found in localStorage. This is expected if visiting from a different browser/device.");
        setError("This share link is invalid or has expired. Please request a new link from the patient. Note: Share links currently only work in the same browser where they were created due to localStorage limitations.");
        setLoading(false);
        return;
      }

      // Increment access count
      incrementShareLinkAccess(token);

      // Get user's medical data from storage
      const userId = shareLink.userId;
      const profileData = getProfile(userId);
      const conditionsData = getConditions(userId);
      const medicationsData = getMedications(userId);
      const scansData = getScans(userId);

      // Set the data
      setExpiresAt(shareLink.expiresAt);
      setProfile(profileData);
      setConditions(conditionsData);
      setMedications(medicationsData);
      setScans(scansData);
      setLoading(false);
    } catch (err) {
      console.error("Error loading share data:", err);
      setError("This share link is invalid or corrupted. Please request a new link from the patient.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading medical records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
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
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Link Expired or Invalid</h2>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-4">
            Please contact the patient to request a new share link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Medical Records - Read Only
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Shared medical information for healthcare providers
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">
                Link expires: {expiresAt && format(new Date(expiresAt), "MMM dd, yyyy")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Patient Information */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Patient Information
              </h2>
              <div className="flex items-start space-x-6">
                {profile?.profilePicture && (
                  <div className="flex-shrink-0">
                    <img
                      src={profile.profilePicture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary-200 shadow-md"
                    />
                  </div>
                )}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {profile?.fullName || "Not provided"}
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
                  {profile?.emergencyContact && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {profile.emergencyContact.name && (
                          <div>
                            <span className="text-xs text-gray-500">Name</span>
                            <p className="text-sm text-gray-900">
                              {profile.emergencyContact.name}
                            </p>
                          </div>
                        )}
                        {profile.emergencyContact.phone && (
                          <div>
                            <span className="text-xs text-gray-500">Phone</span>
                            <p className="text-sm text-gray-900">
                              {profile.emergencyContact.phone}
                            </p>
                          </div>
                        )}
                        {profile.emergencyContact.relationship && (
                          <div>
                            <span className="text-xs text-gray-500">Relationship</span>
                            <p className="text-sm text-gray-900">
                              {profile.emergencyContact.relationship}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Medical Conditions */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Medical Conditions
              </h2>
              {conditions.length === 0 ? (
                <p className="text-gray-500 text-sm">No medical conditions recorded.</p>
              ) : (
                <div className="space-y-4">
                  {conditions.map((condition) => (
                    <div
                      key={condition.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {condition.condition}
                          </h3>
                          {condition.description && (
                            <p className="mt-1 text-sm text-gray-600">
                              {condition.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                            {condition.diagnosisDate && (
                              <span>
                                Diagnosed: {format(new Date(condition.diagnosisDate), "MMM dd, yyyy")}
                              </span>
                            )}
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                condition.status === "active"
                                  ? "bg-red-100 text-red-800"
                                  : condition.status === "chronic"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {condition.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Medications */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Medications
              </h2>
              {medications.length === 0 ? (
                <p className="text-gray-500 text-sm">No medications recorded.</p>
              ) : (
                <div className="space-y-4">
                  {medications.map((medication) => (
                    <div
                      key={medication.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {medication.name}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                medication.status === "active"
                                  ? "bg-blue-100 text-blue-800"
                                  : medication.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {medication.status}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            {medication.dosage && (
                              <p>
                                <span className="font-medium">Dosage:</span> {medication.dosage}
                              </p>
                            )}
                            {medication.frequency && (
                              <p>
                                <span className="font-medium">Frequency:</span> {medication.frequency}
                              </p>
                            )}
                            {medication.startDate && (
                              <div className="flex items-center gap-4 mt-2">
                                <span>
                                  <span className="font-medium">Started:</span>{" "}
                                  {format(new Date(medication.startDate), "MMM dd, yyyy")}
                                </span>
                                {medication.endDate && (
                                  <span>
                                    <span className="font-medium">Ended:</span>{" "}
                                    {format(new Date(medication.endDate), "MMM dd, yyyy")}
                                  </span>
                                )}
                              </div>
                            )}
                            {medication.prescriber && (
                              <p>
                                <span className="font-medium">Prescribed by:</span> {medication.prescriber}
                              </p>
                            )}
                            {medication.notes && (
                              <p className="mt-2 text-gray-500 italic">{medication.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Medical Scans */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Medical Scans
              </h2>
              {scans.length === 0 ? (
                <p className="text-gray-500 text-sm">No medical scans uploaded.</p>
              ) : (
                <ScanGallery scans={scans} readOnly={true} />
              )}
            </div>
          </div>

          {/* Footer Notice */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Read-Only Access:</strong> This is a read-only view of the patient's medical records.
                  This link will expire on {expiresAt && format(new Date(expiresAt), "MMM dd, yyyy")}.
                  For any questions or updates, please contact the patient directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
