"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import jsPDF from "jspdf";
import Sidebar from "@/components/Sidebar";

interface Brief {
  _id: string;
  title: string;
  summary: string;
  createdAt: string;
}

export default function ResultPage() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const [brief, setBrief] = useState<Brief | null>(null);

  const [summary, setSummary] = useState("");

  const [question, setQuestion] = useState("");

  const [answer, setAnswer] = useState("");

  const [saving, setSaving] = useState(false);

  const [asking, setAsking] = useState(false);

  const [regenerating, setRegenerating] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadBrief();

  }, [id]);

  async function loadBrief() {

    try {

      setLoading(true);

      if (id) {

        const res = await fetch(`/api/brief/${id}`);

        const data = await res.json();

        if (data.success) {

          setBrief(data.brief);

          setSummary(data.brief.summary);

          return;

        }

      }

      const local = localStorage.getItem("briefResult");

      if (local) {

        setSummary(local);

      }

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  }

  const wordCount = useMemo(() => {

    return summary
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

  }, [summary]);

  const readingTime = Math.max(

    1,

    Math.ceil(wordCount / 200)

  );

  async function copySummary() {

    if (!summary) return;

    await navigator.clipboard.writeText(summary);

    alert("Summary copied.");

  }

  async function saveBrief() {

    if (!summary) return;

    try {

      setSaving(true);

      const res = await fetch("/api/saved", {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          title:

            brief?.title ||

            "AI Generated Brief",

          summary,

        }),

      });

      const data = await res.json();

      if (data.success) {

        alert("Saved successfully.");

      } else {

        alert(data.message);

      }

    } catch (err) {

      console.error(err);

      alert("Failed to save.");

    } finally {

      setSaving(false);

    }

  }

  function exportPDF() {

    const pdf = new jsPDF();

    pdf.setFontSize(22);

    pdf.text("Briefly AI", 20, 20);

    pdf.setFontSize(12);

    const lines = pdf.splitTextToSize(summary, 170);

    pdf.text(lines, 20, 40);

    pdf.save("Briefly-Summary.pdf");

  }

  async function shareSummary() {

    if (!navigator.share) {

      alert("Share not supported.");

      return;

    }

    await navigator.share({

      title: "Briefly AI",

      text: summary,

    });

  }

  async function regenerateSummary() {

    const prompt = localStorage.getItem("lastPrompt");

    if (!prompt) {

      alert("Prompt not found.");

      return;

    }

    try {

      setRegenerating(true);

      const res = await fetch("/api/generate", {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          prompt,

        }),

      });

      const data = await res.json();

      if (data.success) {

        setSummary(data.summary);

        localStorage.setItem(

          "briefResult",

          data.summary

        );

      }

    } catch (err) {

      console.error(err);

    } finally {

      setRegenerating(false);

    }

  }
    async function askAI() {

    if (!question.trim()) {

      alert("Enter a question.");

      return;

    }

    try {

      setAsking(true);

      const res = await fetch("/api/chat", {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          summary,

          question,

        }),

      });

      const data = await res.json();

      if (data.success) {

        setAnswer(data.answer);

      } else {

        alert(data.message);

      }

    } catch (err) {

      console.error(err);

      alert("Failed to get AI response.");

    } finally {

      setAsking(false);

    }

  }

  return (

    <div className="min-h-screen bg-black text-white flex">

      <Sidebar />

      <main className="flex-1 p-10">

        <div className="flex justify-between items-center mb-10">

          <div>

            <h1 className="text-5xl font-bold">

              AI Brief Result

            </h1>

            <p className="text-zinc-400 mt-3">

              Your generated AI summary is ready.

            </p>

          </div>

          <Link

            href="/dashboard"

            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700"

          >

            Dashboard

          </Link>

        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mb-8">

          <button

            onClick={copySummary}

            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-blue-500"

          >

            📋 Copy

          </button>
          {/*
<button
  onClick={saveBrief}
  disabled={saving}
  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-yellow-500"
>
  {saving ? "Saving..." : "⭐ Save"}
</button>
*/}

          <button

            onClick={exportPDF}

            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-green-500"

          >

            📄 Export PDF

          </button>

          <button

            onClick={regenerateSummary}

            disabled={regenerating}

            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-purple-500"

          >

            {regenerating

              ? "Regenerating..."

              : "🔄 Regenerate"}

          </button>

          <button

            onClick={shareSummary}

            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-cyan-500"

          >

            📤 Share

          </button>

        </div>

        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8 mb-8">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-3xl font-bold">

              Executive Summary

            </h2>

            <span className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-xl">

              AI Generated

            </span>

          </div>

          {loading ? (

            <p>Loading...</p>

          ) : (

            <div className="whitespace-pre-wrap leading-8 text-zinc-300 text-lg">

              {summary || "No summary available."}

            </div>

          )}

        </div>

        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8 mb-8">

          <h2 className="text-3xl font-bold mb-3">

            💬 Chat With This Brief

          </h2>

          <p className="text-zinc-400 mb-6">

            Ask anything related to this summary.

          </p>

          <textarea

            value={question}

            onChange={(e) =>

              setQuestion(e.target.value)

            }

            placeholder="Ask AI..."

            className="w-full h-36 bg-zinc-800 rounded-2xl p-5 resize-none outline-none mb-6"

          />

          <button

            onClick={askAI}

            disabled={asking}

            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600"

          >

            {asking

              ? "Thinking..."

              : "🚀 Ask AI"}

          </button>

          {answer && (

            <div className="mt-8 bg-zinc-800 rounded-2xl p-6">

              <h3 className="text-2xl font-bold mb-4">

                AI Response

              </h3>

              <div className="whitespace-pre-wrap leading-8">

                {answer}

              </div>

            </div>

          )}

        </div>
                {/* Quick AI Prompts */}

        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6">

            ⚡ Quick AI Prompts

          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <button
              onClick={() =>
                setQuestion("Explain this summary in simple language.")
              }
              className="bg-zinc-800 rounded-xl p-4 text-left hover:bg-zinc-700 transition"
            >
              📖 Explain Simply
            </button>

            <button
              onClick={() =>
                setQuestion("Generate important viva questions.")
              }
              className="bg-zinc-800 rounded-xl p-4 text-left hover:bg-zinc-700 transition"
            >
              🎤 Generate Viva Questions
            </button>

            <button
              onClick={() =>
                setQuestion("Generate multiple choice questions.")
              }
              className="bg-zinc-800 rounded-xl p-4 text-left hover:bg-zinc-700 transition"
            >
              📝 Generate MCQs
            </button>

            <button
              onClick={() =>
                setQuestion("Create revision notes from this summary.")
              }
              className="bg-zinc-800 rounded-xl p-4 text-left hover:bg-zinc-700 transition"
            >
              📚 Create Revision Notes
            </button>

          </div>

        </div>

        {/* AI Insights */}

        <div className="grid lg:grid-cols-3 gap-6 mb-8">

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

            <div className="text-5xl mb-4">

              🧠

            </div>

            <h3 className="text-2xl font-bold mb-3">

              AI Confidence

            </h3>

            <p className="text-5xl text-green-400 font-bold mb-3">

              98%

            </p>

            <p className="text-zinc-400">

              Generated using Gemini AI with high confidence.

            </p>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

            <div className="text-5xl mb-4">

              📖

            </div>

            <h3 className="text-2xl font-bold mb-3">

              Word Count

            </h3>

            <p className="text-5xl text-blue-400 font-bold mb-3">

              {wordCount}

            </p>

            <p className="text-zinc-400">

              Words detected in this summary.

            </p>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

            <div className="text-5xl mb-4">

              ⏱

            </div>

            <h3 className="text-2xl font-bold mb-3">

              Reading Time

            </h3>

            <p className="text-5xl text-yellow-400 font-bold mb-3">

              {readingTime} min

            </p>

            <p className="text-zinc-400">

              Estimated reading duration.

            </p>

          </div>

        </div>

        {/* Footer */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">

            <div>

              <h2 className="text-3xl font-bold mb-2">

                🚀 Powered by Briefly AI

              </h2>

              <p className="text-zinc-400">

                AI powered study assistant for students, researchers and professionals.

              </p>

            </div>

            <div className="flex gap-4">

              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700"
              >
                Dashboard
              </Link>

              <Link
                href="/upload"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600"
              >
                ✨ New Brief
              </Link>

            </div>

          </div>

        </div>

      </main>

    </div>

  );

}