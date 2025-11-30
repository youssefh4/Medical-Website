"use client";

import { useState, useEffect } from "react";
import { PatientProfile } from "@/types/medical";

interface ProfileFormProps {
  profile: PatientProfile;
  onSave: (profile: PatientProfile) => void;
  onCancel: () => void;
}

export default function ProfileForm({
  profile,
  onSave,
  onCancel,
}: ProfileFormProps) {
  const [formData, setFormData] = useState({
    fullName: profile.fullName || "",
    dateOfBirth: profile.dateOfBirth
      ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
      : "",
    bloodType: profile.bloodType || "",
    allergies: profile.allergies?.join(", ") || "",
    profilePicture: profile.profilePicture || "",
    emergencyContactName: profile.emergencyContact?.name || "",
    emergencyContactPhone: profile.emergencyContact?.phone || "",
    emergencyContactRelationship: profile.emergencyContact?.relationship || "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profilePicture: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    setFormData({
      ...formData,
      profilePicture: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse allergies from comma-separated string
    const allergiesArray = formData.allergies
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    // Build emergency contact object if at least name is provided
    const emergencyContact =
      formData.emergencyContactName.trim() ||
      formData.emergencyContactPhone.trim() ||
      formData.emergencyContactRelationship.trim()
        ? {
            name: formData.emergencyContactName.trim(),
            phone: formData.emergencyContactPhone.trim(),
            relationship: formData.emergencyContactRelationship.trim(),
          }
        : undefined;

    const updatedProfile: PatientProfile = {
      userId: profile.userId,
      fullName: formData.fullName.trim(),
      dateOfBirth: formData.dateOfBirth || undefined,
      bloodType: formData.bloodType.trim() || undefined,
      allergies: allergiesArray.length > 0 ? allergiesArray : undefined,
      profilePicture: formData.profilePicture || undefined,
      emergencyContact: emergencyContact,
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedProfile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Profile Picture Upload */}
      <div className="border-b border-gray-200 pb-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Profile Picture
        </label>
        <div className="flex items-center space-x-6">
          <div className="relative">
            {formData.profilePicture ? (
              <div className="relative">
                <img
                  src={formData.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary-200 shadow-md"
                />
                <button
                  type="button"
                  onClick={handleRemovePicture}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Remove picture"
                >
                  <svg
                    className="w-4 h-4"
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
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-gray-300 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
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
            <label
              htmlFor="profilePicture"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formData.profilePicture ? "Change Picture" : "Upload Picture"}
            </label>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <p className="mt-2 text-xs text-gray-500">
              JPG, PNG or GIF. Max size 5MB.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            required
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-700"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={(e) =>
              setFormData({ ...formData, dateOfBirth: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="bloodType"
            className="block text-sm font-medium text-gray-700"
          >
            Blood Type
          </label>
          <select
            id="bloodType"
            value={formData.bloodType}
            onChange={(e) =>
              setFormData({ ...formData, bloodType: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="">Select blood type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="allergies"
            className="block text-sm font-medium text-gray-700"
          >
            Allergies
          </label>
          <input
            type="text"
            id="allergies"
            value={formData.allergies}
            onChange={(e) =>
              setFormData({ ...formData, allergies: e.target.value })
            }
            placeholder="Separate multiple allergies with commas"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            Separate multiple allergies with commas (e.g., Peanuts, Shellfish, Penicillin)
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="emergencyContactName"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  emergencyContactName: e.target.value,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="emergencyContactPhone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  emergencyContactPhone: e.target.value,
                })
              }
              placeholder="(555) 123-4567"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="emergencyContactRelationship"
              className="block text-sm font-medium text-gray-700"
            >
              Relationship
            </label>
            <input
              type="text"
              id="emergencyContactRelationship"
              value={formData.emergencyContactRelationship}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  emergencyContactRelationship: e.target.value,
                })
              }
              placeholder="e.g., Spouse, Parent, Sibling"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

