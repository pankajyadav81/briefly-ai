"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "../../components/Sidebar";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export default function QuizPage() {
  const searchParams = useSearchParams();

  const summary = searchParams.get("summary") || "";

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState<string[]>([]);

  const [submitted, setSubmitted] = useState(false);

  const [score, setScore] = useState(0);

  useEffect(() => {
    generateQuiz();
  }, []);

  async function generateQuiz() {
    try {
      setLoading(true);

      const response = await fetch("/api/quiz", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          summary,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setQuiz(data.quiz);

        setAnswers(
          new Array(data.quiz.length).fill("")
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function chooseAnswer(option: string) {
    const temp = [...answers];

    temp[currentQuestion] = option;

    setAnswers(temp);
  }

  function nextQuestion() {
    if (
      currentQuestion <
      quiz.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );
    }
  }

  function previousQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        currentQuestion - 1
      );
    }
  }

  function submitQuiz() {
    let marks = 0;

    quiz.forEach((q, index) => {
      if (answers[index] === q.answer) {
        marks++;
      }
    });

    setScore(marks);

    setSubmitted(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        <Sidebar />

        <main className="flex-1 flex items-center justify-center">

          <div className="text-center">

            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>

            <h2 className="text-3xl font-bold">
              Generating Quiz...
            </h2>

            <p className="text-zinc-400 mt-3">
              AI is preparing questions.
            </p>

          </div>

        </main>
      </div>
    );
  }
    if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        <Sidebar />

        <main className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl p-10">

            <h1 className="text-5xl font-bold text-center mb-6">
              🎉 Quiz Completed
            </h1>

            <div className="text-center mb-10">

              <p className="text-zinc-400 text-xl">
                Your Score
              </p>

              <h2 className="text-7xl font-bold text-blue-500 mt-4">
                {score} / {quiz.length}
              </h2>

            </div>

            <div className="space-y-6">

              {quiz.map((q, index) => (
                <div
                  key={index}
                  className="bg-zinc-800 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-semibold mb-4">
                    Q{index + 1}. {q.question}
                  </h3>

                  <p className="mb-2">
                    <span className="text-zinc-400">
                      Your Answer:
                    </span>{" "}
                    <span
                      className={
                        answers[index] === q.answer
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {answers[index] || "Not Answered"}
                    </span>
                  </p>

                  <p className="text-green-400">
                    Correct Answer: {q.answer}
                  </p>
                </div>
              ))}

            </div>

          </div>
        </main>
      </div>
    );
  }

  const question = quiz[currentQuestion];

  return (
    <div className="min-h-screen bg-black text-white flex">

      <Sidebar />

      <main className="flex-1 p-10">

        <div className="max-w-5xl mx-auto">

          <div className="flex justify-between items-center mb-8">

            <h1 className="text-5xl font-bold">
              AI Quiz
            </h1>

            <div className="text-zinc-400 text-lg">
              Question {currentQuestion + 1} / {quiz.length}
            </div>

          </div>

          <div className="w-full bg-zinc-800 h-3 rounded-full mb-10">

            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${
                  ((currentQuestion + 1) /
                    quiz.length) *
                  100
                }%`,
              }}
            />

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">

            <h2 className="text-3xl font-bold mb-8">
              {question.question}
            </h2>

            <div className="space-y-5">

              {question.options.map((option, index) => (

                <label
                  key={index}
                  className={`flex items-center gap-4 p-5 rounded-2xl cursor-pointer border transition

                  ${
                    answers[currentQuestion] === option
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-zinc-700 hover:border-blue-500"
                  }`}
                >

                  <input
                    type="radio"
                    name="answer"
                    checked={
                      answers[currentQuestion] === option
                    }
                    onChange={() =>
                      chooseAnswer(option)
                    }
                  />

                  <span className="text-lg">
                    {option}
                  </span>

                </label>

              ))}

            </div>

            <div className="flex justify-between mt-10"></div>
                          <button
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
                className="px-8 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ← Previous
              </button>

              {currentQuestion === quiz.length - 1 ? (
                <button
                  onClick={submitQuiz}
                  className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 transition"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
                >
                  Next →
                </button>
              )}
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}