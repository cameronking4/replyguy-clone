import React from "react";

const TabButtons = ({ activeTab, setActiveTab }) => {
  const buttonClass = (tab) =>
    `px-4 py-2 text-sm font-semibold transition duration-300 ${
      activeTab === tab
        ? "text-secondary bg-primary"
        : "text-gray-300 bg-transparent"
    }`;

  return (
    <div className="flex justify-center pt-4">
      <button
        onClick={() => setActiveTab("makers")}
        className={buttonClass("makers")}
        style={{ animationDelay: "0.321s", animationFillMode: "forwards" }}
      >
        🎉 Made for Creators, Startups, E-Commerce
      </button>
      {/* Uncomment if you want the Developers tab */}
      {/* <button
        onClick={() => setActiveTab("developers")}
        className={buttonClass("developers")}
        style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
      >
        For Developers
      </button> */}
    </div>
  );
};

export default TabButtons;
