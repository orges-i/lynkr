import React from 'react';
import { Layers, Image, Type, GripVertical, Settings, Smartphone, ExternalLink, Github, Twitter, Instagram, Mail } from 'lucide-react';
import { Reveal } from './ui/Reveal';
import { TiltCard } from './ui/TiltCard';

const ProductPreview: React.FC = () => {
  return (
    <div className="py-24 bg-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Fake Editor Sidebar */}
            <div className="lg:col-span-4 bg-background border border-border rounded-2xl p-6 shadow-2xl min-h-[600px] h-auto flex flex-col">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <span className="text-xs font-mono text-secondary">EDITOR</span>
              </div>

              <div className="space-y-4 flex-1">
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Blocks</p>
                {[
                  { icon: Layers, label: 'Link Group' },
                  { icon: Image, label: 'Featured Image' },
                  { icon: Type, label: 'Text Block' },
                  { icon: Smartphone, label: 'Social Embed' }
                ].map((item, i) => (
                  <div key={i} className="group flex items-center gap-3 p-3 rounded-lg bg-surface border border-border hover:border-primary/20 cursor-grab active:cursor-grabbing transition-all hover:translate-x-1 shadow-sm">
                    <GripVertical className="w-4 h-4 text-secondary group-hover:text-primary" />
                    <div className="p-2 bg-surfaceHighlight rounded-md text-secondary group-hover:text-primary">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-primary">{item.label}</span>
                  </div>
                ))}

                <div className="mt-8">
                  <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Style</p>
                  <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((c) => (
                      <div key={c} className="aspect-square rounded-full bg-surfaceHighlight hover:bg-primary border border-border hover:scale-110 transition-transform cursor-pointer" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-border flex items-center justify-between text-secondary text-xs">
                <span>Draft saved</span>
                <Settings className="w-4 h-4 hover:text-primary cursor-pointer" />
              </div>
            </div>

            {/* Editor Preview Area */}
            <div className="lg:col-span-8 bg-surfaceHighlight dark:bg-zinc-900/30 border border-border rounded-2xl p-8 min-h-[600px] flex items-center justify-center relative backdrop-blur-sm">
              {/* Background Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(120,120,120,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.1)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"></div>

              {/* 3D Tilted Phone Frame */}
              <TiltCard className="relative z-10">
                <div className="relative w-[300px] h-[600px] bg-background dark:bg-black border-4 border-border dark:border-zinc-800 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col items-center pt-10 px-6 transition-colors">
                  {/* Glossy overlay for glass effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-30"></div>

                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-border dark:bg-zinc-800 rounded-b-xl z-20"></div>

                  {/* Phone Screen Content */}
                  <div className="w-full h-full flex flex-col items-center animate-fade-in text-primary z-10">
                    {/* Profile Section */}
                    <div className="flex flex-col items-center mb-8 w-full text-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 mb-4 border-4 border-background dark:border-black shadow-lg relative group cursor-pointer overflow-hidden">
                        <img src="/defaultavatar.jpg" alt="Profile" className="w-full h-full object-cover opacity-90" />
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

                    {/* Social Icons */}
                    <div className="mt-auto mb-8 w-full">
                      <div className="flex justify-center gap-6 pt-6 border-t border-border dark:border-white/5">
                        {[Twitter, Instagram, Github, Mail].map((Icon, i) => (
                          <div key={i} className="text-secondary hover:text-primary hover:scale-110 transition-all cursor-pointer p-2 rounded-full hover:bg-surfaceHighlight">
                            <Icon className="w-5 h-5" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>

          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default ProductPreview;