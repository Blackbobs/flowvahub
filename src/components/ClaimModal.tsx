import CloseIcon from "@/icons/CloseIcon";
import CloudDownloadIcon from "@/icons/CloudDownloadIcon";
import React from "react";


type Props = {
  open: boolean;
  onClose: () => void;
  email: string;
  setEmail: (v: string) => void;
  emailRef: React.RefObject<HTMLInputElement | null>;
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => Promise<void>;
  loading: boolean;
  message: string | null;
};

const ClaimModal: React.FC<Props> = ({
  open,
  onClose,
  email,
  setEmail,
  emailRef,
  file,
  onFileChange,
  onSubmit,
  loading,
  message,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        className="ant-modal-content relative w-full max-w-lg bg-white rounded-lg overflow-hidden mx-auto"
      >
        <button
          type="button"
          aria-label="Close"
          className="ant-modal-close absolute top-3 right-3"
          onClick={onClose}
        >
          <CloseIcon />
        </button>

        <div className="ant-modal-header px-4 pt-4">
          <div className="ant-modal-title">
            <h1 className="md:text-lg">Claim Your 50 Points</h1>
          </div>
        </div>

        <div className="ant-modal-body p-6">
          <p className="text-[0.9rem] text-[#6c757d] mb-3">
            Sign up for Reclaim (free, no payment needed), then fill the form
            below:
          </p>
          <ol className="list-decimal pl-5 text-[0.9rem] text-[#6c757d] space-y-1 mb-3">
            <li>Enter your Reclaim sign-up email.</li>
            <li>
              Upload a screenshot of your Reclaim profile showing your email.
            </li>
          </ol>
          <p className="text-[0.9rem] text-[#6c757d] mb-4">
            After verification, you’ll get 25 Flowva Points! 🎉😊
          </p>

          {message && (
            <div className="text-sm text-red-600 mb-3">{message}</div>
          )}

          <label
            htmlFor="email"
            className="block text-sm font-medium mb-2 text-[#111827]"
          >
            Email used on Reclaim
          </label>
          <div className="relative group w-full mb-5">
            <input
              id="email"
              type="email"
              placeholder="user@example.com"
              className="peer w-full border text-base py-[10px] px-[14px] border-[#EDE9FE] transition-all ease-linear duration-[.2s] rounded-md outline-none focus:border-[#9013fe]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              ref={emailRef}
            />
            <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>
          </div>

          <label
            htmlFor="file"
            className="block text-sm mb-[0.5rem] font-medium text-[#111827]"
          >
            Upload screenshot (mandatory)
          </label>
          <label className="p-[0.5rem] cursor-pointer hover:bg-[rgba(29,28,28,0.05)] block border border-dashed border-[#e9ecef] rounded-[8px] bg-[#f9f9f9] transition-all duration-200 mb-4">
            <p className="text-center flex justify-center gap-[0.5rem]">
              <CloudDownloadIcon />
              <span className="text-base">
                {file ? file.name : "Choose file"}
              </span>
            </p>
            <input
              className="hidden"
              type="file"
              accept="image/*"
              onChange={onFileChange}
            />
          </label>

          <div className="flex gap-3 justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="p-[0.5rem_1rem] rounded-[8px] font-semibold transition-all duration-200 hover:bg-[#d1d5db] bg-[#e9ecef] text-[#020617]"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                await onSubmit();
                onClose();
              }}
              disabled={loading}
              className="p-[0.5rem_1rem] rounded-[8px] font-semibold transition-all duration-200 bg-[#9103fe] text-white hover:bg-[#FF8687]"
            >
              {loading ? "Submitting..." : "Submit Claim"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimModal;
