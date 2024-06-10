// page.tsx
import { Suspense } from "react";
import ResultsPageComponent from "../../components/ResultsPageComponent";

const ResultsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsPageComponent />
    </Suspense>
  );
};

export default ResultsPage;
