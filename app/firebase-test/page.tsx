"use client";

import { useEffect, useState } from "react";
import { testFirebase } from "@/lib/firebaseTest";
import { db, auth } from "@/lib/firebase";

export default function FirebaseTestPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFirebase = async () => {
      const result = await testFirebase();
      setStatus(result);
      setLoading(false);
    };
    checkFirebase();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking Firebase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Firebase Connection Test</h1>
        
        <div className={`p-6 rounded-lg mb-6 ${
          status?.connected 
            ? "bg-green-50 border-2 border-green-200" 
            : "bg-yellow-50 border-2 border-yellow-200"
        }`}>
          <h2 className="text-xl font-semibold mb-4">
            Status: {status?.connected ? "✅ Connected" : "⚠️ Not Connected"}
          </h2>
          
          {status?.error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <strong>Error:</strong> {status.error}
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold">Details:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(status?.details, null, 2)}
            </pre>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Firebase Initialization Check</h3>
          <div className="space-y-2">
            <p><strong>Firestore (db):</strong> {db ? "✅ Initialized" : "❌ Not initialized"}</p>
            <p><strong>Auth:</strong> {auth ? "✅ Initialized" : "❌ Not initialized"}</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-2">Troubleshooting Steps:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Check that <code>.env.local</code> exists with your Firebase config</li>
            <li>Restart the dev server after creating/editing <code>.env.local</code></li>
            <li>Verify Firestore security rules are set up (see FIREBASE_SETUP.md Step 8)</li>
            <li>Make sure Authentication is enabled in Firebase Console</li>
            <li>Check browser console (F12) for any error messages</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

