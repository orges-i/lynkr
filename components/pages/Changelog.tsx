import React from 'react';
import { Reveal } from '../ui/Reveal';

const updates = [
  {
    version: 'v2.4.0',
    date: 'March 15, 2024',
    title: 'Advanced Analytics Dashboard',
    description: 'We completely overhauled the analytics view. Now you can see real-time visitors, click-through rates by device, and geographical data.',
    tags: ['New Feature', 'Analytics']
  },
  {
    version: 'v2.3.1',
    date: 'February 28, 2024',
    title: 'Spotify & Apple Music Embeds',
    description: 'Share your favorite tracks directly on your page. The new music block supports full playlists and auto-play options.',
    tags: ['Integration', 'Media']
  },
  {
    version: 'v2.3.0',
    date: 'February 10, 2024',
    title: 'Custom Fonts Upload',
    description: 'Pro users can now upload their own .woff and .ttf font files to match their brand guidelines perfectly.',
    tags: ['Pro Feature', 'Design']
  },
  {
    version: 'v2.2.5',
    date: 'January 25, 2024',
    title: 'Performance Improvements',
    description: 'Reduced initial load time by 40% for all public profiles. Optimized image delivery and caching strategies.',
    tags: ['Performance']
  }
];

const Changelog: React.FC = () => {
  return (
    <div className="pt-32 pb-20 max-w-4xl mx-auto px-6">
      <Reveal className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Changelog</h1>
        <p className="text-zinc-400 text-lg">We're constantly improving. Here's what's new.</p>
      </Reveal>

      <div className="relative border-l border-white/10 ml-4 md:ml-12 space-y-16">
        {updates.map((update, index) => (
          <Reveal key={index} delay={index * 100} width="100%">
            <div className="relative pl-8 md:pl-12">
              {/* Timeline Dot */}
              <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-white border border-black shadow-[0_0_0_4px_rgba(0,0,0,1)]"></div>
              
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-2">
                <span className="text-xl font-bold text-white">{update.version}</span>
                <span className="text-zinc-500 text-sm font-mono">{update.date}</span>
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{update.title}</h3>
              <p className="text-zinc-400 leading-relaxed mb-6">{update.description}</p>
              
              <div className="flex gap-2">
                {update.tags.map((tag, i) => (
                   <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300">
                     {tag}
                   </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default Changelog;