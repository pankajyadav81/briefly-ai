"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [userName, setUserName] = useState("User");

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserName(parsedUser.name || "User");
      } catch {
        setUserName("User");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("briefResult");

    router.push("/login");
  };

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-zinc-950 border-r border-zinc-800 min-h-screen p-4 transition-all duration-300 flex flex-col`}
    >
      {/* Logo */}

      <div className="flex items-center justify-between mb-10">
        {isOpen && (
          <div>
            <h1 className="text-2xl font-bold text-blue-500">
              Briefly
            </h1>

            <p className="text-xs text-zinc-500">
              AI Briefing User
            </p>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-zinc-800 transition"
        >
          ☰
        </button>
      </div>

      {/* Navigation */}

      <nav className="flex flex-col gap-3">

        <Link
          href="/dashboard"
          className={`p-3 rounded-lg transition ${
            pathname === "/dashboard"
              ? "bg-blue-600 text-white"
              : "hover:bg-zinc-800"
          }`}
        >
          📊 {isOpen && "Dashboard"}
        </Link>

        <Link
          href="/upload"
          className={`p-3 rounded-lg transition ${
            pathname === "/upload"
              ? "bg-blue-600 text-white"
              : "hover:bg-zinc-800"
          }`}
        >
          📄 {isOpen && "Upload"}
        </Link>

        <Link
          href="/history"
          className={`p-3 rounded-lg transition ${
            pathname === "/history"
              ? "bg-blue-600 text-white"
              : "hover:bg-zinc-800"
          }`}
        >
          📚 {isOpen && "History"}
        </Link>
        {/*
        <Link
          href="/saved"
          className={`p-3 rounded-lg transition ${
            pathname === "/saved"
              ? "bg-blue-600 text-white"
              : "hover:bg-zinc-800"
          }`}
        >
          ⭐ {isOpen && "Saved Briefs"}
        </Link> */}

        <Link
          href="/settings"
          className={`p-3 rounded-lg transition ${
            pathname === "/settings"
              ? "bg-blue-600 text-white"
              : "hover:bg-zinc-800"
          }`}
        >
          ⚙️ {isOpen && "Settings"}
        </Link>

      </nav>

      {/* Profile */}

      <div className="mt-auto border-t border-zinc-800 pt-4">

        {isOpen ? (
          <>
            <p className="font-semibold">
              {userName}
            </p>

            <p className="text-sm text-zinc-400">
              AI Briefing User
            </p>

            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-red-600 hover:bg-red-700 p-2 rounded-lg transition"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="text-center text-2xl">
            👤
          </div>
        )}

      </div>

    </aside>
  );
}
