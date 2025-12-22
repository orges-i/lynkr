import React, { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { sanitizeErrorMessage } from "../../utils/validation";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "ready" | "error">(
    "checking"
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const hashParams = new URLSearchParams(
        window.location.hash.replace("#", "")
      );
      const type = hashParams.get("type");
      const hasRecovery = type === "recovery";

      const { data } = await supabase.auth.getSession();
      if (data.session?.user || hasRecovery) {
        setStatus("ready");
      } else {
        setStatus("error");
      }
    };

    checkSession();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(sanitizeErrorMessage(error));
      return;
    }

    await supabase.auth.signOut();
    setMessage("Password updated. Please log in with your new password.");
    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent blur-3xl -z-10 rounded-full" />

      <Reveal width="100%" className="max-w-md w-full">
        <div className="bg-white dark:bg-surface border border-zinc-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm transition-colors duration-300 text-center">
          {status === "checking" && (
            <>
              <h1 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">
                Verifying reset link
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400">
                Please wait a moment.
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <h1 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">
                Invalid or expired link
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                Please request a new password reset link.
              </p>
              <Link
                to="/forgot-password"
                className="text-indigo-600 dark:text-white hover:underline transition-colors"
              >
                Request a new link
              </Link>
            </>
          )}

          {status === "ready" && (
            <>
              <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">
                Set a new password
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                Choose a strong password to secure your account.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400 text-sm">
                  {message}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleReset}>
                <div className="text-left">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    New password
                  </label>
                  <input
                    id="reset-password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-background border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-white/30 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-white/30 transition-all placeholder:text-zinc-400"
                    placeholder="********"
                    required
                  />
                </div>
                <div className="text-left">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Confirm password
                  </label>
                  <input
                    id="reset-password-confirm"
                    name="confirm-password"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-background border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-white/30 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-white/30 transition-all placeholder:text-zinc-400"
                    placeholder="********"
                    required
                  />
                </div>

                <Button className="w-full mt-2" type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update password"}
                </Button>
              </form>
            </>
          )}
        </div>
      </Reveal>
    </div>
  );
};

export default ResetPassword;
