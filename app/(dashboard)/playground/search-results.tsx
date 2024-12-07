export const dynamic = "force-dynamic";

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

const SearchResults = ({
  searchParams,
  results,
}: {
  searchParams: { [key: string]: string };
  results: SearchResult[];
}) => {
  return (
    <div className="min-w-full overflow-y-auto">
      {results.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold">Search Results:</h2>
          <ul className="mt-2 space-y-2">
            {results.map((result, index) => (
              <li key={index} className="border p-2">
                <a
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {result.title}
                </a>
                <p>{result.snippet}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-neutral-500">
          Try searching for something using using different keywords on the
          left.
        </div>
      )}
    </div>
  );
};

export default SearchResults;
