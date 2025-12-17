import React from 'react';
import { Reveal } from './ui/Reveal';
import { 
  Music, 
  Mail, 
  TrendingUp, 
  Calendar, 
  ExternalLink, 
  Play, 
  MessageSquare, 
  Zap,
  Globe,
  Youtube,
  Instagram
} from 'lucide-react';

const BentoHub: React.FC = () => {
  return (
    <div className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary">One hub. Infinite modules.</h2>
            <p className="text-secondary text-lg max-w-2xl">
              Don't just share links. Build a dashboard for your digital life with our modular widget system.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[180px]">
          
          {/* Main Module - Featured Content */}
          <div className="md:col-span-2 lg:col-span-3 lg:row-span-2 bg-surface border border-border rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-indigo-500/20 group-hover:text-indigo-500/40 transition-colors">
              <Zap className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex flex-col h-full">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold uppercase tracking-wider w-fit mb-4">Featured</span>
              <h3 className="text-3xl font-bold mb-4">Interactive Content Blocks</h3>
              <p className="text-secondary mb-8 max-w-sm">Embed anything from your latest YouTube video to your real-time Twitch stream status.</p>
              <div className="mt-auto flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-surfaceHighlight border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current" />
                 </div>
                 <div className="h-2 w-32 bg-surfaceHighlight rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-indigo-500"></div>
                 </div>
              </div>
            </div>
          </div>

          {/* Spotify Module */}
          <div className="md:col-span-2 lg:col-span-3 bg-[#1DB954]/10 border border-[#1DB954]/20 rounded-3xl p-6 relative overflow-hidden group">
             <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[#1DB954] text-black rounded-xl">
                   <Music className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-xs font-bold text-[#1DB954] uppercase tracking-widest">Now Playing</p>
                   <p className="text-sm font-bold truncate max-w-[150px]">Midnight City - M83</p>
                </div>
             </div>
             <div className="flex gap-1 items-end h-8">
                {[40, 70, 45, 90, 65, 80, 50, 60, 85, 40].map((h, i) => (
                   <div key={i} className="flex-1 bg-[#1DB954]/40 rounded-t-sm animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}></div>
                ))}
             </div>
          </div>

          {/* Newsletter Module */}
          <div className="md:col-span-2 lg:col-span-2 bg-surface border border-border rounded-3xl p-6 group hover:border-primary/20 transition-colors">
             <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-surfaceHighlight rounded-xl text-primary">
                   <Mail className="w-5 h-5" />
                </div>
                <div className="flex -space-x-2">
                   {[1, 2, 3].map(i => (
                     <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-6 h-6 rounded-full border-2 border-surface" />
                   ))}
                </div>
             </div>
             <h4 className="font-bold mb-1">Newsletter</h4>
             <p className="text-xs text-secondary">Join 12,400+ subscribers</p>
          </div>

          {/* Stats Module */}
          <div className="md:col-span-2 lg:col-span-1 bg-surface border border-border rounded-3xl p-6 flex flex-col justify-between">
             <div className="text-indigo-500">
                <TrendingUp className="w-6 h-6" />
             </div>
             <div>
                <p className="text-2xl font-bold tracking-tight">1.2M</p>
                <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">Total Clicks</p>
             </div>
          </div>

          {/* Live Badge Module */}
          <div className="md:col-span-1 lg:col-span-1 bg-red-500/10 border border-red-500/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-red-500/20 transition-all">
             <div className="w-3 h-3 rounded-full bg-red-500 animate-ping mb-3"></div>
             <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Live Now</p>
             <p className="text-[10px] text-secondary mt-1">On Twitch</p>
          </div>

          {/* Social Grid Module */}
          <div className="md:col-span-3 lg:col-span-2 bg-surface border border-border rounded-3xl p-6 flex items-center justify-around">
             <div className="p-4 rounded-2xl bg-surfaceHighlight hover:bg-primary hover:text-background transition-all cursor-pointer">
                <Instagram className="w-6 h-6" />
             </div>
             <div className="p-4 rounded-2xl bg-surfaceHighlight hover:bg-primary hover:text-background transition-all cursor-pointer">
                <Youtube className="w-6 h-6" />
             </div>
             <div className="p-4 rounded-2xl bg-surfaceHighlight hover:bg-primary hover:text-background transition-all cursor-pointer">
                <MessageSquare className="w-6 h-6" />
             </div>
          </div>

           {/* Custom Domain Module */}
          <div className="md:col-span-4 lg:col-span-3 bg-surface border border-border rounded-3xl p-6 flex items-center justify-between group overflow-hidden">
             <div className="relative z-10">
                <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Infrastructure</p>
                <h4 className="text-xl font-bold flex items-center gap-2">
                   yourname.com <Globe className="w-4 h-4 text-indigo-500" />
                </h4>
             </div>
             <div className="w-24 h-24 bg-indigo-500/5 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-700">
                <ExternalLink className="w-8 h-8 text-indigo-500/20" />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BentoHub;