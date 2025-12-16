"use client";

import { useState, useEffect } from "react";
import { ShareLink } from "@/types/medical";
import {
  getShareLinks,
  saveShareLink,
  deleteShareLink,
  getProfile,
  getConditions,
  getMedications,
  getScans,
  getLabResults,
} from "@/lib/storage";
import { format } from "date-fns";

interface ShareLinkManagerProps {
  userId: string;
}

export default function ShareLinkManager({ userId }: ShareLinkManagerProps) {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [expirationDays, setExpirationDays] = useState(7);
  const [showQR, setShowQR] = useState<string | null>(null);
  const [localIP, setLocalIP] = useState<string | null>(null);
  const [detectedIPs, setDetectedIPs] = useState<string[]>([]);
  const [ipDetectionError, setIpDetectionError] = useState<string | null>(null);

  // Get local network IP address for QR codes
  useEffect(() => {
    const getLocalIP = async () => {
      const foundIPs: string[] = [];
      
      try {
        // Method 1: Try WebRTC (most reliable)
        const pc = new RTCPeerConnection({ 
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        
        let ipFound = false;
        const timeout = setTimeout(() => {
          if (!ipFound && foundIPs.length === 0) {
            pc.close();
            tryNetworkInterfaces();
          } else if (foundIPs.length > 0) {
            // Use the first non-localhost IP (usually the main network adapter)
            const mainIP = foundIPs.find(ip => !ip.startsWith("192.168.137.")) || foundIPs[0];
            setLocalIP(mainIP);
            setDetectedIPs(foundIPs);
          }
        }, 5000);

        pc.createDataChannel("");
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            const candidate = event.candidate.candidate;
            // Match IPv4 addresses (not localhost)
            const match = candidate.match(/([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/);
            if (match && match[1] && !match[1].startsWith("127.") && !match[1].startsWith("0.")) {
              const ip = match[1];
              if (!foundIPs.includes(ip)) {
                foundIPs.push(ip);
                console.log("Detected IP:", ip);
              }
            }
          } else if (event.candidate === null) {
            // No more candidates
            clearTimeout(timeout);
            pc.close();
            if (foundIPs.length > 0) {
              // Use the first non-hotspot IP, or first IP if all are hotspots
              const mainIP = foundIPs.find(ip => !ip.startsWith("192.168.137.")) || foundIPs[0];
              setLocalIP(mainIP);
              setDetectedIPs(foundIPs);
            } else {
              tryNetworkInterfaces();
            }
          }
        };
        
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
        } catch (error) {
          clearTimeout(timeout);
          pc.close();
          if (foundIPs.length > 0) {
            const mainIP = foundIPs.find(ip => !ip.startsWith("192.168.137.")) || foundIPs[0];
            setLocalIP(mainIP);
            setDetectedIPs(foundIPs);
          } else {
            tryNetworkInterfaces();
          }
        }
      } catch (error) {
        console.log("WebRTC method failed:", error);
        if (foundIPs.length > 0) {
          const mainIP = foundIPs.find(ip => !ip.startsWith("192.168.137.")) || foundIPs[0];
          setLocalIP(mainIP);
          setDetectedIPs(foundIPs);
        } else {
          tryNetworkInterfaces();
        }
      }
    };

    const tryNetworkInterfaces = () => {
      // Method 2: Try to get IP from window.location if on network
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        // If not localhost, the hostname might be the IP
        if (hostname !== 'localhost' && hostname !== '127.0.0.1' && /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
          setLocalIP(hostname);
          setDetectedIPs([hostname]);
        } else {
          // Show instructions for manual IP entry
          setIpDetectionError("Could not auto-detect IP. Run 'ipconfig' in CMD to find your IP address.");
        }
      }
    };

    getLocalIP();
  }, []);

  useEffect(() => {
    loadShareLinks();
  }, [userId]);

  const loadShareLinks = async () => {
    const links = await getShareLinks(userId);
    setShareLinks(links);
  };

  const generateShareLink = async () => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);

    const token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Take a snapshot of the user's current medical data for sharing
    const [profile, conditions, medications, scans, labResults] =
      await Promise.all([
        getProfile(userId),
        getConditions(userId),
        getMedications(userId),
        getScans(userId),
        getLabResults(userId),
      ]);

    const newLink: ShareLink = {
      id: Date.now().toString(),
      userId,
      token,
      expiresAt: expirationDate.toISOString(),
      createdAt: new Date().toISOString(),
      isActive: true,
      accessCount: 0,
      sharedProfile: profile,
      sharedConditions: conditions,
      sharedMedications: medications,
      sharedScans: scans,
      sharedLabResults: labResults,
    };

    await saveShareLink(newLink);
    await loadShareLinks();
  };

  const handleCopy = (link: ShareLink) => {
    const url = `${window.location.origin}/share/${link.token}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  const handleDelete = async (linkId: string) => {
    if (confirm("Are you sure you want to delete this share link?")) {
      await deleteShareLink(linkId);
      await loadShareLinks();
    }
  };

  const handleRevoke = async (link: ShareLink) => {
    if (confirm("Are you sure you want to revoke this share link?")) {
      const updatedLink: ShareLink = {
        ...link,
        isActive: false,
      };
      await saveShareLink(updatedLink);
      await loadShareLinks();
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
            const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
            const url = `${baseUrl}/share/${link.token}`;
            
            // For QR code, use local network IP if available and on localhost
            const qrUrl = (() => {
              if (typeof window === 'undefined') return url;
              const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
              if (isLocalhost && localIP) {
                const port = window.location.port || '3000';
                const networkUrl = `http://${localIP}:${port}/share/${link.token}`;
                console.log('QR Code URL (network):', networkUrl);
                return networkUrl;
              }
              console.log('QR Code URL (local):', url);
              return url;
            })();

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
                    <div className="w-48 h-48 bg-white p-2 rounded flex items-center justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=${encodeURIComponent(qrUrl)}`}
                        alt="QR Code"
                        className="w-full h-full"
                        onError={(e) => {
                          // Fallback if QR code API fails
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.parentElement?.querySelector('.qr-fallback');
                          if (fallback) {
                            (fallback as HTMLElement).style.display = 'block';
                          }
                        }}
                      />
                      <div className="qr-fallback hidden w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <p className="text-sm text-gray-400 dark:text-gray-300 text-center px-2">
                          QR Code unavailable. Please copy the link instead.
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Scan to view medical records</p>
                    {(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
                      <div className="mt-2 space-y-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        {localIP ? (
                          <>
                            <p className="text-xs text-blue-700 dark:text-blue-300 text-center font-semibold">
                              📱 Network URL for QR Code:
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 text-center font-mono break-all">
                              {qrUrl}
                            </p>
                            {detectedIPs.length > 1 && (
                              <p className="text-[10px] text-blue-500 dark:text-blue-400 text-center mt-1">
                                (Detected {detectedIPs.length} IPs, using: {localIP})
                              </p>
                            )}
                            <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-2 space-y-1">
                              <p className="font-semibold">Troubleshooting:</p>
                              <p>• Make sure your phone is on the same Wi‑Fi network</p>
                              <p>• Check Windows Firewall allows port 3000</p>
                              <p>• Try accessing <span className="font-mono">{qrUrl}</span> directly on your phone</p>
                            </div>
                          </>
                        ) : (
                          <div className="text-xs text-yellow-700 dark:text-yellow-400 text-center space-y-2">
                            <p className="font-semibold">⚠️ IP not detected automatically</p>
                            <div className="text-[10px] space-y-1 text-left bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                              <p><strong>To find your IP:</strong></p>
                              <p>1. Open CMD (Command Prompt)</p>
                              <p>2. Type: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">ipconfig</code></p>
                              <p>3. Look for "IPv4 Address" (usually 192.168.x.x)</p>
                              <p>4. Use: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">http://YOUR_IP:3000/share/{link.token}</code></p>
                            </div>
                          </div>
                        )}
                        {ipDetectionError && (
                          <p className="text-[10px] text-red-600 dark:text-red-400 text-center mt-1">{ipDetectionError}</p>
                        )}
                      </div>
                    )}
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
