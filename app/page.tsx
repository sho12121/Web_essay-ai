"use client";

import { useState } from "react";

export default function Home() {
  const [essay, setEssay] = useState("");
  const [result, setResult] = useState<{
    original: string;
    corrected: string;
    corrections: {
      original: string;
      corrected: string;
      explanation: string;
      type: string;
    }[];
    explanation: string;
    naturalExpression: string;
  } | null>(null);

  const handleCorrect = async () => {
    const response = await fetch("/api/correct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ essay }),
    });
    const data = await response.json();

    setResult(JSON.parse(data.result));
  };

  return (
    <main>
      <h1>English Essay AI</h1>
      <p>Write your English essay and get AI-powered corrections.</p>

      <textarea
        value={essay}
        onChange={(e) => setEssay(e.target.value)}
      />
      <button onClick={handleCorrect}>Correct My Essay</button>
      {result && (
  <section>
    <h2>Original</h2>
    <p>{result.original}</p>

    <h2>Corrected</h2>
    <p>{result.corrected}</p>

    <h2>Correction Points</h2>

    {result.corrections.map((correction, index) => (
      <div key={index}>
        <p>
          <strong>{correction.original}</strong>
          {" → "}
          <strong>{correction.corrected}</strong>
        </p>

        <p>{correction.explanation}</p>
        <p>Type: {correction.type}</p>
      </div>
    ))}

        <h2>Explanation</h2>
        <p>{result.explanation}</p>

        <h2>More Natural Expression</h2>
        <p>{result.naturalExpression}</p>
      </section>
    )}
    </main>
  );
}