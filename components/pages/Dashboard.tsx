import React, { useState, useEffect } from 'react';
import {
   Layers,
   BarChart3,
   Settings,
   Palette,
   Plus,
   GripVertical,
   Image as ImageIcon,
   Trash2,
   ExternalLink,
   Share2,
   Copy,
   Eye,
   MoreVertical,
   Upload,
   User,
   Layout,
   Type,
   TrendingUp,
   Globe,
   Clock,
   LogOut,
   Shield,
   CreditCard,
   Menu,
   X,
   Sun,
   Moon,
   Camera
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
   fetchUserProfile,
   fetchUserLinks,
   fetchAppearanceSettings,
   createLink,
   updateLink as updateLinkInDb,
   deleteLink as deleteLinkFromDb,
   updateProfile,
   updateAppearance,
   Profile,
   Link as SupabaseLink,
   AppearanceSettings
} from '../../lib/supabaseHelpers';

// -- Types --
type ViewState = 'links' | 'appearance' | 'analytics' | 'settings';

interface LinkItem {
   id: string;
   title: string;
   url: string;
   active: boolean;
   clicks: number;
   position: number;
}

interface ProfileConfig {
   username: string;
   bio: string;
   avatar: string;
   coverImage: string;
   theme: 'simple' | 'dark' | 'midnight' | 'sunset' | 'ocean' | 'forest';
   buttonStyle: 'rounded' | 'square' | 'pill' | 'hard';
   buttonFill: 'solid' | 'outline' | 'ghost';
   buttonShadow: 'none' | 'soft' | 'hard';
   font: 'sans' | 'serif' | 'mono';
}

// -- Mock Data --
const initialLinks: LinkItem[] = [
   { id: '1', title: 'My Latest Youtube Video', url: 'https://youtube.com/watch?v=123', active: true, clicks: 1240, position: 0 },
   { id: '2', title: 'Summer Collection 2024', url: 'https://myshop.com/summer', active: true, clicks: 850, position: 1 },
   { id: '3', title: 'Book a Consultation', url: 'https://calendly.com/me/30min', active: false, clicks: 45, position: 2 },
];

const themes = {
   simple: "bg-gray-100 text-gray-900",
   dark: "bg-black text-white",
   midnight: "bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white",
   sunset: "bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 text-white",
   ocean: "bg-gradient-to-b from-cyan-500 to-blue-600 text-white",
   forest: "bg-gradient-to-b from-emerald-800 to-green-900 text-white"
};

const buttonStyles = {
   rounded: "rounded-xl",
   square: "rounded-none",
   pill: "rounded-full",
   hard: "rounded-none"
};

// -- Components --

const SidebarItem: React.FC<{
   icon: any;
   label: string;
   active?: boolean;
   onClick: () => void;
}> = ({ icon: Icon, label, active, onClick }) => (
   <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
         ? 'bg-primary text-background font-medium shadow-md'
         : 'text-secondary hover:text-primary hover:bg-surfaceHighlight'
         }`}
   >
      <Icon className={`w-5 h-5 ${active ? 'text-background' : 'text-secondary group-hover:text-primary'}`} />
      <span>{label}</span>
   </button>
);

const PhonePreview: React.FC<{ links: LinkItem[], config: ProfileConfig }> = ({ links, config }) => {
   const themeClass = themes[config.theme];
   const btnShapeClass = buttonStyles[config.buttonStyle];

   const isDarkTheme = config.theme !== 'simple';
   const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';

   // Dynamic Button Class Construction
   let btnClasses = `${btnShapeClass} w-full p-4 text-center text-sm font-medium transition-all cursor-pointer mb-3 `;

   // Fill Style
   if (config.buttonFill === 'solid') {
      btnClasses += isDarkTheme ? 'bg-white text-black ' : 'bg-black text-white ';
   } else if (config.buttonFill === 'outline') {
      btnClasses += isDarkTheme ? 'border-2 border-white text-white hover:bg-white/10 ' : 'border-2 border-black text-black hover:bg-black/5 ';
   } else if (config.buttonFill === 'ghost') {
      btnClasses += isDarkTheme ? 'bg-white/10 backdrop-blur-md hover:bg-white/20 text-white ' : 'bg-white border border-gray-200 text-gray-900 hover:scale-[1.02] ';
   }

   // Shadow Style
   if (config.buttonShadow === 'soft') {
      btnClasses += 'shadow-lg ';
   } else if (config.buttonShadow === 'hard') {
      btnClasses += 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ';
      if (isDarkTheme) btnClasses += 'shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] ';
   }

   // Font Family
   const fontClass = config.font === 'serif' ? 'font-serif' : config.font === 'mono' ? 'font-mono tracking-tight' : 'font-sans';

   return (
      <div className={`relative w-[300px] h-[600px] bg-black border-[8px] border-zinc-800 rounded-[3rem] shadow-2xl overflow-hidden ring-4 ring-black/5 ${fontClass}`}>
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-xl z-20"></div>

         <div className={`w-full h-full flex flex-col overflow-y-auto transition-all duration-500 ${themeClass} scrollbar-hide`}>
            {/* Cover Image */}
            <div className="h-32 w-full shrink-0 relative">
               <img src={config.coverImage} alt="Cover" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
            </div>

            <div className="px-4 pb-8 -mt-12 flex flex-col items-center relative z-10 animate-fade-in">
               {/* Avatar */}
               <div className="w-24 h-24 rounded-full mb-4 border-4 border-current shadow-xl overflow-hidden relative bg-surface" style={{ borderColor: 'inherit' }}>
                  <div className="absolute inset-0 bg-black/10"></div> {/* Fallback bg */}
                  <img src={config.avatar} alt="Profile" className="w-full h-full object-cover relative z-10" />
               </div>

               <h3 className={`font-bold text-lg ${textColor} mt-1`}>{config.username}</h3>
               <p className={`text-sm opacity-80 ${textColor} text-center`}>{config.bio}</p>
            </div>

            <div className="flex-1 px-4 pb-8">
               {links.filter(l => l.active).map(link => (
                  <div
                     key={link.id}
                     className={btnClasses}
                  >
                     {link.title}
                  </div>
               ))}
            </div>

            <div className="mt-auto pt-4 flex justify-center opacity-70 pb-6">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDarkTheme ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
                  <div className="w-8 h-8 flex items-center justify-center">
                     <div className="font-bold tracking-tighter text-lg">L</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

// -- Main View Components --

const LinksView: React.FC<{
   links: LinkItem[],
   onAdd: () => void,
   onDelete: (id: string) => void,
   onUpdate: (id: string, updates: Partial<LinkItem>) => void
}> = ({ links, onAdd, onDelete, onUpdate }) => {

   return (
      <div className="max-w-2xl mx-auto w-full animate-slide-up pb-24">
         <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Links</h2>
            <p className="text-secondary">Manage what shows up on your profile.</p>
         </div>

         <div className="mb-8">
            <Button onClick={onAdd} className="w-full py-6 text-lg shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1">
               <Plus className="w-5 h-5 mr-2" /> Add New Link
            </Button>
         </div>

         <div className="space-y-4">
            {links.map((link) => (
               <div key={link.id} className="group bg-surface border border-border rounded-2xl p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-md">
                  <div className="flex items-start gap-3">
                     <div className="mt-4 cursor-grab active:cursor-grabbing text-secondary hover:text-primary">
                        <GripVertical className="w-5 h-5" />
                     </div>

                     <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex items-center justify-between gap-4">
                           <div className="flex-1 min-w-0">
                              <input
                                 type="text"
                                 value={link.title}
                                 onChange={(e) => onUpdate(link.id, { title: e.target.value })}
                                 className="w-full bg-transparent border-none p-0 text-base font-semibold text-primary focus:ring-0 placeholder-zinc-500 truncate"
                                 placeholder="Link Title"
                              />
                              <input
                                 type="text"
                                 value={link.url}
                                 onChange={(e) => onUpdate(link.id, { url: e.target.value })}
                                 className="w-full bg-transparent border-none p-0 text-sm text-secondary focus:ring-0 placeholder-zinc-600 mt-1 truncate"
                                 placeholder="https://url..."
                              />
                           </div>
                           <div className="flex items-center gap-2 shrink-0">
                              <label className="relative inline-flex items-center cursor-pointer">
                                 <input type="checkbox" checked={link.active} onChange={() => onUpdate(link.id, { active: !link.active })} className="sr-only peer" />
                                 <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                              </label>
                           </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-border/50 gap-2">
                           <div className="flex gap-2">
                              <button className="p-2 rounded-lg hover:bg-surfaceHighlight text-secondary hover:text-primary transition-colors">
                                 <ImageIcon className="w-4 h-4" />
                              </button>
                              <button className="p-2 rounded-lg hover:bg-surfaceHighlight text-secondary hover:text-primary transition-colors">
                                 <BarChart3 className="w-4 h-4" />
                              </button>
                           </div>
                           <div className="flex items-center gap-4 text-xs text-secondary">
                              <span className="flex items-center gap-1">
                                 <BarChart3 className="w-3 h-3" />
                                 {link.clicks || 0} clicks
                              </span>
                              <button onClick={() => onDelete(link.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-secondary hover:text-red-500 transition-colors">
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

const AppearanceView: React.FC<{
   config: ProfileConfig,
   onUpdate: (updates: Partial<ProfileConfig>) => void
}> = ({ config, onUpdate }) => {
   return (
      <div className="max-w-2xl mx-auto w-full animate-slide-up space-y-12 pb-24">
         <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Appearance</h2>
            <p className="text-secondary">Customize the look and feel of your page.</p>
         </div>

         <section className="space-y-4">
            <h3 className="font-semibold text-lg">Profile</h3>
            <div className="bg-surface border border-border rounded-2xl p-6">

               {/* Cover Image Upload */}
               <div className="mb-8">
                  <label className="text-xs font-semibold text-secondary uppercase mb-2 block">Cover Image</label>
                  <div className="group relative h-32 w-full bg-surfaceHighlight rounded-xl overflow-hidden cursor-pointer border-2 border-dashed border-border hover:border-primary/50 transition-all">
                     {config.coverImage && (
                        <img src={config.coverImage} alt="Cover" className="w-full h-full object-cover" />
                     )}
                     <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-surface text-primary px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm">
                           <Camera className="w-4 h-4" /> Change Cover
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
                  <div className="relative group cursor-pointer shrink-0">
                     <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border relative bg-surfaceHighlight">
                        <img src={config.avatar} alt="Avatar" className="w-full h-full object-cover" />
                     </div>
                     <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="w-6 h-6 text-white" />
                     </div>
                  </div>

                  <div className="flex-1 space-y-4 w-full">
                     <div>
                        <Button variant="secondary" size="sm" className="mb-4">Pick an image</Button>
                        <Button variant="ghost" size="sm" className="mb-4 ml-2 text-red-500 hover:text-red-600 hover:bg-red-500/10">Remove</Button>
                     </div>
                     <div>
                        <label className="text-xs font-semibold text-secondary uppercase mb-1 block">Profile Title</label>
                        <input
                           type="text"
                           value={config.username}
                           onChange={(e) => onUpdate({ username: e.target.value })}
                           className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                     </div>
                     <div>
                        <label className="text-xs font-semibold text-secondary uppercase mb-1 block">Bio</label>
                        <textarea
                           value={config.bio}
                           onChange={(e) => onUpdate({ bio: e.target.value })}
                           rows={3}
                           className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                        />
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <section className="space-y-4">
            <h3 className="font-semibold text-lg">Themes</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {Object.keys(themes).map((themeKey) => (
                  <div
                     key={themeKey}
                     onClick={() => onUpdate({ theme: themeKey as any })}
                     className={`cursor-pointer group relative rounded-xl border-2 overflow-hidden transition-all ${config.theme === themeKey ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : 'border-transparent hover:border-border'}`}
                  >
                     <div className={`h-32 w-full ${themes[themeKey as keyof typeof themes]} p-4 flex flex-col items-center justify-center gap-2`}>
                        <div className="w-16 h-2 bg-white/20 rounded-full"></div>
                        <div className="w-10 h-2 bg-white/20 rounded-full"></div>
                        <div className="w-full h-8 mt-2 bg-white/20 rounded-lg"></div>
                     </div>
                     <div className="p-3 bg-surface text-center text-sm font-medium capitalize">
                        {themeKey}
                     </div>
                  </div>
               ))}
            </div>
         </section>

         <section className="space-y-4">
            <h3 className="font-semibold text-lg">Button Style</h3>
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-8">
               {/* Shape */}
               <div>
                  <label className="text-xs font-semibold text-secondary uppercase mb-3 block">Shape</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {Object.keys(buttonStyles).map((style) => (
                        <button
                           key={style}
                           onClick={() => onUpdate({ buttonStyle: style as any })}
                           className={`p-4 border rounded-lg hover:bg-surfaceHighlight transition-all flex flex-col items-center gap-2 ${config.buttonStyle === style ? 'border-primary bg-primary/5' : 'border-border'}`}
                        >
                           <div className={`w-full h-8 bg-primary ${buttonStyles[style as keyof typeof buttonStyles]}`}></div>
                           <span className="text-xs font-medium capitalize mt-2">{style}</span>
                        </button>
                     ))}
                  </div>
               </div>

               {/* Fill */}
               <div>
                  <label className="text-xs font-semibold text-secondary uppercase mb-3 block">Fill</label>
                  <div className="flex flex-wrap gap-4">
                     {['solid', 'outline', 'ghost'].map((fill) => (
                        <button
                           key={fill}
                           onClick={() => onUpdate({ buttonFill: fill as any })}
                           className={`px-6 py-3 rounded-xl border capitalize text-sm font-medium transition-all ${config.buttonFill === fill
                              ? 'border-primary bg-primary text-background shadow-md'
                              : 'border-border hover:border-primary/50 text-secondary'
                              }`}
                        >
                           {fill}
                        </button>
                     ))}
                  </div>
               </div>

               {/* Shadow */}
               <div>
                  <label className="text-xs font-semibold text-secondary uppercase mb-3 block">Shadow Depth</label>
                  <div className="flex flex-wrap gap-4">
                     {['none', 'soft', 'hard'].map((shadow) => (
                        <button
                           key={shadow}
                           onClick={() => onUpdate({ buttonShadow: shadow as any })}
                           className={`px-6 py-3 rounded-xl border capitalize text-sm font-medium transition-all ${config.buttonShadow === shadow
                              ? 'border-primary bg-primary text-background shadow-md'
                              : 'border-border hover:border-primary/50 text-secondary'
                              }`}
                        >
                           {shadow}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         <section className="space-y-4">
            <h3 className="font-semibold text-lg">Typography</h3>
            <div className="bg-surface border border-border rounded-2xl p-6">
               <div className="grid grid-cols-3 gap-4">
                  <button
                     onClick={() => onUpdate({ font: 'sans' })}
                     className={`p-4 border rounded-xl text-center transition-all ${config.font === 'sans' ? 'border-primary bg-primary/5' : 'border-border hover:bg-surfaceHighlight'}`}
                  >
                     <span className="text-2xl font-sans font-bold block mb-2">Aa</span>
                     <span className="text-xs font-medium text-secondary">Sans Serif</span>
                  </button>
                  <button
                     onClick={() => onUpdate({ font: 'serif' })}
                     className={`p-4 border rounded-xl text-center transition-all ${config.font === 'serif' ? 'border-primary bg-primary/5' : 'border-border hover:bg-surfaceHighlight'}`}
                  >
                     <span className="text-2xl font-serif font-bold block mb-2">Aa</span>
                     <span className="text-xs font-medium text-secondary">Serif</span>
                  </button>
                  <button
                     onClick={() => onUpdate({ font: 'mono' })}
                     className={`p-4 border rounded-xl text-center transition-all ${config.font === 'mono' ? 'border-primary bg-primary/5' : 'border-border hover:bg-surfaceHighlight'}`}
                  >
                     <span className="text-2xl font-mono font-bold block mb-2">Aa</span>
                     <span className="text-xs font-medium text-secondary">Monospace</span>
                  </button>
               </div>
            </div>
         </section>
      </div>
   );
};

// ... (No changes to AnalyticsView, SettingsView, etc. until Dashboard Component)

const AnalyticsView: React.FC = () => {
   // ... (No changes)
   const Chart = () => (
      <div className="relative h-64 w-full mt-4">
         <svg viewBox="0 0 1000 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            {[0, 50, 100, 150].map(y => (
               <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="currentColor" strokeOpacity="0.1" />
            ))}
            <path
               d="M0,200 L0,150 C100,120 200,160 300,100 C400,40 500,80 600,60 C700,40 800,90 900,50 L1000,20 L1000,200 Z"
               className="fill-primary/10"
            />
            <path
               d="M0,150 C100,120 200,160 300,100 C400,40 500,80 600,60 C700,40 800,90 900,50 L1000,20"
               fill="none"
               stroke="currentColor"
               strokeWidth="3"
               className="text-primary"
               vectorEffect="non-scaling-stroke"
            />
            <circle cx="300" cy="100" r="4" className="fill-background stroke-primary stroke-2" />
            <circle cx="600" cy="60" r="4" className="fill-background stroke-primary stroke-2" />
         </svg>
         <div className="flex justify-between text-xs text-secondary mt-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
         </div>
      </div>
   );

   return (
      <div className="max-w-4xl mx-auto w-full animate-slide-up pb-24">
         <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
               <h2 className="text-2xl font-bold mb-2">Analytics</h2>
               <p className="text-secondary">Overview of your profile performance.</p>
            </div>
            <div className="flex bg-surfaceHighlight rounded-lg p-1 w-fit">
               <button className="px-3 py-1 bg-background shadow-sm rounded-md text-sm font-medium">7D</button>
               <button className="px-3 py-1 text-secondary text-sm font-medium hover:text-primary">30D</button>
               <button className="px-3 py-1 text-secondary text-sm font-medium hover:text-primary">All</button>
            </div>
         </div>

         <div className="bg-surface border border-border rounded-2xl p-4 md:p-6 mb-8 shadow-sm overflow-hidden">
            <div className="flex items-center gap-4 mb-2">
               <div>
                  <p className="text-sm text-secondary">Total Views</p>
                  <h3 className="text-3xl font-bold">24,582</h3>
               </div>
               <div className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12.5%
               </div>
            </div>
            <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
               <Chart />
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-surface border border-border rounded-2xl p-6">
               <h3 className="font-semibold mb-6 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-secondary" /> Top Locations
               </h3>
               <div className="space-y-4">
                  {[
                     { country: 'United States', val: '45%' },
                     { country: 'United Kingdom', val: '20%' },
                     { country: 'Germany', val: '12%' },
                     { country: 'Canada', val: '8%' },
                  ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-primary">{item.country}</span>
                        <div className="flex items-center gap-3 w-1/2 justify-end">
                           <div className="w-24 h-2 bg-surfaceHighlight rounded-full overflow-hidden">
                              <div style={{ width: item.val }} className="h-full bg-primary rounded-full"></div>
                           </div>
                           <span className="text-xs text-secondary w-8 text-right">{item.val}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
               <h3 className="font-semibold mb-6 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-secondary" /> Top Referrers
               </h3>
               <div className="space-y-4">
                  {[
                     { source: 'Instagram', val: '12.5k' },
                     { source: 'Twitter / X', val: '5.2k' },
                     { source: 'Direct', val: '3.1k' },
                     { source: 'TikTok', val: '1.8k' },
                  ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-surfaceHighlight transition-colors">
                        <span className="text-sm font-medium">{item.source}</span>
                        <span className="text-sm text-secondary">{item.val}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

const SettingsView: React.FC = () => {
   // ... (No Changes)
   return (
      <div className="max-w-2xl mx-auto w-full animate-slide-up space-y-8 pb-24">
         <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Settings</h2>
            <p className="text-secondary">Manage your account and preferences.</p>
         </div>

         <div className="space-y-6">
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
               <div className="px-6 py-4 border-b border-border bg-surfaceHighlight/30">
                  <h3 className="font-semibold flex items-center gap-2">
                     <User className="w-4 h-4" /> My Account
                  </h3>
               </div>
               <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-semibold text-secondary uppercase mb-1 block">Full Name</label>
                        <input type="text" defaultValue="Alex Rivera" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm" />
                     </div>
                     <div>
                        <label className="text-xs font-semibold text-secondary uppercase mb-1 block">Email</label>
                        <input type="email" defaultValue="alex@example.com" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm" />
                     </div>
                  </div>
                  <div className="pt-2">
                     <Button variant="outline" size="sm">Change Password</Button>
                  </div>
               </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
               <div className="px-6 py-4 border-b border-border bg-surfaceHighlight/30">
                  <h3 className="font-semibold flex items-center gap-2">
                     <Globe className="w-4 h-4" /> SEO Settings
                  </h3>
               </div>
               <div className="p-6 space-y-4">
                  <div>
                     <label className="text-xs font-semibold text-secondary uppercase mb-1 block">Meta Title</label>
                     <input type="text" placeholder="Title that shows in Google" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                     <label className="text-xs font-semibold text-secondary uppercase mb-1 block">Meta Description</label>
                     <textarea rows={2} placeholder="Description for search engines" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm resize-none" />
                  </div>
               </div>
            </div>

            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl overflow-hidden">
               <div className="px-6 py-4 border-b border-red-500/20 bg-red-500/10">
                  <h3 className="font-semibold flex items-center gap-2 text-red-500">
                     <Shield className="w-4 h-4" /> Danger Zone
                  </h3>
               </div>
               <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                  <div>
                     <h4 className="font-medium text-red-500 mb-1">Delete Account</h4>
                     <p className="text-xs text-red-500/70">Permanently delete your account and all of your content.</p>
                  </div>
                  <Button variant="ghost" className="text-red-500 hover:bg-red-500/10 hover:text-red-600 whitespace-nowrap">Delete Account</Button>
               </div>
            </div>
         </div>
      </div>
   );
};

// -- Main Dashboard Component --

const Dashboard: React.FC = () => {
   const [currentView, setCurrentView] = useState<ViewState>('links');
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [links, setLinks] = useState<LinkItem[]>([]);
   const [loading, setLoading] = useState(true);
   const { theme, toggleTheme } = useTheme();
   const { signOut, user } = useAuth();
   const navigate = useNavigate();

   // Debounce ref for auto-saving
   const debounceRef = React.useRef<NodeJS.Timeout>();

   const [profileConfig, setProfileConfig] = useState<ProfileConfig>({
      username: '',
      bio: '',
      avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60',
      coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&auto=format&fit=crop&q=60',
      theme: 'simple',
      buttonStyle: 'rounded',
      buttonFill: 'solid',
      buttonShadow: 'none',
      font: 'sans'
   });

   // -- Data Loading --
   useEffect(() => {
      if (!user) return;

      const loadData = async () => {
         setLoading(true);
         try {
            const [profile, userLinks, settings] = await Promise.all([
               fetchUserProfile(user.id),
               fetchUserLinks(user.id),
               fetchAppearanceSettings(user.id)
            ]);

            // 1. Set Profile
            if (profile) {
               setProfileConfig(prev => ({
                  ...prev,
                  username: profile.username,
                  bio: profile.bio || prev.bio,
                  avatar: profile.avatar_url || prev.avatar,
                  coverImage: profile.cover_image_url || prev.coverImage,
               }));
            }

            // 2. Set Appearance
            if (settings) {
               setProfileConfig(prev => ({
                  ...prev,
                  theme: settings.theme,
                  buttonStyle: settings.button_style,
                  buttonFill: settings.button_fill,
                  buttonShadow: settings.button_shadow,
                  font: settings.font as any
               }));
            }

            // 3. Set Links
            if (userLinks) {
               setLinks(userLinks.map(l => ({
                  id: l.id,
                  title: l.title,
                  url: l.url,
                  active: l.active,
                  clicks: 0, // Placeholder until Analytics Phase
                  position: l.position
               })));
            }
         } catch (error) {
            console.error('Error loading dashboard:', error);
            toast.error('Failed to load your dashboard data.');
         } finally {
            setLoading(false);
         }
      };

      loadData();
   }, [user]);

   const handleLogout = async () => {
      await signOut();
      navigate('/login');
   };

   // -- Handlers --

   const handleCreateLink = async () => {
      if (!user) return;
      const newPosition = links.length; // Simple append
      const tempId = `temp-${Date.now()}`;

      // Optimistic Update
      const optimisticLink: LinkItem = {
         id: tempId,
         title: 'New Link',
         url: 'https://',
         active: true,
         clicks: 0,
         position: newPosition
      };
      setLinks([optimisticLink, ...links]); // Add to top

      try {
         const created = await createLink(user.id, {
            title: 'New Link',
            url: 'https://',
            position: newPosition
         });

         if (created) {
            // Replace temp ID with real ID
            setLinks(currentLinks => currentLinks.map(l =>
               l.id === tempId ? { ...l, id: created.id, position: created.position } : l
            ));
            toast.success('Link created');
         }
      } catch (error) {
         toast.error('Failed to create link');
         setLinks(links); // Revert
      }
   };

   const handleUpdateLink = (id: string, updates: Partial<LinkItem>) => {
      // 1. Optimistic Update
      setLinks(currentLinks => currentLinks.map(l =>
         l.id === id ? { ...l, ...updates } : l
      ));

      // 2. Debounced API Call
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
         try {
            await updateLinkInDb(id, updates);
            // Silent success for auto-save
         } catch (error) {
            toast.error('Failed to save changes');
         }
      }, 500);
   };

   const handleDeleteLink = async (id: string) => {
      const confirmed = window.confirm('Are you sure you want to delete this link?');
      if (!confirmed) return;

      const originalLinks = [...links];
      setLinks(links.filter(l => l.id !== id));

      try {
         await deleteLinkFromDb(id);
         toast.success('Link deleted');
      } catch (error) {
         toast.error('Failed to delete link');
         setLinks(originalLinks);
      }
   };

   const handleUpdateConfig = (updates: Partial<ProfileConfig>) => {
      if (!user) return;

      // 1. Optimistic Update
      setProfileConfig(prev => ({ ...prev, ...updates }));

      // 2. Debounced API Call
      // We need to separate Profile fields vs Appearance fields
      const profileFields = ['username', 'bio', 'avatar', 'coverImage'];
      const appearanceFields = ['theme', 'buttonStyle', 'buttonFill', 'buttonShadow', 'font'];

      const profileUpdates: Partial<Profile> = {};
      const appearanceUpdates: Partial<AppearanceSettings> = {};

      Object.entries(updates).forEach(([key, val]) => {
         if (profileFields.includes(key)) {
            if (key === 'coverImage') profileUpdates.cover_image_url = val as string;
            else if (key === 'avatar') profileUpdates.avatar_url = val as string;
            else (profileUpdates as any)[key] = val;
         }
         else if (appearanceFields.includes(key)) {
            if (key === 'buttonStyle') appearanceUpdates.button_style = val as any;
            else if (key === 'buttonFill') appearanceUpdates.button_fill = val as any;
            else if (key === 'buttonShadow') appearanceUpdates.button_shadow = val as any;
            else (appearanceUpdates as any)[key] = val;
         }
      });

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
         try {
            if (Object.keys(profileUpdates).length > 0) {
               await updateProfile(user.id, profileUpdates);
            }
            if (Object.keys(appearanceUpdates).length > 0) {
               await updateAppearance(user.id, appearanceUpdates);
            }
         } catch (error) {
            toast.error('Failed to save settings');
         }
      }, 1000);
   };

   const renderView = () => {
      switch (currentView) {
         case 'links':
            return <LinksView
               links={links}
               onAdd={handleCreateLink}
               onDelete={handleDeleteLink}
               onUpdate={handleUpdateLink}
            />;
         case 'appearance':
            return <AppearanceView
               config={profileConfig}
               onUpdate={handleUpdateConfig}
            />;
         case 'analytics':
            return <AnalyticsView />;
         case 'settings':
            return <SettingsView />;
         default:
            return <LinksView
               links={links}
               onAdd={handleCreateLink}
               onDelete={handleDeleteLink}
               onUpdate={handleUpdateLink}
            />;
      }
   };

   const handleNav = (view: ViewState) => {
      setCurrentView(view);
      setIsMobileMenuOpen(false);
   };

   return (
      <div className="min-h-screen bg-background text-primary flex">
         {/* Desktop Sidebar */}
         <aside className="w-64 border-r border-border hidden lg:flex flex-col p-6 fixed h-full bg-background z-20">
            <div className="mb-8 px-2 flex justify-between items-center">
               <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
                  LYNKR
               </Link>
               <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-surfaceHighlight text-secondary hover:text-primary transition-colors"
               >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
               </button>
            </div>

            <nav className="space-y-2 flex-1">
               <SidebarItem icon={Layers} label="Links" active={currentView === 'links'} onClick={() => setCurrentView('links')} />
               <SidebarItem icon={Palette} label="Appearance" active={currentView === 'appearance'} onClick={() => setCurrentView('appearance')} />
               <SidebarItem icon={BarChart3} label="Analytics" active={currentView === 'analytics'} onClick={() => setCurrentView('analytics')} />
               <SidebarItem icon={Settings} label="Settings" active={currentView === 'settings'} onClick={() => setCurrentView('settings')} />
            </nav>

            <div className="mt-auto pt-6 border-t border-border">
               <div onClick={handleLogout} className="flex items-center gap-3 px-2 group cursor-pointer hover:bg-surfaceHighlight p-2 rounded-xl transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">AR</div>
                  <div className="flex-1 overflow-hidden">
                     <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">Alex Rivera</p>
                     <p className="text-xs text-secondary truncate">Free Plan</p>
                  </div>
                  <LogOut className="w-4 h-4 text-red-500" />
               </div>
            </div>
         </aside>

         {/* Mobile Sidebar (Slide Over) */}
         {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
               <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
               <div className="absolute left-0 top-0 h-full w-64 bg-surface border-r border-border p-6 flex flex-col animate-slide-right">
                  <div className="mb-8 px-2 flex justify-between items-center">
                     <Link to="/" className="text-xl font-bold tracking-tight">LYNKR</Link>
                     <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-6 h-6 text-secondary" /></button>
                  </div>
                  <nav className="space-y-2 flex-1">
                     <SidebarItem icon={Layers} label="Links" active={currentView === 'links'} onClick={() => handleNav('links')} />
                     <SidebarItem icon={Palette} label="Appearance" active={currentView === 'appearance'} onClick={() => handleNav('appearance')} />
                     <SidebarItem icon={BarChart3} label="Analytics" active={currentView === 'analytics'} onClick={() => handleNav('analytics')} />
                     <SidebarItem icon={Settings} label="Settings" active={currentView === 'settings'} onClick={() => handleNav('settings')} />
                  </nav>
                  <div className="border-t border-border pt-4 mt-auto">
                     <div className="flex items-center justify-between px-2 mb-4">
                        <span className="text-sm font-medium text-secondary">Theme</span>
                        <button
                           onClick={toggleTheme}
                           className="p-2 rounded-lg bg-surfaceHighlight text-primary"
                        >
                           {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                     </div>
                     <div onClick={handleLogout} className="flex items-center gap-3 px-2 cursor-pointer group hover:bg-surfaceHighlight/50 p-2 rounded-xl transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">AR</div>
                        <div className="flex-1 overflow-hidden">
                           <p className="text-sm font-medium truncate">Alex Rivera</p>
                           <p className="text-xs text-secondary truncate">Free Plan</p>
                        </div>
                        <LogOut className="w-4 h-4 text-red-500" />
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Main Content */}
         <main className="flex-1 lg:ml-64 flex flex-col overflow-hidden h-screen bg-background/50 relative">

            {/* Top Header */}
            <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-surface/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
               <div className="flex items-center gap-3">
                  <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-secondary hover:text-primary">
                     <Menu className="w-6 h-6" />
                  </button>
                  <h1 className="font-semibold text-lg capitalize">{currentView}</h1>
               </div>
               <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surfaceHighlight border border-border text-xs text-secondary hover:border-primary/30 transition-colors cursor-pointer group">
                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                     <span className="max-w-[100px] truncate">lynkr.com/alex</span>
                     <Copy className="w-3 h-3 ml-2 group-hover:text-primary" />
                  </div>
                  <Button variant="secondary" size="sm" className="hidden sm:flex">
                     <Share2 className="w-4 h-4 mr-2" /> Share
                  </Button>
               </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full scrollbar-hide">
               {renderView()}
            </div>

            {/* Live Preview Sidebar - Only visible for Links and Appearance on LARGE screens */}
            {(currentView === 'links' || currentView === 'appearance') && (
               <aside className="fixed right-0 top-0 h-full w-[420px] border-l border-border bg-surface hidden xl:flex flex-col items-center justify-center pt-20 pb-8 px-8 transition-all duration-500 z-20">
                  <div className="absolute top-6 right-6 z-30 pt-16">
                     <Button variant="ghost" size="sm" className="text-secondary hover:text-primary">
                        <ExternalLink className="w-4 h-4 mr-2" /> Open
                     </Button>
                  </div>

                  <h3 className="absolute top-24 text-sm font-medium text-secondary uppercase tracking-widest pt-4">Live Preview</h3>

                  <div className="scale-[0.85] origin-center transition-all duration-300 hover:scale-[0.87] mt-8">
                     <PhonePreview links={links} config={profileConfig} />
                  </div>
               </aside>
            )}

            {/* Adjust main content margin when preview sidebar is visible */}
            <style>{`
          @media (min-width: 1280px) {
            main { padding-right: ${(currentView === 'links' || currentView === 'appearance') ? '420px' : '0'} !important; }
          }
        `}</style>

            {/* Mobile Preview Toggle Button (Visible on mobile only for relevant tabs) */}
            {(currentView === 'links' || currentView === 'appearance') && (
               <div className="fixed bottom-6 right-6 xl:hidden z-30">
                  <Button className="rounded-full w-14 h-14 shadow-2xl flex items-center justify-center p-0 bg-primary text-background">
                     <Eye className="w-8 h-8" />
                  </Button>
               </div>
            )}

         </main>
      </div>
   );
};

export default Dashboard;