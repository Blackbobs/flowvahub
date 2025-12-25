"use client";
import React, { useState } from "react";
import EarnPoints from "../earn-points";
import RedeemRewards from "../redeem-rewards";

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"earn" | "redeem">("earn");
  return (
    <div className="flex flex-col gap-4">
      {" "}
      <div className="flex gap-2 py-3 w-4/5">
        <button
          onClick={() => setActiveTab("earn")}
          className={`${
            activeTab === "earn"
              ? "bg-purple-50 text-purple-700 border-b-2 border-purple-700"
              : "bg-none text-gray-700"
          } px-5 py-3 rounded-t-md text-nowrap font-medium leading-5`}
        >
          Earn Points
        </button>
        <button
          onClick={() => setActiveTab("redeem")}
          className={`${
            activeTab === "redeem"
              ? "bg-purple-50 text-purple-700 border-b-2 border-purple-700"
              : "bg-none text-gray-700"
          } px-5 py-3 rounded-t-md text-nowrap font-medium leading-5`}
        >
          Redeem Rewards
        </button>
      </div>
      {activeTab === "earn" ? <EarnPoints /> : <RedeemRewards />}
    </div>
  );
};

export default Tabs;
