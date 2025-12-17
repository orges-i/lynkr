import React from 'react';
import { Reveal } from '../ui/Reveal';
import { ExternalLink } from 'lucide-react';

const examples = [
  { name: 'Elena Designs', tag: 'Portfolio', color: 'from-pink-500 to-rose-500' },
  { name: 'Tech Insider', tag: 'News', color: 'from-blue-500 to-cyan-500' },
  { name: 'Chef Marco', tag: 'Culinary', color: 'from-orange-500 to-yellow-500' },
  { name: 'Sound Waves', tag: 'Music', color: 'from-purple-500 to-indigo-500' },
  { name: 'The Startup', tag: 'Business', color: 'from-green-500 to-emerald-500' },
  { name: 'Sarah Vlogs', tag: 'Creator', color: 'from-red-500 to-pink-600' },
];

const Showcase: React.FC = () => {
  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-6">
      <Reveal className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Made with LYNKR.</h1>
        <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
          Discover how leading creators, brands, and founders are using their space to tell their story.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {examples.map((item, index) => (
          <Reveal key={index} delay={index * 100}>
            <div className="group relative aspect-[9/16] rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl cursor-pointer">
              {/* Fake UI content */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
              
              <div className="absolute inset-0 p-8 flex flex-col items-center pt-20">
                 <div className="w-20 h-20 rounded-full bg-zinc-800 mb-4 shadow-lg border-2 border-white/10 group-hover:scale-105 transition-transform" />
                 <div className="w-32 h-4 bg-zinc-800 rounded-full mb-2" />
                 <div className="w-24 h-3 bg-zinc-900 rounded-full mb-8" />
                 
                 <div className="w-full space-y-3">
                   {[1, 2, 3, 4].map(k => (
                     <div key={k} className="w-full h-12 rounded-xl bg-background/50 border border-white/5 backdrop-blur-sm group-hover:bg-background/80 transition-colors" />
                   ))}
                 </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.name}</h3>
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-medium text-white mb-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{item.tag}</span>
                <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition-colors translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                  View Page <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default Showcase;