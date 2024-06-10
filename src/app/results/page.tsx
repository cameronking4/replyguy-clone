"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ResultsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedResults, setSelectedResults] = useState([]);
  const [processingResults, setProcessingResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const query = searchParams.toString();

      try {
        const res = await fetch(`/api/search?${query}`);
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await res.json();
        setResults(data);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const handleCheckboxChange = (result) => {
    setSelectedResults((prevSelectedResults) =>
      prevSelectedResults.includes(result)
        ? prevSelectedResults.filter((item) => item !== result)
        : [...prevSelectedResults, result],
    );
  };

  const handlePostProcessing = async () => {
    setProcessingResults(
      selectedResults.map((result) => ({ ...result, status: "processing" })),
    );

    const promises = selectedResults.map(async (result, index) => {
      try {
        const response = await fetch("/api/openai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: result.snippet }),
        });

        if (!response.ok) {
          throw new Error("Failed to process result");
        }

        const data = await response.json();
        return { ...result, processed: data.result, status: "success" };
      } catch (err) {
        console.error("Error processing result:", err);
        return {
          ...result,
          processed: "Error processing result",
          status: "error",
        };
      }
    });

    const resultsWithStatus = await Promise.all(promises);
    setProcessingResults(resultsWithStatus);
  };

  const renderSnippetWithHighlights = (snippet, highlightedWords) => {
    if (!highlightedWords || highlightedWords.length === 0) {
      return snippet;
    }

    const parts = snippet.split(
      new RegExp(`(${highlightedWords.join("|")})`, "gi"),
    );
    return parts.map((part, index) =>
      highlightedWords.includes(part.toLowerCase()) ? (
        <span
          key={index}
          className="inline-block bg-yellow-200 text-yellow-800 font-semibold rounded px-1 mx-0.5"
        >
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => router.back()}
        className="mb-4 py-2 px-4 bg-gray-300 text-black font-semibold rounded-md hover:bg-gray-400"
      >
        Back
      </button>
      {selectedResults.length > 0 && (
        <button
          onClick={handlePostProcessing}
          className="ml-4 mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Process Selected Results
        </button>
      )}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-8">
        {results.length > 0 &&
          results.map((result, index) => (
            <div className="result mb-6" key={index}>
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedResults.includes(result)}
                onChange={() => handleCheckboxChange(result)}
              />
              <h3 className="text-lg font-semibold inline-block">
                <a
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {result.title}
                </a>
              </h3>
              <p className="text-gray-700">
                {renderSnippetWithHighlights(
                  result.snippet,
                  result.snippet_highlighted_words,
                )}
              </p>
            </div>
          ))}
      </div>
      {processingResults.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Processed Results</h2>
          {processingResults.map((result, index) => (
            <div className="result mb-6" key={index}>
              <h3 className="text-lg font-semibold">{result.title}</h3>
              <p className="text-gray-700">
                {result.status === "processing"
                  ? "Processing..."
                  : result.processed}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
