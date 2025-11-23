"use client";

import { useState } from "react";

export default function AdminPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simple password protection (in production, use proper auth)
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setMessage(null);
    } else {
      setMessage({ type: "error", text: "Incorrect password" });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setMessage(null);

    try {
      const response = await fetch("/api/fb/fetch", {
        method: "POST",
      });

      const data = await response.json();

      if (data.posts) {
        setMessage({
          type: "success",
          text: `Successfully refreshed! Found ${data.posts.length} posts.`,
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to refresh posts",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Admin Access
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter admin password"
                required
              />
            </div>
            {message && (
              <div
                className={`p-3 rounded-lg ${
                  message.type === "error"
                    ? "bg-red-50 text-red-800"
                    : "bg-green-50 text-green-800"
                }`}
              >
                {message.text}
              </div>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Facebook Posts Sync
              </h2>
              <p className="text-gray-600 mb-4">
                Manually refresh the Facebook posts cache. This will fetch the latest
                posts from Facebook and update the cache.
              </p>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRefreshing ? "Refreshing..." : "Refresh Posts"}
              </button>
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === "error"
                    ? "bg-red-50 text-red-800"
                    : "bg-green-50 text-green-800"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setPassword("");
                  setMessage(null);
                }}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

