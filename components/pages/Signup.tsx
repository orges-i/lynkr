import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';
import { Link, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate username
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, username);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Successfully signed up
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col md:flex-row items-center justify-center relative overflow-hidden gap-12 max-w-6xl mx-auto px-6">

      {/* Left Column - Benefits */}
      <Reveal className="flex-1 hidden md:block">
        <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-zinc-900 dark:text-white">Join the future of <br />digital identity.</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-8 max-w-lg">Create a stunning bio page in minutes. No credit card required. Free forever plan available.</p>

        <div className="space-y-4">
          {[
            'Unlimited links & basic analytics',
            'Custom themes and fonts',
            'Embed music, videos, and tweets',
            'SEO optimized profiles'
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

      {/* Right Column - Form */}
      <Reveal width="100%" className="flex-1 max-w-md w-full">
        <div className="bg-white dark:bg-surface border border-zinc-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm transition-colors duration-300">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">Create your account</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Claim your username to get started</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">lynkr.com/</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  className="w-full bg-zinc-50 dark:bg-background border border-zinc-200 dark:border-white/10 rounded-lg pl-28 pr-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-white/30 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-white/30 transition-all placeholder:text-zinc-400"
                  placeholder="yourname"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-background border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-white/30 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-white/30 transition-all placeholder:text-zinc-400"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-background border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-white/30 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-white/30 transition-all placeholder:text-zinc-400"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <p className="text-xs text-zinc-500 mt-1">Must be at least 6 characters</p>
            </div>

            <Button className="w-full mt-4" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-surface text-zinc-500 dark:text-zinc-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button disabled className="flex items-center justify-center px-4 py-2 border border-zinc-200 dark:border-white/10 rounded-lg hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors text-sm font-medium text-zinc-600 dark:text-zinc-300 opacity-50 cursor-not-allowed">
              Google
            </button>
            <button disabled className="flex items-center justify-center px-4 py-2 border border-zinc-200 dark:border-white/10 rounded-lg hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors text-sm font-medium text-zinc-600 dark:text-zinc-300 opacity-50 cursor-not-allowed">
              Apple
            </button>
          </div>

          <p className="text-center mt-8 text-sm text-zinc-500">
            Already have an account? <Link to="/login" className="text-indigo-600 dark:text-white hover:underline transition-colors">Sign in</Link>
          </p>
        </div>
      </Reveal>
    </div>
  );
};

export default Signup;