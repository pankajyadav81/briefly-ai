"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/result");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="text-center">

        <div className="w-20 h-20 border-4 border-zinc-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-8"></div>

        <h1 className="text-4xl font-bold mb-4">
          Generating AI Brief...
        </h1>

        <p className="text-zinc-400">
          Analyzing content and creating summary...
        </p>

      </div>

    </div>
  );
}