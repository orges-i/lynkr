import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Reveal } from './ui/Reveal';
import { TiltCard } from './ui/TiltCard';

const ProductPreview: React.FC = () => {
  return (
    <div className="py-24 bg-surface relative overflow-hidden">
      {/* Subtle grid + glow backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18)_0,_transparent_48%),radial-gradient(circle_at_28%_42%,_rgba(236,72,153,0.16)_0,_transparent_38%)] blur-2xl dark:opacity-70 opacity-80"></div>
        <div className="absolute inset-0 bg-[length:32px_32px] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] opacity-30 dark:opacity-55"></div>
        <div className="absolute inset-0 bg-[length:32px_32px] bg-[linear-gradient(rgba(17,24,39,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(17,24,39,0.14)_1px,transparent_1px)] opacity-45 dark:opacity-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/55 to-surface pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="mb-16 md:text-center max-w-3xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary">Designed for flow.</h2>
            <p className="text-secondary text-lg">
              A powerful editor that feels like a natural extension of your creativity.
              Drag, drop, and style without writing a single line of code.
            </p>
          </Reveal>
        </div>

        <Reveal width="100%">
          <div className="flex items-center justify-center">
            <TiltCard className="relative z-10">
              <div className="relative w-[300px] h-[600px] bg-background dark:bg-black border-4 border-border dark:border-zinc-800 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col items-center pt-10 px-6 transition-colors">
                {/* Glossy overlay for glass effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-30"></div>

                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-border dark:bg-zinc-800 rounded-b-xl z-20"></div>

                {/* Cover */}
                <div className="absolute top-0 w-full h-32 bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 opacity-80"></div>

                {/* Phone Screen Content */}
                <div className="w-full h-full flex flex-col items-center animate-fade-in text-primary z-10">
                  {/* Profile Section */}
                  <div className="flex flex-col items-center mb-8 w-full text-center mt-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 mb-4 border-4 border-background dark:border-black shadow-lg relative overflow-hidden">
                      <img src="/assets/originalavatar.jpg" alt="Profile" className="w-full h-full object-cover opacity-90" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-1">Your Name</h3>
                    <p className="text-sm text-secondary">Digital Creator & Artist</p>
                  </div>

                  {/* Links Section */}
                  <div className="w-full space-y-3 flex-1">
                    {[
                      "Latest Youtube Video",
                      "My Portfolio Work",
                      "Book a Consultation"
                    ].map((text, i) => (
                      <div key={i} className="w-full p-4 rounded-xl bg-surfaceHighlight dark:bg-zinc-900/80 border border-border dark:border-white/5 flex items-center justify-between hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group shadow-sm">
                        <span className="font-medium text-sm text-primary">{text}</span>
                        <ExternalLink className="w-4 h-4 text-secondary group-hover:text-primary transition-colors opacity-70" />
                      </div>
                    ))}
                    {/* Empty Placeholder Slot - Ghost style */}
                    <div className="w-full p-4 rounded-xl border-2 border-dashed border-border dark:border-white/10 flex items-center justify-center text-secondary text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors cursor-pointer bg-transparent">
                      + Add another link
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto mb-8 w-full text-center text-secondary text-xs">
                    Powered by LYNKR
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default ProductPreview;
