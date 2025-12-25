"use client";
import React, { useState } from "react";

type RewardStatus = "unlocked" | "locked" | "coming_soon";
type FilterTab = "all" | "unlocked" | "locked" | "coming_soon";

interface Reward {
  id: number;
  title: string;
  description: string;
  points: number;
  status: RewardStatus;
  iconType: "money" | "gift" | "books";
}

const rewards: Reward[] = [
  {
    id: 1,
    title: "$5 Bank Transfer",
    description: "The $5 equivalent will be transferred to your bank account.",
    points: 5000,
    status: "locked",
    iconType: "money",
  },
  {
    id: 2,
    title: "$5 PayPal International",
    description:
      "Receive a $5 PayPal balance transfer directly to your PayPal account email.",
    points: 5000,
    status: "locked",
    iconType: "money",
  },
  {
    id: 3,
    title: "$5 Virtual Visa Card",
    description:
      "Use your $5 prepaid card to shop anywhere Visa is accepted online.",
    points: 5000,
    status: "locked",
    iconType: "gift",
  },
  {
    id: 4,
    title: "$5 Apple Gift Card",
    description:
      "Redeem this $5 Apple Gift Card for apps, games, music, movies, and more on the App Store and iTunes.",
    points: 5000,
    status: "locked",
    iconType: "gift",
  },
  {
    id: 5,
    title: "$5 Google Play Card",
    description:
      "Use this $5 Google Play Gift Card to purchase apps, games, movies, books, and more on the Google Play Store.",
    points: 5000,
    status: "locked",
    iconType: "gift",
  },
  {
    id: 6,
    title: "$5 Amazon Gift Card",
    description:
      "Get a $5 digital gift card to spend on your favorite tools or platforms.",
    points: 5000,
    status: "locked",
    iconType: "gift",
  },
  {
    id: 7,
    title: "$10 Amazon Gift Card",
    description:
      "Get a $10 digital gift card to spend on your favorite tools or platforms.",
    points: 10000,
    status: "locked",
    iconType: "gift",
  },
  {
    id: 8,
    title: "Free Udemy Course",
    description: "Coming Soon!",
    points: 0,
    status: "coming_soon",
    iconType: "books",
  },
];

const MoneyIcon = () => (
  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-[#9013fe] bg-[#E9D4FF]">
    💸
  </div>
);

const GiftIcon = () => (
  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-[#9013fe] bg-[#E9D4FF]">
    🎁
  </div>
);

const BooksIcon = () => (
  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-[#9013fe] bg-[#E9D4FF]">
    📚
  </div>
);

const RewardCard: React.FC<{ reward: Reward }> = ({ reward }) => {
  const getIcon = () => {
    switch (reward.iconType) {
      case "money":
        return <MoneyIcon />;
      case "gift":
        return <GiftIcon />;
      case "books":
        return <BooksIcon />;
      default:
        return <GiftIcon />;
    }
  };

  const getButtonStyle = () => {
    switch (reward.status) {
      case "unlocked":
        return "bg-purple-600 text-white hover:bg-purple-700";
      case "locked":
      case "coming_soon":
      default:
        return "bg-blue-50 text-gray-400 cursor-not-allowed";
    }
  };

  const getButtonText = () => {
    switch (reward.status) {
      case "unlocked":
        return "Redeem";
      case "locked":
        return "Locked";
      case "coming_soon":
        return "Coming Soon";
      default:
        return "Locked";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-purple-200 p-5 flex flex-col items-center text-center">
      <div className="mb-3">{getIcon()}</div>
      <h3 className="font-semibold text-gray-600 leading-5 text-base mb-2">
        {reward.title}
      </h3>
      <p className="text-gray-500 text-sm mb-3 leading-relaxed">
        {reward.description}
      </p>
      <div className="flex items-center justify-center text-purple-500 font-semibold leading-5 mb-4">
        ⭐ {reward.points} pts
      </div>
      <button
        className={`w-full py-3 rounded-lg font-medium transition-colors ${getButtonStyle()}`}
        disabled={reward.status !== "unlocked"}
      >
        {getButtonText()}
      </button>
    </div>
  );
};

const RedeemRewards: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const filterCounts = {
    all: rewards.length,
    unlocked: rewards.filter((r) => r.status === "unlocked").length,
    locked: rewards.filter((r) => r.status === "locked").length,
    coming_soon: rewards.filter((r) => r.status === "coming_soon").length,
  };

  const filteredRewards = rewards.filter((reward) => {
    if (activeFilter === "all") return true;
    return reward.status === activeFilter;
  });

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All Rewards" },
    { key: "unlocked", label: "Unlocked" },
    { key: "locked", label: "Locked" },
    { key: "coming_soon", label: "Coming Soon" },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold border-l-4 border-purple-700 pl-2 mb-5">
        Redeem Your Points
      </h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 hide-scrollbar">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`${
              activeFilter === tab.key
                ? "bg-purple-50 font-medium text-purple-700 border-b-2 border-purple-700"
                : "bg-none text-gray-700"
            } px-4 md:px-8 py-3 rounded-t-md flex items-center gap-2 whitespace-nowrap`}
          >
            {tab.label}
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeFilter === tab.key
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {filterCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {filteredRewards.map((reward) => (
          <RewardCard key={reward.id} reward={reward} />
        ))}
      </div>

      {/* Empty State */}
      {filteredRewards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No rewards found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default RedeemRewards;
