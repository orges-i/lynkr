import React from 'react';
import { ArrowRight, Play, Activity, Users, Globe, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Reveal } from './ui/Reveal';
import { useTheme } from '../context/ThemeContext';
import Antigravity from './ui/Antigravity';

const Hero: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-[90vh] isolate">

      {/* Background Blobs (Restored for all screen sizes) */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-background">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000" />

        {/* Particle Shard Effect */}
        <Antigravity
          count={150}
          particleSize={1.5}
          color={theme === 'dark' ? '#FFFFFF' : '#1D1D1F'}
          magnetRadius={18}
          ringRadius={12}
          autoAnimate={true}
          lerpSpeed={0.1}
          waveSpeed={0.5}
          waveAmplitude={0.8}
        />
      </div>

      {/* Subtle Gradient Overlay at bottom for blending */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      {/* Main Content Layer */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center relative z-20">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/50 border border-border text-xs font-medium text-secondary mb-8 backdrop-blur-sm shadow-sm hover:border-primary/30 transition-colors cursor-pointer">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            New: Analytics 2.0 is now live
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-primary mb-6 drop-shadow-sm">
            One link.<br />
            Infinite presence.
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="text-lg md:text-xl text-secondary max-w-2xl mb-12 leading-relaxed">
            LYNKR is the premium link-in-bio builder for creators who care about design.
            Claim your corner of the internet in seconds.
          </p>
        </Reveal>

        {/* High Conversion Input Field */}
        <Reveal delay={300} width="100%" className="max-w-md mx-auto mb-16 relative">
          <form className="relative group w-full z-20" onSubmit={(e) => e.preventDefault()}>
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-20 group-hover:opacity-40 blur transition-opacity duration-500"></div>
            <div className="relative flex items-center bg-surface dark:bg-black border border-border rounded-full p-2 pl-6 shadow-2xl">
              <span className="text-secondary font-medium select-none text-lg">lynkr.com/</span>
              <input
                type="text"
                placeholder="yourname"
                className="bg-transparent border-none outline-none text-primary font-bold placeholder-zinc-500/50 w-full py-2 text-lg"
                autoComplete="off"
                spellCheck="false"
              />
              <Button size="lg" className="shrink-0 ml-2 rounded-full px-6 py-3">
                Claim It
              </Button>
            </div>
            {/* Micro-text trust signal */}
            <div className="absolute -bottom-8 left-0 right-0 text-center text-xs text-secondary flex justify-center gap-4">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Start free trial</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> No credit card</span>
            </div>
          </form>
        </Reveal>

        {/* Custom Glass Dashboard Graphic */}
        <Reveal delay={500} width="100%" className="mt-8">
          <div className="relative mx-auto max-w-5xl group perspective-1000">

            {/* Main Dashboard Card */}
            <div
              className="relative z-10 bg-surface/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-border rounded-3xl shadow-2xl p-6 md:p-8 transform transition-transform duration-500 ease-out rotate-x-6 group-hover:rotate-x-0"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
                  <div>
                    <div className="h-2 w-24 bg-primary/20 rounded-full mb-1"></div>
                    <div className="h-2 w-16 bg-primary/10 rounded-full"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-20 h-8 rounded-lg bg-surfaceHighlight border border-border"></div>
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20"></div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { label: 'Total Views', val: '124.5K', icon: Activity, color: 'text-indigo-500' },
                  { label: 'Active Users', val: '45.2K', icon: Users, color: 'text-purple-500' },
                  { label: 'Click Rate', val: '18.4%', icon: Globe, color: 'text-green-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-background border border-border p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-secondary font-medium">{stat.label}</span>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <div className="text-2xl font-bold text-primary">{stat.val}</div>
                    <div className="text-xs text-green-500 mt-1 flex items-center">
                      +12% <span className="text-secondary ml-1">vs last week</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart Area */}
              <div className="bg-background border border-border rounded-xl p-6 h-64 flex items-end gap-2 relative overflow-hidden">
                <div className="absolute top-6 left-6 text-sm font-medium text-primary">Engagement Over Time</div>
                {/* Fake Bars */}
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-indigo-500/20 to-indigo-500 rounded-t-sm hover:from-purple-500/20 hover:to-purple-500 transition-colors duration-300"
                    style={{ height: `${h}%` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-indigo-500/20 blur-[100px] -z-10 rounded-full pointer-events-none"></div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default Hero;