"use client";

import { useState, useEffect, useRef } from "react";
import { CommunityMessage } from "@/types/medical";
import { getCommunityMessages, saveCommunityMessage } from "@/lib/storage";
import { getAuthUser } from "@/lib/auth";
import { format, formatDistanceToNow } from "date-fns";

interface CommunityChatProps {
  userId: string;
  userName: string;
}

export default function CommunityChat({ userId, userName }: CommunityChatProps) {
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load messages on mount and set up auto-refresh
  useEffect(() => {
    loadMessages();
    // Refresh messages every 2 seconds to see new messages from other users
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = () => {
    const allMessages = getCommunityMessages(100); // Get last 100 messages (already sorted oldest first)
    setMessages(allMessages);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    const message: CommunityMessage = {
      id: Date.now().toString(),
      userId,
      userName,
      message: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    saveCommunityMessage(message);
    setNewMessage("");
    loadMessages();
    setIsLoading(false);
    
    // Only scroll to bottom when user sends their own message
    setTimeout(() => {
      if (messagesEndRef.current && chatContainerRef.current) {
        const container = chatContainerRef.current;
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
        if (isNearBottom) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[800px] bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
      {/* Chat Header */}
      <div className="bg-primary-600 text-white px-6 py-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold">Community Chat</h2>
          </div>
          <div className="text-sm text-primary-100">
            {messages.length} {messages.length === 1 ? "message" : "messages"}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
      >
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-gray-500 text-lg">No messages yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Be the first to start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.userId === userId;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwnMessage
                      ? "bg-primary-600 text-white rounded-br-none"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-none"
                  }`}
                >
                  {!isOwnMessage && (
                    <div
                      className={`text-xs font-semibold mb-1 ${
                        isOwnMessage ? "text-primary-100" : "text-primary-600"
                      }`}
                    >
                      {msg.userName}
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap break-words">
                    {msg.message}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      isOwnMessage ? "text-primary-100" : "text-gray-500"
                    }`}
                  >
                    {formatDistanceToNow(new Date(msg.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 rounded-b-lg">
        <form onSubmit={handleSend} className="flex space-x-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            rows={2}
            className="flex-1 resize-none rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isLoading}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              "Send"
            )}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          Messages are shared with all community members
        </p>
      </div>
    </div>
  );
}

