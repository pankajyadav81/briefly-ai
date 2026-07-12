"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";

interface HistoryItem {
  _id: string;
  title: string;
  summary: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const response = await fetch("/api/history");
      const data = await response.json();

      if (data.success) {
        setHistory(data.history);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteHistory(id: string) {
    const ok = window.confirm(
      "Delete this brief permanently?"
    );

    if (!ok) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/history?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        setHistory((prev) =>
          prev.filter((item) => item._id !== id)
        );
      } else {
        alert("Delete failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  }

  async function clearHistory() {
    const ok = window.confirm(
      "Delete ALL history?\nThis cannot be undone."
    );

    if (!ok) return;

    try {
      setDeleting(true);

      const response = await fetch("/api/history", {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setHistory([]);
      } else {
        alert("Delete failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  }

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const query = search.toLowerCase();

      return (
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query)
      );
    });
  }, [history, search]);

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">

          <h1 className="text-5xl font-bold">
            Brief History
          </h1>

          <button
            onClick={clearHistory}
            disabled={
              history.length === 0 || deleting
            }
            className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed transition"
          >
            🗑 Clear All
          </button>

        </div>

        <div className="mb-8">

          <div className="relative">

            <input
              type="text"
              placeholder="🔍 Search your briefs..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            )}

          </div>

          {!loading &&
            history.length > 0 && (
              <p className="text-zinc-500 text-sm mt-3">
                {filteredHistory.length} Brief
                {filteredHistory.length !== 1
                  ? "s"
                  : ""}
                {" "}Found
              </p>
            )}
        </div>
                {loading && (
          <p className="text-zinc-400">
            Loading...
          </p>
        )}

        {!loading && history.length === 0 && (
          <div className="text-center mt-24">
            <div className="text-8xl mb-6">
              📚
            </div>

            <h2 className="text-4xl font-bold mb-4">
              No Briefs Yet
            </h2>

            <p className="text-zinc-400 mb-8">
              Generate your first AI Brief.
            </p>

            <Link
              href="/upload"
              className="px-8 py-4 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
            >
              Create Brief
            </Link>
          </div>
        )}

        {!loading &&
          history.length > 0 &&
          filteredHistory.length === 0 && (
            <div className="text-center mt-24">
              <div className="text-7xl mb-5">
                🔍
              </div>

              <h2 className="text-3xl font-bold mb-3">
                No Matching Brief Found
              </h2>

              <p className="text-zinc-400">
                Try searching with another keyword.
              </p>
            </div>
          )}

        {filteredHistory.length > 0 && (
          <div className="space-y-6">
            {filteredHistory.map((item) => (
              <div
                key={item._id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-blue-500 transition duration-300"
              >
                <h2 className="text-2xl font-semibold mb-3">
                  {item.title}
                </h2>

                <p className="text-zinc-400 line-clamp-3 mb-5">
                  {item.summary}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>

                  <div className="flex gap-3">

                    <button
                      onClick={() =>
                        deleteHistory(item._id)
                      }
                      disabled={deleting}
                      className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 transition"
                    >
                      🗑 Delete
                    </button>

                    <Link
                      href={`/result?id=${item._id}`}
                      className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                    >
                      Open
                    </Link>

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