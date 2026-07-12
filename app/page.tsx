import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold text-blue-500">
          Briefly
        </h1>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-5 py-2 rounded-lg border border-gray-700 hover:bg-gray-900 transition"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-28">
        <h1 className="text-6xl font-bold mb-6">
          AI Powered
          <span className="text-blue-500"> Briefing</span>
        </h1>

        <p className="max-w-3xl text-lg text-gray-400 mb-10">
          Upload PDFs, Images, Books, Documents or enter any topic.
          Briefly transforms complex information into concise,
          structured and actionable summaries in seconds.
        </p>

        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-blue-600 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </Link>

          <Link
            href="/upload"
            className="px-8 py-4 border border-gray-700 rounded-xl hover:bg-gray-900 transition"
          >
            Upload Now
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6 px-8 pb-20">

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <h3 className="text-xl font-semibold mb-3">
            PDF Briefing
          </h3>

          <p className="text-gray-400">
            Upload PDFs and get concise summaries instantly.
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <h3 className="text-xl font-semibold mb-3">
            Image Analysis
          </h3>

          <p className="text-gray-400">
            Extract and summarize information from images.
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <h3 className="text-xl font-semibold mb-3">
            Topic Research
          </h3>

          <p className="text-gray-400">
            Enter any topic and receive structured AI briefings.
          </p>
        </div>

      </section>

      {/* Quick Navigation */}
      <section className="px-8 pb-20">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Explore Briefly
        </h2>

        <div className="grid md:grid-cols-4 gap-4">

          <Link
            href="/dashboard"
            className="bg-zinc-900 p-6 rounded-xl text-center border border-zinc-800 hover:border-blue-500 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/upload"
            className="bg-zinc-900 p-6 rounded-xl text-center border border-zinc-800 hover:border-blue-500 transition"
          >
            Upload
          </Link>

          <Link
            href="/history"
            className="bg-zinc-900 p-6 rounded-xl text-center border border-zinc-800 hover:border-blue-500 transition"
          >
            History
          </Link>

          <Link
            href="/settings"
            className="bg-zinc-900 p-6 rounded-xl text-center border border-zinc-800 hover:border-blue-500 transition"
          >
            Settings
          </Link>

        </div>
      </section>
    </main>
  );
}