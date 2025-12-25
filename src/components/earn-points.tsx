"use client";

import { ClipboardCopyIcon, Share1Icon } from "@radix-ui/react-icons";
import AwardIcon from "@/icons/AwardIcon";
import CoinIcon from "@/icons/CoinIcon";
import CalendarIcon from "@/icons/CalendarIcon";
import LucideCalendarIcon from "@/icons/LucideCalendarIcon";
import ZapIcon from "@/icons/ZapIcon";
import GiftIcon from "@/icons/GiftIcon";
import UserPlusIcon from "@/icons/UserPlusIcon";
import StarIcon from "@/icons/StarIcon";
import UsersIcon from "@/icons/UsersIcon";
import SuccessCheckIcon from "@/icons/SuccessCheckIcon";
import FacebookIcon from "@/icons/FacebookIcon";
import XIcon from "@/icons/XIcon";
import LinkedInIcon from "@/icons/LinkedInIcon";
import WhatsappIcon from "@/icons/WhatsappIcon";
import Image from "next/image";
import React from "react";
import {
  useUserRewards,
  useClaimDailyStreak,
  useStreakDays,
  calculateProgress,
  getProgressMessage,
} from "@/hooks/useRewards";
import useClaim from "@/hooks/useClaim";
import ClaimModal from "@/components/ClaimModal";

const MOCK_USER_ID = "user-123";

const EarnPoints: React.FC = () => {
  const [showModal, setShowModal] = React.useState(false);
  const {
    emailRef,
    email,
    setEmail,
    file,
    loading,
    message,
    handleFileChange,
    handleSubmitClaim,
  } = useClaim();
  const [showLevelUp, setShowLevelUp] = React.useState(false);
  const [levelUpPoints, setLevelUpPoints] = React.useState<number | null>(null);

  // Fetch user rewards data
  const { data: rewardsData, isLoading, error } = useUserRewards(MOCK_USER_ID);
  const claimStreakMutation = useClaimDailyStreak();

  // Get current points and streak info
  const totalPoints = rewardsData?.points?.total_points ?? 0;
  const currentStreak = rewardsData?.streak?.current_streak ?? 0;
  const lastClaimDate = rewardsData?.streak?.last_claim_date ?? null;
  const displayedPoints = totalPoints;

  // Get streak days info
  const { days, currentDayIndex, claimedToday } = useStreakDays(lastClaimDate);

  // Progress calculation
  const targetPoints = 5000;
  const progressPercentage = calculateProgress(totalPoints, targetPoints);
  const progressMessage = getProgressMessage(totalPoints, targetPoints);

  // Handle claim daily streak
  const handleClaimStreak = async () => {
    if (claimedToday) return;

    try {
      const res = await claimStreakMutation.mutateAsync(MOCK_USER_ID);
      if (res?.success) {
        setLevelUpPoints(5);
        setShowLevelUp(true);
      }
    } catch (error) {
      console.error("Failed to claim streak:", error);
    }
  };

  React.useEffect(() => {
    if (showModal) {
      emailRef.current?.focus();
    }
  }, [showModal, emailRef]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showModal) setShowModal(false);
        if (showLevelUp) setShowLevelUp(false);
      }
    };
    if (showModal || showLevelUp) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showModal, showLevelUp]);

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load rewards data. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-black leading-6 border-l-4 border-purple-700 pl-2">
        Your Rewards Journey
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr md:p-4">
        <div className="rounded-xl shadow h-full">
          <div className="p-4 bg-blue-50 rounded-t-xl flex items-center gap-3">
            <AwardIcon className="h-5 w-5 text-[#9013fe]" aria-hidden />
            <h3 className="capitalize text-lg font-semibold leading-5 text-gray-700">
              points balance
            </h3>
          </div>
          <div className="p-8 flex items-center justify-between">
            <small className="text-purple-600 text-4xl font-bold">
              {isLoading ? "..." : displayedPoints}
            </small>
            <CoinIcon />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="capitalize text-sm font-medium text-gray-700">
                Progress to $5 Gift Card
              </h3>
              <small className="text-gray-700 text-sm">
                {displayedPoints}/{targetPoints}
              </small>
            </div>
            {/* Progress bar */}
            <div className="h-2 w-full bg-gray-200 rounded-full my-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div>
              <small className="text-gray-600 text-xs">{progressMessage}</small>
            </div>
          </div>
        </div>

        {/* Daily Streak Card */}
        <div className="rounded-xl shadow h-full">
          <div className="p-4 bg-blue-50 rounded-t-xl flex items-center gap-2">
            <CalendarIcon className="text-[#70D6FF] h-5 w-5" aria-hidden />
            <h3 className="capitalize text-lg leading-5 font-semibold text-gray-700">
              daily streak
            </h3>
          </div>
          <div className="p-6 flex items-center justify-between">
            <small className="text-purple-600 text-4xl font-bold">
              {isLoading
                ? "..."
                : `${currentStreak} day${currentStreak !== 1 ? "s" : ""}`}
            </small>
          </div>
          <div className="flex gap-2 p-4">
            {days.map((day, index) => (
              <div
                key={index}
                className={`flex size-10 items-center justify-center rounded-full text-sm font-medium transition-all ${
                  index === currentDayIndex
                    ? claimedToday
                      ? "bg-purple-600 text-white ring-2 ring-purple-600 ring-offset-2"
                      : "bg-gray-300 text-gray-700 ring-2 ring-purple-600 ring-offset-2"
                    : index < currentDayIndex
                    ? "bg-gray-200 text-gray-500"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {day.label}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-3 p-4">
            <small className="text-gray-500">
              Check in daily to earn +5 points
            </small>
            <button
              onClick={handleClaimStreak}
              disabled={claimedToday || claimStreakMutation.isPending}
              className={`rounded-full p-3 w-full font-semibold flex items-center justify-center gap-2 transition-all ${
                claimedToday
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              <ZapIcon className="h-5 w-5" aria-hidden />
              {claimStreakMutation.isPending
                ? "Claiming..."
                : claimedToday
                ? "Claimed Today"
                : "Claim +5 Points"}
            </button>
          </div>
        </div>

        {/* Featured Tool Card */}
        <div className="rounded-xl shadow h-full">
          <div className="p-4 bg-[linear-gradient(135deg,_#9013FE_0%,_#70D6FF_100%)] rounded-t-xl text-white relative overflow-hidden">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold relative z-[2] capitalize">
                Top Tool Spotlight
              </h3>
              <div className="overflow-hidden relative rounded-full size-10 md:size-16">
                <Image
                  src="https://api.flowvahub.com/storage/v1/object/public/icons//reclaim%20(1).png"
                  alt="Reclaim"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <p className="text-lg font-bold">Reclaim</p>
          </div>
          <div className="p-[1rem]">
            <div className="flex justify-start mb-[1rem]">
              <div className="w-[24px] h-[24px] animate-pulse bg-[#eef2ff] rounded-[6px] flex items-center justify-center mr-[1rem] flex-shrink-0 text-[#9013fe]">
                <LucideCalendarIcon />
              </div>
              <div className="flex-1">
                <h4 className="mb-[0.25rem] font-semibold">
                  Automate and Optimize Your Schedule
                </h4>
                <p className="text-[0.875rem] text-gray-600">
                  Reclaim.ai is an AI-powered calendar assistant that
                  automatically schedules your tasks, meetings, and breaks to
                  boost productivity. Free to try — earn Flowva Points when you
                  sign up!
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center w-full gap-5 p-2 border-b border-gray-300">
        
            <a
              href="https://reclaim.ai/?pscd=go.reclaim.ai&ps_partner_key=MTZlZThkOWRhMTI4&ps_xid=S4cecfz1mUJek1&gsxid=S4cecfz1mUJek1&gspk=MTZlZThkOWRhMTI4"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-4 py-2 text-white font-semibold bg-purple-700 flex items-center gap-2 inline-flex"
            >
              <UserPlusIcon className="h-4 w-4" aria-hidden />
              Sign up
            </a>
            <button
              onClick={() => setShowModal(true)}
              className="rounded-full px-4 py-2 text-white font-semibold bg-[linear-gradient(45deg,_#9013FE,_#FF8687)] flex items-center gap-2"
            >
              <GiftIcon className="h-4 w-4" aria-hidden />
              Claim 50 pts
            </button>
          </div>
        </div>
      </div>

      {/* Earn More Points Section */}
      <div className="my-5">
        <h1 className="text-lg font-semibold border-l-4 border-purple-700 pl-2">
          Earn More Points
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:p-4 md:max-w-3/5">
          <div className="rounded-xl shadow h-full bg-gray-50 border border-gray-300">
            <div className="p-4 bg-white rounded-t-xl flex items-center gap-3">
              <StarIcon className="w-10 h-10 text-purple-600 bg-purple-100 rounded-lg p-2" />
              <h3 className="capitalize text-base font-semibold text-gray-700">
                Refer and win 10,000 points!
              </h3>
            </div>

            <div className="p-4">
              <p className="text-gray-700 text-[15px] leading-5">
                Invite 3 friends by Nov 20 and earn a chance to be one of 5
                winners of{" "}
                <span className="text-purple-500">10,000 points.</span> Friend
                must complete onboarding to qualify
              </p>
            </div>
          </div>

          <div className="rounded-xl shadow h-full bg-gray-50 border border-gray-300">
            <div className="p-4 bg-white rounded-t-xl flex items-center gap-3">
              <Share1Icon className="w-10 h-10 text-purple-600 bg-purple-100 rounded-lg p-2" />
              <div className="flex flex-col leading-5">
                <h3 className="capitalize text-base font-semibold text-gray-700">
                  Share Your Stack
                </h3>
                <small className="text-gray-500">Earn +25 pts</small>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between">
              <p className="text-gray-700 text-[15px] leading-5">
                Share your tool stack
              </p>
              <button className="flex items-center gap-2 text-purple-600 font-semibold bg-blue-50 rounded-full py-2 px-5">
                <Share1Icon className="w-5 h-5 text-purple-600" /> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Refer & Earn Section */}
      <div className="my-5">
        <h1 className="text-lg font-semibold border-l-4 border-purple-700 pl-2">
          Refer & Earn
        </h1>
        <div>
          <div className="shadow-[0_5px_15px_rgba(0,_0,_0,_0.05)] rounded-[16px] hover:translate-y-[-5px] hover:shadow-[0_10px_25px_rgba(0,_0,_0,_0.1)] border border-[#f3f4f6] overflow-hidden transition-shadow duration-200 my-3">
            <div className="p-[1rem] relative border border-b-[#f3f4f6] bg-[#eef2ff] border-t-0 border-r-0 border-l-0 flex items-center gap-3">
              <UsersIcon className="h-6 w-6 text-[#9013fe]" aria-hidden />
              <div className="flex flex-col leading-5">
                <h3 className="capitalize text-lg font-semibold text-gray-700">
                  Share Your Link
                </h3>
                <small className="text-gray-500">
                  Invite friends and earn 25 points when they join!
                </small>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between max-w-[80%] mx-auto">
              <div className="flex flex-col items-center">
                <small className="text-4xl text-purple-600 font-bold">0</small>
                <small className="font-medium">Referrals</small>
              </div>
              <div className="flex flex-col items-center">
                <small className="text-4xl text-purple-600 font-bold">0</small>
                <small className="font-medium">Points Earned</small>
              </div>
            </div>

            <div className="p-[1rem]">
              <div className="bg-pink-50 rounded-lg p-2">
                <small>Your personal referral link:</small>
                <div className="bg-white p-2 h-8 flex items-center justify-between rounded-lg border border-gray-300">
                  <small>https://flowvahub.com/signup/?ref=black2552</small>
                  <ClipboardCopyIcon className="cursor-pointer hover:text-purple-600" />
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4 pb-4">
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform duration-200 hover:-translate-y-1"
                style={{ background: "rgb(24, 119, 242)" }}
              >
                <FacebookIcon className="w-4 h-4" aria-hidden />
              </button>
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform duration-200 hover:-translate-y-1"
                style={{ background: "black" }}
              >
                <XIcon className="w-4 h-4" aria-hidden />
              </button>
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform duration-200 hover:-translate-y-1"
                style={{ background: "rgb(0, 119, 181)" }}
              >
                <LinkedInIcon className="w-4 h-4" aria-hidden />
              </button>
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform duration-200 hover:-translate-y-1"
                style={{ background: "rgb(37, 211, 102)" }}
              >
                <WhatsappIcon className="w-4 h-4" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      <ClaimModal
        open={showModal}
        onClose={() => setShowModal(false)}
        email={email}
        setEmail={setEmail}
        emailRef={emailRef}
        file={file}
        onFileChange={handleFileChange}
        onSubmit={handleSubmitClaim}
        loading={loading}
        message={message}
      />

      {showLevelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setShowLevelUp(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden mx-auto p-6 text-center"
          >
            <button
              aria-label="Close"
              onClick={() => setShowLevelUp(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>

            <div className="flex justify-center mb-3">
              <SuccessCheckIcon
                className="w-16 h-16 text-green-500"
                aria-hidden
              />
            </div>

            <h2 className="text-[24px] font-bold text-center text-[#9013fe] mb-[10px]">
              Level Up! 🎉
            </h2>
            <div className="flex justify-center space-x-1 mb-1 text-xl">
              <span className="animate-bounce">✨</span>
              <span className="animate-bounce">💎</span>
              <span className="animate-bounce">🎯</span>
            </div>

            <div className="text-3xl md:text-4xl font-bold text-[#9013fe] my-4">
              {levelUpPoints ? `+${levelUpPoints} Points` : "+5 Points"}
            </div>

            <p className="text-sm text-gray-600">
              You&apos;ve claimed your daily points! Come back tomorrow for
              more!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarnPoints;
