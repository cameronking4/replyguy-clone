"use client";
import { useState } from "react";

const SearchPage = () => {
  const [keywords, setKeywords] = useState("");
  const [platform, setPlatform] = useState("twitter.com");
  const [num, setNum] = useState(10);
  const [location, setLocation] = useState("");
  const [device, setDevice] = useState("desktop");
  const [language, setLanguage] = useState("en");
  const [country, setCountry] = useState("us");
  const [safe, setSafe] = useState("off");
  const [timeRange, setTimeRange] = useState("");
  const [sort, setSort] = useState("");
  const [negativeKeywords, setNegativeKeywords] = useState("");
  const [field, setField] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let searchQuery = keywords;
    if (field) {
      searchQuery = `${field}:(${keywords})`;
    }
    if (negativeKeywords) {
      searchQuery += ` -${negativeKeywords.split(" ").join(" -")}`;
    }

    const query = new URLSearchParams({
      q: searchQuery,
      platform,
      num: num.toString(),
      location,
      device,
      hl: language,
      gl: country,
      safe,
      tbs: timeRange,
      sort,
    }).toString();

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search for Posts</h1>
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label
            htmlFor="keywords"
            className="block text-sm font-medium text-gray-700"
          >
            Keywords:
          </label>
          <input
            type="text"
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="platform"
            className="block text-sm font-medium text-gray-700"
          >
            Platform:
          </label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="twitter.com">Twitter</option>
            <option value="reddit.com">Reddit</option>
            <option value="linkedin.com">LinkedIn</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="num"
            className="block text-sm font-medium text-gray-700"
          >
            Number of Results:
          </label>
          <input
            type="number"
            id="num"
            value={num}
            onChange={(e) => setNum(parseInt(e.target.value))}
            min="1"
            max="100"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location (optional):
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="device"
            className="block text-sm font-medium text-gray-700"
          >
            Device:
          </label>
          <select
            id="device"
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="desktop">Desktop</option>
            <option value="mobile">Mobile</option>
            <option value="tablet">Tablet</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="hl"
            className="block text-sm font-medium text-gray-700"
          >
            Language:
          </label>
          <input
            type="text"
            id="hl"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="gl"
            className="block text-sm font-medium text-gray-700"
          >
            Country:
          </label>
          <input
            type="text"
            id="gl"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="safe"
            className="block text-sm font-medium text-gray-700"
          >
            Safe Search:
          </label>
          <select
            id="safe"
            value={safe}
            onChange={(e) => setSafe(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="off">Off</option>
            <option value="active">Active</option>
            <option value="medium">Medium</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="tbs"
            className="block text-sm font-medium text-gray-700"
          >
            Time Range:
          </label>
          <select
            id="tbs"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Any Time</option>
            <option value="qdr:h">Past Hour</option>
            <option value="qdr:d">Past Day</option>
            <option value="qdr:w">Past Week</option>
            <option value="qdr:m">Past Month</option>
            <option value="qdr:y">Past Year</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="sort"
            className="block text-sm font-medium text-gray-700"
          >
            Sort By:
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Relevance</option>
            <option value="date">Date</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="negativeKeywords"
            className="block text-sm font-medium text-gray-700"
          >
            Negative Keywords:
          </label>
          <input
            type="text"
            id="negativeKeywords"
            value={negativeKeywords}
            onChange={(e) => setNegativeKeywords(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="field"
            className="block text-sm font-medium text-gray-700"
          >
            Search Field (optional):
          </label>
          <select
            id="field"
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Any</option>
            <option value="intitle">Title</option>
            <option value="inurl">URL</option>
            <option value="inanchor">Anchor Text</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-4 w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
        >
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-8">
        {results.length > 0 &&
          results.map(
            (
              result: { title: string; link: string; snippet: string },
              index: number,
            ) => (
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
            ),
          )}
      </div>
    </div>
  );
};

export default SearchPage;
