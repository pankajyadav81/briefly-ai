"use client";

import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const [showProfile, setShowProfile] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserName(parsedUser.name || "User");
      } catch {
        setUserName("User");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a topic.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("briefResult", data.summary);
        router.push("/result");
      } else {
        alert("Failed to generate summary.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("briefResult");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white flex">

      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">

        {/* Header */}

        <div className="flex justify-between items-center mb-12">

          <div>

            <h1 className="text-5xl font-bold">
              {greeting}, {userName} 👋
            </h1>

            <p className="text-zinc-400 mt-3 text-lg">
              What would you like to understand today?
            </p>

          </div>

          <div className="relative">

            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-2xl hover:bg-zinc-800 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center font-bold text-lg uppercase">
                {userName.charAt(0)}
              </div>

              <div className="text-left hidden sm:block">
                <p className="font-semibold">{userName}</p>
                <p className="text-xs text-zinc-400">
                  AI Briefing User
                </p>
              </div>

              <svg
                className={`w-5 h-5 transition-transform ${
                  showProfile ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showProfile && (

              <div className="absolute right-0 mt-4 w-72 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-50">

                <div className="p-5 border-b border-zinc-800">

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-2xl font-bold uppercase">
                      {userName.charAt(0)}
                    </div>

                    <div>

                      <h3 className="font-semibold text-lg">
                        {userName}
                      </h3>

                      <p className="text-zinc-400 text-sm">
                        AI Briefing User
                      </p>

                    </div>

                  </div>

                </div>

                <div className="p-2">
                                    <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 transition"
                  >
                    📊 Dashboard
                  </Link>

                  <Link
                    href="/history"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 transition"
                  >
                    📚 History
                  </Link>

                  <Link
                    href="/saved"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 transition"
                  >
                    ⭐ Saved Briefs
                  </Link>

                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 transition"
                  >
                    ⚙️ Settings
                  </Link>

                  <div className="border-t border-zinc-800 my-2"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
                  >
                    🚪 Logout
                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

        {/* Create Brief */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

          <h2 className="text-2xl font-semibold mb-4">
            Create a New Brief
          </h2>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter any topic, paste content, or ask a question..."
            className="w-full h-40 bg-zinc-800 rounded-2xl p-5 outline-none resize-none"
          />

          <div className="flex gap-4 mt-6 flex-wrap">

            <Link
              href="/upload"
              className="px-6 py-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition"
            >
              📄 Upload PDF
            </Link>

            <Link
              href="/upload"
              className="px-6 py-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition"
            >
              🖼 Upload Image
            </Link>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? "Generating..." : "✨ Generate Brief"}
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}