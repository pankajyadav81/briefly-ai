"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";

interface SavedItem {
  _id: string;
  title: string;
  summary: string;
  createdAt: string;
}

export default function SavedPage() {
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaved();
  }, []);

  async function fetchSaved() {
    try {
      const response = await fetch("/api/saved");
      const data = await response.json();

      if (data.success) {
        setSaved(data.saved);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-5xl font-bold mb-10">
          Saved Briefs
        </h1>

        {loading && (
          <p className="text-zinc-400">
            Loading...
          </p>
        )}

        {!loading && saved.length === 0 && (
          <div className="text-center mt-24">
            <div className="text-8xl mb-6">
              ⭐
            </div>

            <h2 className="text-4xl font-bold mb-4">
              No Saved Briefs
            </h2>

            <p className="text-zinc-400 mb-8">
              Save important AI Briefs here.
            </p>

            <Link
              href="/upload"
              className="px-8 py-4 bg-blue-600 rounded-xl"
            >
              Generate Brief
            </Link>
          </div>
        )}

        {saved.length > 0 && (
          <div className="space-y-6">
            {saved.map((item) => (
              <div
                key={item._id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-yellow-500 transition"
              >
                <h2 className="text-2xl font-semibold mb-3">
                  {item.title}
                </h2>

                <p className="text-zinc-400 line-clamp-3 mb-4">
                  {item.summary}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>

                  <div className="flex gap-3">
                    <Link
                      href={`/result?id=${item._id}`}
                      className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                    >
                      Open
                    </Link>

                    <button
                      className="px-5 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-700 transition"
                    >
                      ⭐ Saved
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}