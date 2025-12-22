import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { supabase } from "../../lib/supabase";

const VerifyEmail: React.FC = () => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const email =
    typeof window !== "undefined"
      ? sessionStorage.getItem("pending_signup_email") || ""
      : "";

  const handleResend = async () => {
    if (!email) return;
    setSending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    setSending(false);
    if (!error) setSent(true);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center relative overflow-hidden">
      <div className="bg-white dark:bg-surface border border-zinc-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm transition-colors duration-300 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-3 text-zinc-900 dark:text-white">
          Check your email
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6">
          We sent a confirmation link to{" "}
          <span className="font-semibold text-zinc-800 dark:text-white">
            {email || "your inbox"}
          </span>
          . Click the link to finish setting up your account.
        </p>

        <div className="space-y-3">
          <Button
            className="w-full"
            onClick={handleResend}
            disabled={!email || sending}
          >
            {sending
              ? "Sending..."
              : sent
              ? "Confirmation email sent"
              : "Resend confirmation email"}
          </Button>
          <Link
            to="/login"
            className="block text-sm text-indigo-600 dark:text-white hover:underline transition-colors"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
