"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navigation from "@/components/Navigation";
import CommunityChat from "@/components/CommunityChat";
import { getAuthUser } from "@/lib/auth";
import { User } from "@/types/medical";

export default function CommunityPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getAuthUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

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
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Community Chat
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Connect with other patients and share experiences in a supportive community
              </p>
            </div>

            {/* Community Guidelines */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
                    Community Guidelines
                  </h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Be respectful and supportive to all members</li>
                    <li>• Do not share personal medical information that could identify you</li>
                    <li>• Remember that this is not a substitute for professional medical advice</li>
                    <li>• Report any inappropriate behavior</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Chat Component */}
            <CommunityChat userId={user.id} userName={user.name} />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

