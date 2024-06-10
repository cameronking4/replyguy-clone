"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ResultsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => router.back()}
        className="mb-4 py-2 px-4 bg-gray-300 text-black font-semibold rounded-md hover:bg-gray-400"
      >
        Back
      </button>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-8">
        {results.length > 0 &&
          results.map((result, index) => (
            <div className="result mb-6" key={index}>
              <h3 className="text-lg font-semibold">
                <a
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {result.title}
                </a>
              </h3>
              <p className="text-gray-700">{result.snippet}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ResultsPage;
