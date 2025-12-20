import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { sanitizeErrorMessage, RateLimiter } from "../../utils/validation";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rateLimiter] = useState(() => new RateLimiter(5 * 60 * 1000, 5)); // 5 attempts per 5 minutes

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limiting check
    if (!rateLimiter.isAllowed(email)) {
      const remainingMs = rateLimiter.getRemainingTime(email);
      const remainingMin = Math.ceil(remainingMs / 60000);
      setError(
        `Too many attempts. Please try again in ${remainingMin} minute(s).`
      );
      return;
    }

    setError("");
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(sanitizeErrorMessage(error));
      setLoading(false);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent blur-3xl -z-10 rounded-full" />

      <Reveal width="100%" className="max-w-md w-full">
        <div className="bg-white dark:bg-surface border border-zinc-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm transition-colors duration-300">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">
              Welcome back
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Enter your credentials to access your account
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Email address
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-background border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-white/30 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-white/30 transition-all placeholder:text-zinc-400"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="login-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-background border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-white/30 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-white/30 transition-all placeholder:text-zinc-400"
                placeholder="********"
                required
              />
            </div>

            <Button className="w-full mt-4" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
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
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 dark:text-white hover:underline transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </Reveal>
    </div>
  );
};

export default Login;
