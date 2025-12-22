import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    const finalize = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          sessionStorage.setItem("just_confirmed", "1");
          navigate("/dashboard", { replace: true });
          return;
        }

        setStatus("error");
      } catch (_err) {
        setStatus("error");
      }
    };

    finalize();
  }, [navigate]);

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center relative overflow-hidden">
      <div className="bg-white dark:bg-surface border border-zinc-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm transition-colors duration-300 max-w-md w-full text-center">
        {status === "loading" ? (
          <>
            <h1 className="text-2xl font-bold mb-3 text-zinc-900 dark:text-white">
              Finishing sign-in
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Hang tight while we confirm your account.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-3 text-zinc-900 dark:text-white">
              Sign-in failed
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mb-4">
              We couldn’t finish your sign-in. Please try logging in again.
            </p>
            <Link
              to="/login"
              className="text-indigo-600 dark:text-white hover:underline transition-colors"
            >
              Go to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
