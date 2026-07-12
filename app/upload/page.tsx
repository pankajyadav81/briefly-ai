"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";

export default function UploadPage() {

  const router = useRouter();

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {

    if (!pdfFile && !imageFile && topic.trim() === "") {
      alert("Please upload a PDF, Image or enter a topic.");
      return;
    }

    setLoading(true);

    try {

      // ===========================
      // PDF Upload
      // ===========================

      if (pdfFile) {

        const formData = new FormData();

        formData.append("file", pdfFile);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.success) {

          localStorage.setItem(
            "briefResult",
            data.summary
          );

          router.push("/result");
          return;

        }

        alert(data.message || "PDF Upload Failed");

        return;

      }

      // ===========================
      // Image Upload
      // ===========================

      if (imageFile) {

        const formData = new FormData();

        formData.append("image", imageFile);

        const response = await fetch("/api/image", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.success) {

          localStorage.setItem(
            "briefResult",
            data.summary
          );

          router.push("/result");

          return;

        }

        alert(data.message || "Image Analysis Failed");

        return;

      }

      // ===========================
      // Topic Summary
      // ===========================

      if (topic.trim() !== "") {

        const response = await fetch("/api/generate", {

          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            prompt: topic,
          }),

        });

        const data = await response.json();

        if (data.success) {

          localStorage.setItem(
            "briefResult",
            data.summary
          );

          router.push("/result");

          return;

        }

        alert(data.message);

      }

    } catch (err) {

      console.error(err);

      alert("Something went wrong.");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-black text-white flex">

      <Sidebar />

      <main className="flex-1 p-8">

        <div className="mb-10">

          <h1 className="text-5xl font-bold mb-3">
            Create New Brief
          </h1>

          <p className="text-zinc-400 text-lg">
            Upload PDF, Image or enter any topic.
          </p>

        </div>
                <div className="grid md:grid-cols-2 gap-6 mb-8">

          {/* PDF Upload */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-blue-500 transition">

            <div className="text-5xl mb-4">
              📄
            </div>

            <h2 className="text-2xl font-semibold mb-3">
              Upload PDF
            </h2>

            <p className="text-zinc-400 mb-6">
              Upload books, notes or research papers.
            </p>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setPdfFile(e.target.files[0]);
                  setImageFile(null);
                }
              }}
              className="w-full p-4 bg-zinc-800 rounded-xl"
            />

            {pdfFile && (

              <div className="mt-4 bg-zinc-800 rounded-xl p-3">

                <p className="text-green-400 font-medium">
                  ✅ {pdfFile.name}
                </p>

                <p className="text-zinc-500 text-sm mt-1">
                  {(pdfFile.size / 1024).toFixed(2)} KB
                </p>

              </div>

            )}

          </div>

          {/* Image Upload */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-purple-500 transition">

            <div className="text-5xl mb-4">
              🖼️
            </div>

            <h2 className="text-2xl font-semibold mb-3">
              Upload Image
            </h2>

            <p className="text-zinc-400 mb-6">
              Upload notes, screenshots, diagrams or charts.
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setImageFile(e.target.files[0]);
                  setPdfFile(null);
                }
              }}
              className="w-full p-4 bg-zinc-800 rounded-xl"
            />

            {imageFile && (

              <div className="mt-4">

                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="rounded-xl h-40 w-full object-cover border border-zinc-700"
                />

                <p className="text-green-400 mt-3">
                  ✅ {imageFile.name}
                </p>

              </div>

            )}

          </div>

        </div>
                {/* Topic */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8">

          <h2 className="text-2xl font-semibold mb-4">
            📝 Enter Topic
          </h2>

          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Example: Explain Artificial Intelligence, Operating Systems, Blockchain..."
            className="w-full h-52 bg-zinc-800 rounded-2xl p-5 outline-none resize-none text-lg"
          />

          <p className="text-zinc-500 mt-4">
            You can type any question, paste notes, or ask Briefly AI to explain any concept.
          </p>

        </div>

        {/* Generate Button */}

        <div className="flex justify-center">

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                ⏳ Generating AI Brief...
              </>
            ) : (
              <>
                ✨ Generate AI Brief
              </>
            )}
          </button>

        </div>

        {/* Tips */}

        <div className="mt-12 grid md:grid-cols-3 gap-6">

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <div className="text-4xl mb-4">
              ⚡
            </div>

            <h3 className="text-xl font-semibold mb-2">
              Fast AI
            </h3>

            <p className="text-zinc-400">
              Generate summaries within seconds using Gemini AI.
            </p>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <div className="text-4xl mb-4">
              📚
            </div>

            <h3 className="text-xl font-semibold mb-2">
              Study Smart
            </h3>

            <p className="text-zinc-400">
              Summarize PDFs, notes, books and research papers instantly.
            </p>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <div className="text-4xl mb-4">
              🤖
            </div>

            <h3 className="text-xl font-semibold mb-2">
              AI Powered
            </h3>

            <p className="text-zinc-400">
              Powered by Gemini AI for accurate and professional summaries.
            </p>

          </div>

        </div>
              </main>

    </div>

  );

}