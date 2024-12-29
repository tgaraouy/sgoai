"use client";

import { useState } from "react";

export interface PronunciationCheckProps {
  text?: string;
}

export function PronunciationCheck({ text = "" }: PronunciationCheckProps) {
  const [input, setInput] = useState(text);
  const [feedback, setFeedback] = useState("");
  const [checking, setChecking] = useState(false);

  const checkPronunciation = async () => {
    setChecking(true);

    try {
      const res = await fetch("/api/ai/pronunciation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();
      setFeedback(data.pronunciation);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="Enter text to check pronunciation..."
        />
        <button
          onClick={checkPronunciation}
          disabled={checking || !input}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {checking ? "Checking..." : "Check Pronunciation"}
        </button>
      </div>
      {feedback && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}
