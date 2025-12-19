import React from 'react';
import { PenTool, Share2, Zap } from 'lucide-react';
import { Reveal } from './ui/Reveal';

const steps = [
  {
    icon: PenTool,
    title: 'Claim your link',
    description: 'Secure your unique username and start with a blank canvas or a beautiful template.'
  },
  {
    icon: Zap,
    title: 'Customize everything',
    description: 'Add your links, videos, music, and more. Tweak colors and fonts to match your brand.'
  },
  {
    icon: Share2,
    title: 'Share everywhere',
    description: 'Add your unique LYNKR URL to your Instagram, Twitter, TikTok, and email signature.'
  }
];

const HowItWorks: React.FC = () => {
  return (
    <div className="py-24 md:py-32 max-w-7xl mx-auto px-6">
      <style>{`
        @keyframes beam-scan {
          0% { left: -300px; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        .animate-beam {
          animation: beam-scan 3.5s linear infinite;
        }
      `}</style>

      <Reveal className="mb-20 text-left md:text-center">
         <h2 className="text-3xl md:text-5xl font-bold mb-4 text-primary">Effortless setup.</h2>
         <p className="text-secondary text-lg">From zero to launch in under 5 minutes.</p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative isolate">
        {/* Connector Line (Desktop) */}
        {/* Spans full screen width (w-screen) and centered relative to this container */}
        <div className="hidden md:block absolute top-14 left-1/2 -translate-x-1/2 w-screen h-px bg-zinc-300/40 dark:bg-zinc-700/40 z-0 overflow-hidden">
           {/* Brilliant Pulse Effect */}
           {/* Light Mode: Indigo/Purple Glow. Dark Mode: White Glow. */}
           <div className="absolute top-1/2 -translate-y-1/2 h-[3px] w-[300px] bg-gradient-to-r from-transparent via-indigo-600 dark:via-white to-transparent animate-beam opacity-100 blur-[0.5px] shadow-[0_0_15px_1px_rgba(79,70,229,0.6)] dark:shadow-[0_0_20px_2px_rgba(255,255,255,0.8)]"></div>
        </div>

        {steps.map((step, index) => (
          <Reveal key={index} delay={index * 200}>
            {/* Opaque background to mask the line behind the card */}
            <div className="relative z-10 bg-surface dark:bg-zinc-900 p-6 rounded-2xl border border-border hover:border-primary/20 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-surfaceHighlight border border-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute top-6 right-6 text-4xl font-bold text-primary/5 select-none transition-colors group-hover:text-primary/10">
                0{index + 1}
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">{step.title}</h3>
              <p className="text-secondary leading-relaxed">{step.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
