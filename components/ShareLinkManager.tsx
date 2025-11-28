"use client";

import { useState, useEffect } from "react";
import { ShareLink } from "@/types/medical";
// Using QR code API service instead of library
import { format } from "date-fns";
import {
  getShareLinks,
  saveShareLink,
  revokeShareLink,
  deleteShareLink,
  getConditions,
  getMedications,
  getScans,
  getProfile,
} from "@/lib/storage";

interface ShareLinkManagerProps {
  userId: string;
}

export default function ShareLinkManager({ userId }: ShareLinkManagerProps) {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [showQRCode, setShowQRCode] = useState<string | null>(null);
  const [expirationDays, setExpirationDays] = useState(7);

  useEffect(() => {
    loadShareLinks();
  }, [userId]);

  const loadShareLinks = () => {
    setShareLinks(getShareLinks(userId));
  };

  const generateToken = (): string => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const createShareLink = () => {
    const token = generateToken();
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + expirationDays);
    // Set to end of day (23:59:59) to ensure full day validity
    expiresAt.setHours(23, 59, 59, 999);

    const newShareLink: ShareLink = {
      id: Date.now().toString(),
      userId,
      token,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      isActive: true,
      accessCount: 0,
    };

    saveShareLink(newShareLink);
    loadShareLinks();
    setShowQRCode(token);
  };

  // Generate a data-embedded share URL that works across browsers
  const getShareUrl = (token: string, forQRCode: boolean = false): string => {
    if (typeof window === "undefined") return "";
    
    // For QR codes, use local IP so other devices on same network can access
    const LOCAL_IP = "172.20.10.14";
    const baseUrl = forQRCode 
      ? `http://${LOCAL_IP}:3000`
      : window.location.origin;
    
    // Get share link from localStorage directly (not from state which may be stale)
    const allLinks = getShareLinks(userId);
    const link = allLinks.find((s) => s.token === token);
    
    // If no link found, get expiration from the dropdown
    const expiresAt = link?.expiresAt || (() => {
      const date = new Date();
      date.setDate(date.getDate() + expirationDays);
      date.setHours(23, 59, 59, 999);
      return date.toISOString();
    })();
    
    // Get all medical data
    const profile = getProfile(userId);
    const conditions = getConditions(userId);
    const medications = getMedications(userId);
    const scans = getScans(userId);
    
    let shareData;
    if (forQRCode) {
      // QR codes: Only include critical medical info (minimal data)
      // This keeps the QR code scannable
      shareData = {
        e: expiresAt, // expiration
        p: profile ? {
          n: profile.fullName,
          b: profile.bloodType,
          a: profile.allergies,
          d: profile.dateOfBirth,
          ec: profile.emergencyContact,
        } : null,
        c: conditions.map(c => ({
          n: c.condition,
          s: c.status,
          d: c.diagnosisDate,
        })),
        m: medications.map(m => ({
          n: m.name,
          d: m.dosage,
          f: m.frequency,
          s: m.status,
        })),
      };
    } else {
      // Full data for copy link
      shareData = {
        expiresAt,
        profile,
        conditions,
        medications,
        scans,
      };
    }
    
    // Encode as base64
    const encodedData = btoa(encodeURIComponent(JSON.stringify(shareData)));
    
    return `${baseUrl}/share/${token}?data=${encodedData}`;
  };

  const handleRevoke = (id: string) => {
    if (confirm("Are you sure you want to revoke this share link?")) {
      revokeShareLink(id);
      loadShareLinks();
      if (showQRCode) {
        const link = shareLinks.find((s) => s.id === id);
        if (link?.token === showQRCode) {
          setShowQRCode(null);
        }
      }
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this share link?")) {
      deleteShareLink(id);
      loadShareLinks();
      if (showQRCode) {
        const link = shareLinks.find((s) => s.id === id);
        if (link?.token === showQRCode) {
          setShowQRCode(null);
        }
      }
    }
  };


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Link copied to clipboard!");
  };

  const downloadQRCode = (token: string) => {
    const shareUrl = getShareUrl(token, true); // Use QR-optimized URL (smaller)
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(shareUrl)}`;
    
    // Fetch the image and download it
    fetch(qrImageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = `medical-profile-qr-${token.substring(0, 8)}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading QR code:", error);
        alert("Failed to download QR code. Please try again.");
      });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Share Medical Records
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Generate a QR code or link to share your medical records with doctors
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={expirationDays}
            onChange={(e) => setExpirationDays(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value={1}>1 day</option>
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
          </select>
          <button
            onClick={createShareLink}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Generate Share Link
          </button>
        </div>
      </div>

      {shareLinks.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">
            No active share links. Generate one to share your medical records.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {shareLinks.map((link) => {
            const shareUrl = getShareUrl(link.token);
            const isExpired = new Date(link.expiresAt) < new Date();
            const isShowing = showQRCode === link.token;

            return (
              <div
                key={link.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Share Link
                      </span>
                      {isExpired ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Expired
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-2 font-mono break-all">
                      {shareUrl}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        Expires: {format(new Date(link.expiresAt), "MMM dd, yyyy")}
                      </span>
                      <span>•</span>
                      <span>Accessed: {link.accessCount} times</span>
                      {link.lastAccessedAt && (
                        <>
                          <span>•</span>
                          <span>
                            Last: {format(new Date(link.lastAccessedAt), "MMM dd")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => copyToClipboard(shareUrl)}
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                      title="Copy link"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => setShowQRCode(isShowing ? null : link.token)}
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                    >
                      {isShowing ? "Hide QR" : "Show QR"}
                    </button>
                    <button
                      onClick={() => handleRevoke(link.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Revoke
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {isShowing && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                        <div id={`qrcode-${link.token}`} className="flex items-center justify-center">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getShareUrl(link.token, true))}`}
                            alt="QR Code"
                            className="w-48 h-48"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => downloadQRCode(link.token)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          Download QR Code
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-gray-500 text-center max-w-md">
                        Doctors can scan this QR code to view your medical records.
                        The link expires on {format(new Date(link.expiresAt), "MMM dd, yyyy")}.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

