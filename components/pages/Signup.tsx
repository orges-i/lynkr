import React, { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";
import toast from "react-hot-toast";
import {
  validateEmail,
  validateUsername,
  sanitizeErrorMessage,
  RateLimiter,
} from "../../utils/validation";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp } = useAuth();
  const { registrationsEnabled, loading: settingsLoading } = useSettings();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rateLimiter] = useState(() => new RateLimiter(5 * 60 * 1000, 3)); // 3 signup attempts per 5 minutes

  // Prefill username if provided via query param (e.g., from hero claim form)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const desired = params.get("username");
    if (desired) {
      setUsername(desired.toLowerCase());
    }
  }, [location.search]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrationsEnabled) {
      setError("Registrations are currently closed.");
      return;
    }

    // Rate limiting check
    if (!rateLimiter.isAllowed(email)) {
      const remainingMs = rateLimiter.getRemainingTime(email);
      const remainingMin = Math.ceil(remainingMs / 60000);
      setError(
        `Too many signup attempts. Please try again in ${remainingMin} minute(s).`
      );
      return;
    }

    setError("");
    setLoading(true);

    // Validate username format
    if (!validateUsername(username)) {
      setError(
        "Username must be 3-30 characters, letters, numbers, and underscores only"
      );
      setLoading(false);
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, username);

    if (error) {
      setError(sanitizeErrorMessage(error));
      setLoading(false);
    } else {
      sessionStorage.setItem("pending_signup_email", email);
      toast.success("Check your email to confirm your account.");
      navigate("/verify-email");
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col md:flex-row items-center justify-center relative overflow-hidden gap-12 max-w-6xl mx-auto px-6">
      <Reveal className="flex-1 hidden md:block">
        <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-zinc-900 dark:text-white">
          Join the future of <br />
          digital identity.
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-8 max-w-lg">
          Create a stunning bio page in minutes. No credit card required. Free
          forever plan available.
        </p>

        <div className="space-y-4">
          {[
            "Unlimited links & basic analytics",
            "Custom themes and fonts",
            "Embed music, videos, and tweets",
            "SEO optimized profiles",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-500/10 dark:bg-white/10 flex items-center justify-center">
                <Check className="w-3 h-3 text-indigo-600 dark:text-white" />
              </div>
              <span className="text-zinc-700 dark:text-zinc-300">{item}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal width="100%" className="flex-1 max-w-md w-full">
        <div className="bg-white dark:bg-surface border border-zinc-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm transition-colors duration-300">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">
              Create your account
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Claim your username to get started
            </p>
          </div>

          {(!registrationsEnabled || settingsLoading) && (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-700 dark:text-amber-300 text-sm">
              {settingsLoading
                ? "Checking availability…"
                : "Registrations are currently disabled."}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  lynkr.me/
                </span>
                <input
                  id="signup-username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  className="w-full bg-zinc-50 dark:bg-background border border-zinc-200 dark:border-white/10 rounded-lg pl-28 pr-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-white/30 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-white/30 transition-all placeholder:text-zinc-400"
                  placeholder="yourname"
                  required
                  disabled={!registrationsEnabled}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Email address
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-background border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-white/30 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-white/30 transition-all placeholder:text-zinc-400"
                placeholder="you@example.com"
                required
                disabled={!registrationsEnabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Password
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-background border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-white/30 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-white/30 transition-all placeholder:text-zinc-400"
                placeholder="********"
                required
                minLength={6}
                disabled={!registrationsEnabled}
              />
              <p className="text-xs text-zinc-500 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            <Button
              className="w-full mt-4"
              type="submit"
              disabled={loading || settingsLoading || !registrationsEnabled}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-surface text-zinc-500 dark:text-zinc-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              disabled
              className="flex items-center justify-center px-4 py-2 border border-zinc-200 dark:border-white/10 rounded-lg hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors text-sm font-medium text-zinc-600 dark:text-zinc-300 opacity-50 cursor-not-allowed"
            >
              Google
            </button>
            <button
              disabled
              className="flex items-center justify-center px-4 py-2 border border-zinc-200 dark:border-white/10 rounded-lg hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors text-sm font-medium text-zinc-600 dark:text-zinc-300 opacity-50 cursor-not-allowed"
            >
              Apple
            </button>
          </div>

          <p className="text-center mt-8 text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 dark:text-white hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Reveal>
    </div>
  );
};

export default Signup;
