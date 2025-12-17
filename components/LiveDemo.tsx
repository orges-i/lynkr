import React from 'react';
import { ArrowUpRight, Instagram, Twitter, Youtube } from 'lucide-react';
import { Reveal } from './ui/Reveal';
import { Button } from './ui/Button';

const LiveDemo: React.FC = () => {
   return (
      <div className="py-32 max-w-7xl mx-auto px-6 flex flex-col items-center">
         <Reveal className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary">Live Preview</h2>
            <p className="text-secondary text-lg">See how creators are using LYNKR today.</p>
         </Reveal>

         <Reveal width="100%">
            <div className="bg-surface dark:bg-zinc-900 border border-border rounded-3xl p-4 md:p-12 max-w-4xl mx-auto shadow-2xl relative overflow-hidden transition-colors">
               {/* Decorative background for the demo card */}
               <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-indigo-500/10 to-transparent"></div>

               <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">

                  {/* The "Public Page" Card */}
                  <div className="w-full max-w-[350px] bg-black border border-zinc-800 rounded-[2.5rem] p-6 shadow-xl transform rotate-0 md:-rotate-2 hover:rotate-0 transition-transform duration-500">
                     <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full border-4 border-black shadow-lg mb-4 relative overflow-hidden">
                           <img src="/defaultavatar.jpg" alt="Creator" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Sarah Creator</h3>
                        <p className="text-zinc-500 text-sm mb-6">Digital Artist & Designer</p>

                        <div className="w-full space-y-3 mb-8">
                           {[
                              'New Collection Launch',
                              'My Design Portfolio',
                              'Book a Consultation',
                              'Youtube Channel'
                           ].map((link, i) => (
                              <div key={i} className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group flex justify-between items-center">
                                 <span className="text-sm font-medium text-zinc-200">{link}</span>
                                 <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                              </div>
                           ))}
                        </div>

                        <div className="flex gap-4">
                           <Instagram className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer" />
                           <Twitter className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer" />
                           <Youtube className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer" />
                        </div>
                     </div>
                  </div>

                  {/* Content beside the card */}
                  <div className="flex-1 text-center md:text-left">
                     <h3 className="text-2xl font-bold mb-4 text-primary">Your brand, front and center.</h3>
                     <p className="text-secondary mb-8 leading-relaxed">
                        Make a lasting impression with a page that reflects your unique style.
                        Choose from our curated themes or build your own from scratch using our
                        advanced design controls.
                     </p>
                     <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Button variant="primary" size="lg" className="!text-base whitespace-nowrap px-8">Create your page</Button>
                        <Button variant="outline" size="lg" className="!text-base whitespace-nowrap px-8">Explore themes</Button>
                     </div>
                  </div>
               </div>
            </div>
         </Reveal>
      </div>
   );
};

export default LiveDemo;