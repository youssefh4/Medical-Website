"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navigation from "@/components/Navigation";
import { getAuthUser } from "@/lib/auth";
import { getConditions, getScans, getMedications } from "@/lib/storage";
import { MedicalCondition, MedicalScan, Medication } from "@/types/medical";
import Link from "next/link";
import { format } from "date-fns";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [conditions, setConditions] = useState<MedicalCondition[]>([]);
  const [scans, setScans] = useState<MedicalScan[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const currentUser = getAuthUser();
      if (currentUser) {
        setUser(currentUser);
        const [conditionsData, scansData, medicationsData] = await Promise.all([
          getConditions(currentUser.id),
          getScans(currentUser.id),
          getMedications(currentUser.id),
        ]);
        setConditions(conditionsData);
        setScans(scansData);
        setMedications(medicationsData);
      }
    };
    loadData();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-black">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.name}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Manage your medical records and health information
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="bg-white dark:bg-gray-900 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">
                          Medical Conditions
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                          {conditions.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3">
                  <div className="text-sm">
                    <Link
                      href="/profile#conditions"
                      className="font-medium text-primary-700 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 transition-colors"
                    >
                      View all conditions
                    </Link>
                  </div>
                </div>
              </div>

               <div className="bg-white dark:bg-gray-900 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-medical-500 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">
                          Medical Scans
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                          {scans.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3">
                  <div className="text-sm">
                    <Link
                      href="/profile#scans"
                      className="font-medium text-primary-700 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 transition-colors"
                    >
                      View all scans
                    </Link>
                  </div>
                </div>
              </div>

               <div className="bg-white dark:bg-gray-900 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">
                          Medications
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                          {medications.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3">
                  <div className="text-sm">
                    <Link
                      href="/profile#medications"
                      className="font-medium text-primary-700 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 transition-colors"
                    >
                      View all medications
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h3>
                {conditions.length === 0 && scans.length === 0 && medications.length === 0 ? (
                  <div className="text-center py-12">
                     <p className="text-gray-500 dark:text-gray-300 mb-4">
                      No medical records yet. Get started by adding your first
                      condition, medication, or scan.
                    </p>
                    <Link
                      href="/profile"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Go to Profile
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {conditions.slice(0, 3).map((condition) => (
                      <div
                        key={condition.id}
                         className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                      >
                        <div>
                           <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {condition.condition}
                          </p>
                           <p className="text-sm text-gray-500 dark:text-gray-300">
                            Diagnosed: {format(new Date(condition.diagnosisDate), "MMM dd, yyyy")}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            condition.status === "active"
                              ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                              : condition.status === "chronic"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                              : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          }`}
                        >
                          {condition.status}
                        </span>
                      </div>
                    ))}
                    {medications.slice(0, 3).map((medication) => (
                      <div
                        key={medication.id}
                         className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                      >
                        <div>
                           <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {medication.name}
                          </p>
                           <p className="text-sm text-gray-500 dark:text-gray-300">
                            {medication.dosage} - {medication.frequency}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            medication.status === "active"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                              : medication.status === "completed"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {medication.status}
                        </span>
                      </div>
                    ))}
                    {scans.slice(0, 3).map((scan) => (
                      <div
                        key={scan.id}
                         className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                      >
                        <div>
                           <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {scan.title}
                          </p>
                           <p className="text-sm text-gray-500 dark:text-gray-300">
                            {scan.scanType} - {format(new Date(scan.scanDate), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

