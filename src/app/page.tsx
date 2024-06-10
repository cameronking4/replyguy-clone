// pages/index.tsx
"use client";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/form");
  };

  return (
    <div className="container min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">ReplyGuy Clone</h1>
      <button
        onClick={handleGetStarted}
        className="mt-4 py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
      >
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;
