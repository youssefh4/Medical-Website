"use client";

import { useState, useEffect } from "react";
import { ShareLink } from "@/types/medical";
import { getShareLinks, saveShareLink, deleteShareLink } from "@/lib/storage";
import { format } from "date-fns";

interface ShareLinkManagerProps {
  userId: string;
}

export default function ShareLinkManager({ userId }: ShareLinkManagerProps) {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [expirationDays, setExpirationDays] = useState(7);
  const [showQR, setShowQR] = useState<string | null>(null);

  useEffect(() => {
    loadShareLinks();
  }, [userId]);

  const loadShareLinks = () => {
    const links = getShareLinks(userId);
    setShareLinks(links);
  };

  const generateShareLink = () => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);

    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);

    const newLink: ShareLink = {
      id: Date.now().toString(),
      userId,
      token,
      expiresAt: expirationDate.toISOString(),
      createdAt: new Date().toISOString(),
      accessCount: 0,
    };

    saveShareLink(newLink);
    loadShareLinks();
  };

  const handleCopy = (link: ShareLink) => {
    const url = `${window.location.origin}/share/${link.token}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  const handleDelete = (linkId: string) => {
    if (confirm("Are you sure you want to delete this share link?")) {
      deleteShareLink(linkId);
      loadShareLinks();
    }
  };

  const handleRevoke = (link: ShareLink) => {
    if (confirm("Are you sure you want to revoke this share link?")) {
      const updatedLink: ShareLink = {
        ...link,
        expiresAt: new Date().toISOString(),
      };
      saveShareLink(updatedLink);
      loadShareLinks();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Share Medical Records
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
            Generate a QR code or link to share your medical records with doctors
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={expirationDays}
            onChange={(e) => setExpirationDays(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md px-3 py-2 text-sm"
          >
            <option value={1}>1 day</option>
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
          </select>
          <button
            onClick={generateShareLink}
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
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
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
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
            No share links created yet. Generate one to share your medical records.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {shareLinks.map((link) => {
            const isExpired = new Date(link.expiresAt) <= new Date();
            const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${link.token}`;

            return (
              <div
                key={link.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Share Link</span>
                    {isExpired ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                        Expired
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(link)}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => setShowQR(showQR === link.id ? null : link.id)}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium"
                    >
                      Show QR
                    </button>
                    {!isExpired && (
                      <button
                        onClick={() => handleRevoke(link)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium"
                      >
                        Revoke
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 mb-3">
                  <p className="text-xs text-gray-600 dark:text-gray-300 break-all">{url}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Expires: {format(new Date(link.expiresAt), "MMM dd, yyyy")}</span>
                  <span>Accessed: {link.accessCount || 0} times</span>
                </div>
                {showQR === link.id && (
                  <div className="mt-4 p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg inline-block">
                    <p className="text-xs text-gray-500 dark:text-gray-300 mb-2 text-center">QR Code</p>
                    <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <p className="text-sm text-gray-400 dark:text-gray-300">QR Code placeholder</p>
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
