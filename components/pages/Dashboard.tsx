import React, { useState, useEffect } from 'react';
import {
   Layers,
   BarChart3,
   Settings,
   Palette,
   Plus,
   Pencil,
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
   Camera,
   Twitter,
   Instagram,
   Linkedin,
   Facebook,
   Youtube,
   Github,
   Mail,
   Lock
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// Drag & Drop Imports
import {
   DndContext,
   closestCenter,
   KeyboardSensor,
   PointerSensor,
   useSensor,
   useSensors,
   DragEndEvent,
} from '@dnd-kit/core';
import {
   arrayMove,
   SortableContext,
   sortableKeyboardCoordinates,
   verticalListSortingStrategy,
   useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import {
   fetchUserProfile,
   fetchUserLinks,
   fetchAppearanceSettings,
   createLink,
   updateLink as updateLinkInDb,
   deleteLink as deleteLinkFromDb,
   updateProfile,
   updateAppearance,
   uploadImage,
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
   clicks_count: number;
   position: number;
   thumbnail_url?: string;
}

interface ProfileConfig {
   username: string;
   bio: string;
   avatar: string;
   coverImage: string;
   plan?: string;
   is_active?: boolean;
   theme: 'simple' | 'dark' | 'midnight' | 'sunset' | 'ocean' | 'forest' | 'pastel' | 'retro' | 'mint' | 'air' | 'custom';
   customThemeUrl?: string; // New field
   fontColor: string; // 'auto' | '#000000' | '#ffffff'
   buttonStyle: 'rounded' | 'square' | 'pill' | 'hard';
   buttonFill: 'solid' | 'outline' | 'ghost';
   buttonShadow: 'none' | 'soft' | 'hard';
   font: 'sans' | 'serif' | 'mono' | 'montserrat' | 'lato' | 'oswald' | 'playfair' | 'outfit';
   seoTitle?: string;
   seoDescription?: string;
   showBrandTag: boolean;
}

// -- Mock Data --
const initialLinks: LinkItem[] = [];

const themes = {
   simple: "bg-gray-100 text-gray-900",
   dark: "bg-black text-white",
   midnight: "bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white",
   sunset: "bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 text-white",
   ocean: "bg-gradient-to-b from-cyan-500 to-blue-600 text-white",
   forest: "bg-gradient-to-b from-emerald-800 to-green-900 text-white",
   pastel: "bg-gradient-to-tr from-rose-100 to-teal-100 text-zinc-800", // New: Pastel
   retro: "bg-[#f4e4bc] text-[#2c3e50]", // New: Retro
   mint: "bg-gradient-to-b from-emerald-50 to-teal-100 text-teal-900", // New: Mint
   air: "bg-gradient-to-b from-slate-50 to-blue-100 text-slate-800", // New: Air
   custom: "bg-black text-white bg-cover bg-center" // Placeholder for custom
};

const buttonStyles = {
   rounded: "rounded-xl",
   square: "rounded-none",
   pill: "rounded-full",
   hard: "rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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

   // Define which themes are "Light Mode" (requiring dark text)
   const lightThemes = ['simple', 'pastel', 'retro', 'mint', 'air'];
   const isLight = lightThemes.includes(config.theme);
   const isDarkTheme = !isLight;

   // Font Color Logic (Override > Theme Default)
   // Now applies GLOBALLY to buttons as well if set
   let textColorClass = isLight ? 'text-zinc-900' : 'text-white shadow-black/50 drop-shadow-md';
   let customTextStyle = {};
   let forceLightMode = isLight; // Default to theme

   if (config.fontColor && config.fontColor !== 'auto') {
      textColorClass = ''; // Clear default class if overriding
      customTextStyle = { color: config.fontColor };

      // Force button logic based on text color choice
      // If White Text, implies Dark Mode (Light Buttons)
      // If Black Text, implies Light Mode (Dark Buttons)
      if (config.fontColor === '#ffffff') {
         textColorClass = 'shadow-black/50 drop-shadow-md';
         forceLightMode = false;
      } else {
         forceLightMode = true;
      }
   }

   // Dynamic Button Class Construction
   let btnClasses = `${btnShapeClass} w-full p-4 text-center text-sm font-medium transition-all cursor-pointer mb-3 `;

   // Fill Style
   // Buttons now respect the FORCED mode (from font color) if set
   if (config.buttonFill === 'solid') {
      btnClasses += forceLightMode ? 'bg-black text-white ' : 'bg-white text-black ';
   } else if (config.buttonFill === 'outline') {
      btnClasses += forceLightMode ? 'border-2 border-black text-black hover:bg-black/5 ' : 'border-2 border-white text-white hover:bg-white/10 ';
   } else if (config.buttonFill === 'ghost') {
      btnClasses += forceLightMode ? 'bg-black/5 hover:bg-black/10 text-black ' : 'bg-white/10 backdrop-blur-md hover:bg-white/20 text-white ';
   }

   // Shadow Style
   if (config.buttonShadow === 'soft') {
      btnClasses += 'shadow-lg ';
   } else if (config.buttonShadow === 'hard') {
      btnClasses += 'border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ';
      if (isDarkTheme) btnClasses += 'border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] ';
   }

   // Custom Theme Background Handling
   const customStyle = config.theme === 'custom' && (config as any).customThemeUrl
      ? { backgroundImage: `url(${(config as any).customThemeUrl})` }
      : {};

   const finalContainerStyle = { ...customStyle, ...customTextStyle };

   // Font Family Mapping
   const fontMap: Record<string, string> = {
      sans: 'font-sans',
      serif: 'font-serif',
      mono: 'font-mono tracking-tight',
      montserrat: 'font-montserrat',
      lato: 'font-lato',
      oswald: 'font-oswald tracking-wide',
      playfair: 'font-serif', // Playfair is our serif override in config but let's be safe
      outfit: 'font-outfit'
   };
   const fontClass = fontMap[config.font] || 'font-sans';

   // Social Icon Helper
   const getSocialIcon = (url: string) => {
      try {
         const lower = url.toLowerCase();
         if (lower.includes('twitter.com') || lower.includes('x.com')) return <Twitter className="w-4 h-4" />;
         if (lower.includes('instagram.com')) return <Instagram className="w-4 h-4" />;
         if (lower.includes('linkedin.com')) return <Linkedin className="w-4 h-4" />;
         if (lower.includes('facebook.com')) return <Facebook className="w-4 h-4" />;
         if (lower.includes('youtube.com')) return <Youtube className="w-4 h-4" />;
         if (lower.includes('github.com')) return <Github className="w-4 h-4" />;
         if (lower.includes('mailto:')) return <Mail className="w-4 h-4" />;

         // Generic Favicon Fallback for personal sites
         let domain = url;
         try {
            const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
            domain = urlObj.hostname;
         } catch (e) { return null; }

         return <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
            className="w-4 h-4 rounded-sm grayscale opacity-75 group-hover:opacity-100 group-hover:grayscale-0 transition-all"
            alt="icon"
         />;
      } catch (e) { return null; }
   };

   return (
      <div className={`relative w-[300px] h-[600px] bg-black border-[8px] border-zinc-800 rounded-[3rem] shadow-2xl overflow-hidden ring-4 ring-black/5 ${fontClass}`}>
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-xl z-20"></div>

         <div
            className={`w-full h-full flex flex-col overflow-y-auto transition-all duration-500 ${themeClass} scrollbar-hide`}
            style={finalContainerStyle}
         >
            {/* Cover Image - Render only if exists */}
            {config.coverImage ? (
               <div className="h-32 w-full shrink-0 relative">
                  <img src={config.coverImage} alt="Cover" className="w-full h-full object-cover" />
               </div>
            ) : (
               <div className="h-20 w-full shrink-0"></div> // Spacer when no cover
            )}

            <div className={`p-6 flex flex-col items-center -mt-12 relative z-10 ${textColorClass}`}>
               <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden mb-4 bg-surface">
                  <img
                     src={config.avatar || '/defaultavatar.jpg'}
                     alt="Avatar"
                     className="w-full h-full object-cover"
                  />
               </div>

               <h2 className="text-xl font-bold mb-1">{config.username}</h2>
               <p className="text-center text-sm opacity-90 mb-6 leading-relaxed">
                  {config.bio}
               </p>

               <div className="w-full space-y-3">
                  {links.filter(l => l.active).map(link => (
                     <div key={link.id} className={`${btnClasses} group transform-gpu`}>
                        <div className="flex items-center justify-center gap-3 w-full">
                           {link.thumbnail_url ? (
                              <div className="shrink-0 w-6 h-6 rounded-md overflow-hidden flex items-center justify-center">
                                 <img src={link.thumbnail_url} alt="" className="w-full h-full object-cover" />
                              </div>
                           ) : getSocialIcon(link.url) ? (
                              <div className="shrink-0 flex items-center justify-center">
                                 {getSocialIcon(link.url)}
                              </div>
                           ) : null}
                           <span className="truncate max-w-[180px]">{link.title}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {config.showBrandTag && (
               <div className="mt-auto pt-4 flex justify-center opacity-70 pb-6">
                  <div className="flex items-center gap-2">
                     <span className="font-bold tracking-widest text-sm uppercase">LYNKR</span>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

// -- Main View Components --

const SortableLinkItem: React.FC<{
   link: LinkItem;
   onDelete: (id: string) => void;
   onUpdate: (id: string, updates: Partial<LinkItem>) => void;
}> = ({ link, onDelete, onUpdate }) => {
   const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
   } = useSortable({ id: link.id });

   const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 50 : 'auto',
      opacity: isDragging ? 0.3 : 1,
      touchAction: 'none'
   };

   return (
      <div
         ref={setNodeRef}
         style={style}
               className="group bg-surface border border-border rounded-2xl p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-md"
            >
               <div className="flex items-start gap-3">
                  <div
                     {...attributes}
               {...listeners}
               className="mt-4 cursor-grab active:cursor-grabbing text-secondary hover:text-primary p-1 rounded-md hover:bg-surfaceHighlight transition-colors"
            >
               <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex-1 space-y-3 min-w-0">
               <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                     <div className="relative group/field">
                        <input
                           type="text"
                           value={link.title}
                           onChange={(e) => onUpdate(link.id, { title: e.target.value })}
                           className="w-full bg-transparent border-none p-0 text-base font-semibold text-primary focus:ring-0 placeholder-zinc-500 truncate pr-6"
                           placeholder="Link Title"
                        />
                        <Pencil className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 text-secondary opacity-0 group-hover/field:opacity-50 transition-opacity pointer-events-none" />
                     </div>
                     <div className="relative group/field mt-1">
                        <input
                           type="text"
                           value={link.url}
                           onChange={(e) => onUpdate(link.id, { url: e.target.value })}
                           className="w-full bg-transparent border-none p-0 text-sm text-secondary focus:ring-0 placeholder-zinc-600 truncate pr-6"
                           placeholder="https://url..."
                        />
                        <Pencil className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 text-secondary opacity-0 group-hover/field:opacity-50 transition-opacity pointer-events-none" />
                     </div>
                  </div>
               <div className="flex items-center gap-2 shrink-0">
                     <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border border-border bg-surfaceHighlight text-secondary">
                        <Layers className="w-3 h-3" /> Link
                     </span>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={link.active} onChange={() => onUpdate(link.id, { active: !link.active })} className="sr-only peer" />
                        <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                     </label>
                  </div>
               </div>

               <div className="flex flex-wrap items-center justify-between pt-3 border-t border-border/50 gap-2">
                  <div className="flex gap-2">
                     <div className="flex items-center gap-1">
                        <button
                           onClick={() => document.getElementById(`thumb-upload-${link.id}`)?.click()}
                           className={`p-2 rounded-lg hover:bg-surfaceHighlight transition-colors ${link.thumbnail_url ? 'text-primary bg-primary/10' : 'text-secondary hover:text-primary'}`}
                           title={link.thumbnail_url ? "Change Thumbnail" : "Add Thumbnail"}
                        >
                           <ImageIcon className="w-4 h-4" />
                        </button>
                        {link.thumbnail_url && (
                           <button
                              onClick={() => onUpdate(link.id, { thumbnail_url: null } as any)}
                              className="p-1 rounded-md hover:bg-red-500/10 text-secondary hover:text-red-500 transition-colors"
                              title="Remove Thumbnail"
                           >
                              <Trash2 className="w-3.5 h-3.5" />
                           </button>
                        )}
                     </div>

                     {/* Clicks Badge */}
                     <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surfaceHighlight border border-border text-[10px] font-bold text-secondary uppercase tracking-wider group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all">
                        <BarChart3 className="w-3 h-3" />
                        <span>{link.clicks_count || 0} Clicks</span>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-secondary">
                     <button
                        onClick={() => onDelete(link.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-secondary hover:text-red-500 transition-colors"
                        title="Delete Link"
                     >
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
               </div>

               <input
                  id={`thumb-upload-${link.id}`}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                     const file = e.target.files?.[0];
                     if (file) onUpdate(link.id, { thumbnailFile: file } as any);
                  }}
               />
            </div>
         </div>
      </div>
   );
};

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
            <button
               onClick={onAdd}
               className="relative w-full h-14 rounded-2xl font-bold tracking-wide transition-all duration-300
               bg-zinc-900 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.5)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_10px_30px_rgba(0,0,0,0.7)] hover:-translate-y-0.5
               dark:bg-white dark:text-black dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_35px_rgba(255,255,255,0.5)]
               flex items-center justify-center gap-2 group overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-shimmer z-10 pointer-events-none"></div>
               <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300 relative z-20" />
               <span className="relative z-20">ADD NEW LINK</span>
            </button>
         </div>

         <div className="space-y-4">
            <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
               {links.map((link) => (
                  <SortableLinkItem
                     key={link.id}
                     link={link}
                     onDelete={onDelete}
                     onUpdate={onUpdate}
                  />
               ))}
            </SortableContext>
         </div>
      </div>
   );
};

const AppearanceView: React.FC<{
   config: ProfileConfig,
   onUpdate: (updates: Partial<ProfileConfig> | { avatar?: File, coverImage?: File, customTheme?: File }) => void
}> = ({ config, onUpdate }) => {
   // Refs for file inputs
   const avatarInputRef = React.useRef<HTMLInputElement>(null);
   const coverInputRef = React.useRef<HTMLInputElement>(null);
   const themeInputRef = React.useRef<HTMLInputElement>(null);

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
                  <div className="group relative h-40 w-full bg-surfaceHighlight rounded-xl overflow-hidden border border-border">
                     {config.coverImage && (
                        <img src={config.coverImage} alt="Cover" className="w-full h-full object-cover" />
                     )}
                  </div>
                  <div className="flex gap-3 mt-3">
                     <Button variant="secondary" size="sm" onClick={() => coverInputRef.current?.click()}>
                        <Camera className="w-4 h-4 mr-2" /> Change Cover
                     </Button>
                     <input
                        ref={coverInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                           const file = e.target.files?.[0];
                           if (file) onUpdate({ coverImage: file });
                        }}
                     />

                     {config.coverImage && (
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => onUpdate({ coverImage: '' as any })}>
                           Remove
                        </Button>
                     )}
                  </div>
               </div>

               <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
                  <div className="flex flex-col items-center gap-3 shrink-0">
                     <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-surfaceHighlight">
                        <img
                           src={config.avatar || '/defaultavatar.jpg'}
                           alt="Avatar"
                           className="w-full h-full object-cover"
                        />
                     </div>
                     <Button variant="secondary" size="sm" className="w-full" onClick={() => avatarInputRef.current?.click()}>
                        <Upload className="w-4 h-4 mr-2" /> Upload
                     </Button>
                     <input
                        ref={avatarInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                           const file = e.target.files?.[0];
                           if (file) onUpdate({ avatar: file });
                        }}
                     />
                  </div>

                  <div className="flex-1 space-y-4 w-full">
                     <div className="hidden md:block h-8"></div> {/* Spacer for alignment */}
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
               {Object.keys(themes).filter(t => t !== 'custom').map((themeKey) => (
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
                        {themeKey === 'simple' ? 'Light' : themeKey}
                     </div>
                  </div>
               ))}

               {/* Custom Theme Card */}
               <div
                  onClick={() => {
                     onUpdate({ theme: 'custom' });
                     // If no image set, trigger upload
                     if (!config.customThemeUrl) {
                        themeInputRef.current?.click();
                     }
                  }}
                  className={`cursor-pointer group relative rounded-xl border-2 overflow-hidden transition-all ${config.theme === 'custom' ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : 'border-dashed border-border hover:border-primary/50'}`}
               >
                  <div
                     className={`h-32 w-full p-4 flex flex-col items-center justify-center gap-2 bg-zinc-900`}
                     style={config.customThemeUrl ? { backgroundImage: `url(${config.customThemeUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                  >
                     {!config.customThemeUrl && (
                        <>
                           <ImageIcon className="w-8 h-8 text-secondary mb-1" />
                           <span className="text-xs text-secondary font-medium">Upload Image</span>
                        </>
                     )}

                     {/* Overlay Edit Button if selected */}
                     {config.theme === 'custom' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); themeInputRef.current?.click(); }}>
                              Change Image
                           </Button>
                        </div>
                     )}
                  </div>
                  <div className="p-3 bg-surface text-center text-sm font-medium capitalize">
                     Custom
                  </div>
                  <input
                     ref={themeInputRef}
                     type="file"
                     className="hidden"
                     accept="image/*"
                     onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onUpdate({ customTheme: file });
                     }}
                  />
               </div>
            </div>
         </section>

         <section className="space-y-4">
            <h3 className="font-semibold text-lg">Branding</h3>
            <div className="bg-surface border border-border rounded-2xl p-6 flex items-center justify-between">
               <div>
                  <h4 className="font-medium mb-1">Show LYNKR Branding</h4>
                  <p className="text-xs text-secondary">Display the LYNKR logo at the bottom of your page.</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                  <input
                     type="checkbox"
                     checked={config.showBrandTag}
                     onChange={() => onUpdate({ showBrandTag: !config.showBrandTag })}
                     className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
               </label>
            </div>
         </section>

         <section className="space-y-4">
            <h3 className="font-semibold text-lg">Font Color</h3>
            <div className="flex gap-4">
               <button
                  onClick={() => onUpdate({ fontColor: 'auto' })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${!config.fontColor || config.fontColor === 'auto' ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                     }`}
               >
                  Auto
               </button>
               <button
                  onClick={() => onUpdate({ fontColor: '#ffffff' })}
                  className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center bg-white shadow-md ${config.fontColor === '#ffffff' ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-zinc-200'
                     }`}
                  title="White Text"
               ></button>
               <button
                  onClick={() => onUpdate({ fontColor: '#000000' })}
                  className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center bg-black shadow-md ${config.fontColor === '#000000' ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-zinc-700'
                     }`}
                  title="Black Text"
               ></button>
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
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                     { id: 'sans', name: 'Inter', class: 'font-sans' },
                     { id: 'serif', name: 'Playfair', class: 'font-serif' },
                     { id: 'mono', name: 'Fira Code', class: 'font-mono' },
                     { id: 'montserrat', name: 'Montserrat', class: 'font-montserrat' },
                     { id: 'lato', name: 'Lato', class: 'font-lato' },
                     { id: 'oswald', name: 'Oswald', class: 'font-oswald' },
                     { id: 'outfit', name: 'Outfit', class: 'font-outfit' },
                  ].map((font) => (
                     <button
                        key={font.id}
                        onClick={() => onUpdate({ font: font.id as any })}
                        className={`p-4 border rounded-xl text-center transition-all ${config.font === font.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-surfaceHighlight'}`}
                     >
                        <span className={`text-2xl font-bold block mb-2 ${font.class}`}>Aa</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary">{font.name}</span>
                     </button>
                  ))}
               </div>
            </div>
         </section>
      </div>
   );
};

// ... (No changes to AnalyticsView, SettingsView, etc. until Dashboard Component)

const AnalyticsView: React.FC = () => {
   return (
      <div className="max-w-4xl mx-auto w-full h-[60vh] flex flex-col items-center justify-center animate-slide-up text-center space-y-4">
         <div className="w-16 h-16 bg-surfaceHighlight border border-border rounded-2xl flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-secondary" />
         </div>
         <h2 className="text-3xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">Analytics Coming Soon</h2>
         <p className="text-secondary max-w-sm">
            We're building advanced tracking for your links, referral sources, and geographic data. Stay tuned!
         </p>
         <div className="pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-xs font-semibold text-primary">
               <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
               In Development
            </div>
         </div>
      </div>
   );
};

const SettingsView: React.FC<{
   user: any,
   profileConfig: ProfileConfig,
   onUpdate: (updates: Partial<ProfileConfig>) => void
}> = ({ user, profileConfig, onUpdate }) => {
   const [localSeo, setLocalSeo] = useState({
      title: profileConfig.seoTitle || '',
      description: profileConfig.seoDescription || ''
   });
   const [isSaving, setIsSaving] = useState(false);

   // Sync local state if profileConfig updates from elsewhere
   useEffect(() => {
      setLocalSeo({
         title: profileConfig.seoTitle || '',
         description: profileConfig.seoDescription || ''
      });
   }, [profileConfig.seoTitle, profileConfig.seoDescription]);

   const handleSaveSeo = async () => {
      setIsSaving(true);
      await onUpdate({
         seoTitle: localSeo.title,
         seoDescription: localSeo.description
      });
      setIsSaving(false);
      toast.success('SEO settings saved');
   };
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
                        <label className="text-xs font-semibold text-secondary uppercase mb-1 block">Username</label>
                        <input type="text" defaultValue={profileConfig.username || (user?.user_metadata?.username)} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm" />
                     </div>
                     <div>
                        <label className="text-xs font-semibold text-secondary uppercase mb-1 block">Email</label>
                        <input type="email" defaultValue={user?.email || 'user@example.com'} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm" />
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
                  <div className="space-y-4">
                     <div>
                        <label className="text-xs font-semibold text-secondary uppercase mb-1 block">Meta Title</label>
                        <input
                           type="text"
                           placeholder="Title that shows in Google"
                           value={localSeo.title}
                           onChange={(e) => setLocalSeo(prev => ({ ...prev, title: e.target.value }))}
                           className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                     </div>
                     <div>
                        <label className="text-xs font-semibold text-secondary uppercase mb-1 block">Meta Description</label>
                        <textarea
                           rows={2}
                           placeholder="Description for search engines"
                           value={localSeo.description}
                           onChange={(e) => setLocalSeo(prev => ({ ...prev, description: e.target.value }))}
                           className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm resize-none focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                     </div>
                     <div className="pt-2">
                        <Button
                           onClick={handleSaveSeo}
                           disabled={isSaving}
                           className="w-full sm:w-auto"
                        >
                           {isSaving ? 'Saving...' : 'Save SEO Settings'}
                        </Button>
                     </div>
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
   const debounceRef = React.useRef<NodeJS.Timeout | null>(null);
   const contentRef = React.useRef<HTMLDivElement | null>(null);

   // -- Delete Modal State --
   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
   const [linkToDelete, setLinkToDelete] = useState<string | null>(null);

   const [profileConfig, setProfileConfig] = useState<ProfileConfig>({
      username: '',
      bio: '',
      avatar: '/defaultavatar.jpg',
      coverImage: '',
      plan: undefined,
      is_active: true,
      theme: 'simple',
      fontColor: 'auto',
      buttonStyle: 'rounded',
      buttonFill: 'solid',
      buttonShadow: 'none',
      font: 'sans',
      seoTitle: '',
      seoDescription: '',
      showBrandTag: true
   });

   // DnD Sensors
   const sensors = useSensors(
      useSensor(PointerSensor, {
         activationConstraint: {
            distance: 8,
         },
      }),
      useSensor(KeyboardSensor, {
         coordinateGetter: sortableKeyboardCoordinates,
      })
   );

   const handleReorderLinks = async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = links.findIndex((l) => l.id === active.id);
      const newIndex = links.findIndex((l) => l.id === over.id);

      const newLinks = arrayMove(links, oldIndex, newIndex);
      setLinks(newLinks);

      // Save new positions to DB
      try {
         const updates = newLinks.map((link, index) => ({
            id: link.id,
            position: index
         }));

         // Parallel updates for performance
         await Promise.all(updates.map(u => updateLinkInDb(u.id, { position: u.position } as any)));
      } catch (error) {
         toast.error('Failed to save new order');
      }
   };

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
               if (profile.is_active === false) {
                  toast.error('Your account has been deactivated.');
                  await signOut();
                  navigate('/login');
                  return;
               }
               setProfileConfig(prev => ({
                  ...prev,
                  username: profile.username,
                  bio: profile.bio || prev.bio,
                  avatar: (profile.avatar_url && !profile.avatar_url.includes('unsplash.com')) ? profile.avatar_url : '/defaultavatar.jpg',
                  coverImage: (profile.cover_image_url && !profile.cover_image_url.includes('unsplash.com')) ? profile.cover_image_url : '',
                  plan: profile.plan,
                  is_active: profile.is_active
               }));
            } else {
               // If profile is missing (deleted), log out
               await signOut();
               navigate('/login');
               return;
            }

            // 2. Set Appearance
            if (settings) {
               setProfileConfig(prev => ({
                  ...prev,
                  theme: settings.theme,
                  customThemeUrl: settings.custom_theme_url || undefined,
                  fontColor: settings.font_color || 'auto',
                  buttonStyle: settings.button_style,
                  buttonFill: settings.button_fill,
                  buttonShadow: settings.button_shadow,
                  font: settings.font as any,
                  seoTitle: settings.seo_title || '',
                  seoDescription: settings.seo_description || '',
                  showBrandTag: settings.show_brand_tag ?? true,
               }));
            }

            // 3. Set Links
            if (userLinks) {
               setLinks(userLinks.sort((a, b) => (a.position || 0) - (b.position || 0)).map(l => ({
                  id: l.id,
                  title: l.title,
                  url: l.url,
                  active: l.active,
                  clicks_count: l.clicks_count || 0,
                  position: l.position || 0,
                  thumbnail_url: l.thumbnail_url
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
         clicks_count: 0,
         position: newPosition,
         thumbnail_url: undefined
      };
      setLinks([...links, optimisticLink]); // Add to bottom to match newPosition logic

      // Smoothly scroll to the newest link so it’s immediately visible
      requestAnimationFrame(() => {
         const scroller = contentRef.current;
         if (scroller) {
            scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
         } else {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
         }
      });

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

   const handleUpdateLink = async (id: string, updates: Partial<LinkItem> | { thumbnailFile: File }) => {
      // 1. Handle Thumbnail Removal
      if ('thumbnail_url' in updates && (updates as any).thumbnail_url === null) {
         try {
            await updateLinkInDb(id, { thumbnail_url: null } as any);
            setLinks(prev => prev.map(l => l.id === id ? { ...l, thumbnail_url: undefined } : l));
            toast.success('Thumbnail removed');
         } catch (e) {
            toast.error('Failed to remove thumbnail');
         }
         return;
      }

      // 2. Handle Thumbnail Upload
      if ('thumbnailFile' in updates && (updates as any).thumbnailFile instanceof File) {
         try {
            toast.loading('Uploading thumbnail...', { id: 'link-thumb' });
            const url = await uploadImage((updates as any).thumbnailFile, 'links', user?.id || '');
            if (url) {
               await updateLinkInDb(id, { thumbnail_url: url });
               setLinks(prev => prev.map(l => l.id === id ? { ...l, thumbnail_url: url } : l));
               toast.success('Thumbnail updated', { id: 'link-thumb' });
            }
         } catch (e) {
            toast.error('Failed to upload thumbnail', { id: 'link-thumb' });
         }
         return;
      }

      // 3. Optimistic Update (for text fields)
      setLinks(currentLinks => currentLinks.map(l =>
         l.id === id ? { ...l, ...updates } : l
      ));

      // 4. Debounced API Call for regular updates
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
         try {
            await updateLinkInDb(id, updates as Partial<SupabaseLink>);
         } catch (error) {
            toast.error('Failed to save changes');
         }
      }, 500);
   };

   const handleDeleteClick = (id: string) => {
      setLinkToDelete(id);
      setDeleteModalOpen(true);
   };

   const confirmDeleteLink = async () => {
      if (!linkToDelete) return;

      const originalLinks = [...links];
      setLinks(links.filter(l => l.id !== linkToDelete));

      try {
         await deleteLinkFromDb(linkToDelete);
         toast.success('Link deleted');
      } catch (error) {
         toast.error('Failed to delete link');
         setLinks(originalLinks);
      } finally {
         setDeleteModalOpen(false);
         setLinkToDelete(null);
      }
   };

   const handleUpdateConfig = async (updates: Partial<ProfileConfig> | { avatar?: File, coverImage?: File }) => {
      if (!user) return;

      // Handle File Uploads first
      if ('avatar' in updates && updates.avatar instanceof File) {
         try {
            const url = await uploadImage(updates.avatar, 'avatars', user.id);
            if (url) {
               setProfileConfig(prev => ({ ...prev, avatar: url })); // Optimistic UI
               await updateProfile(user.id, { avatar_url: url });
               toast.success('Avatar updated');
            }
         } catch (e) { toast.error('Failed to upload avatar'); }
         return; // Stop here, don't fallback to regular update logic for files
      }

      if ('coverImage' in updates && updates.coverImage instanceof File) {
         try {
            const url = await uploadImage(updates.coverImage, 'covers', user.id);
            if (url) {
               setProfileConfig(prev => ({ ...prev, coverImage: url }));
               await updateProfile(user.id, { cover_image_url: url });
               toast.success('Cover image updated');
            }
         } catch (e) { toast.error('Failed to upload cover'); }
         return;
      }

      if ('customTheme' in updates && updates.customTheme instanceof File) {
         try {
            const url = await uploadImage(updates.customTheme, 'covers', user.id); // Reusing buckets
            if (url) {
               setProfileConfig(prev => ({ ...prev, theme: 'custom', customThemeUrl: url }));
               await updateAppearance(user.id, { theme: 'custom', custom_theme_url: url });
               toast.success('Custom theme updated');
            }
         } catch (e) { toast.error('Failed to upload theme image'); }
         return;
      }

      // Regular updates (text/boolean)
      let cleanedUpdates = { ...updates };
      if ('username' in cleanedUpdates && typeof cleanedUpdates.username === 'string') {
         cleanedUpdates.username = cleanedUpdates.username.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9-_]/g, '');
      }

      // 1. Optimistic Update
      setProfileConfig(prev => ({ ...prev, ...(cleanedUpdates as Partial<ProfileConfig>) }));

      // ... existing debounce logic ...
      const profileFields = ['username', 'bio', 'avatar', 'coverImage'];
      const appearanceFields = ['theme', 'buttonStyle', 'buttonFill', 'buttonShadow', 'font', 'customThemeUrl', 'fontColor', 'seoTitle', 'seoDescription', 'showBrandTag'];

      const profileUpdates: Partial<Profile> = {};
      const appearanceUpdates: Partial<AppearanceSettings> = {};

      Object.entries(cleanedUpdates).forEach(([key, val]) => {
         if (profileFields.includes(key)) {
            if (key === 'coverImage') profileUpdates.cover_image_url = val as string;
            else if (key === 'avatar') profileUpdates.avatar_url = val as string;
            else (profileUpdates as any)[key] = val;
         }
         else if (appearanceFields.includes(key)) {
            if (key === 'buttonStyle') appearanceUpdates.button_style = val as any;
            else if (key === 'buttonFill') appearanceUpdates.button_fill = val as any;
            else if (key === 'buttonShadow') appearanceUpdates.button_shadow = val as any;
            else if (key === 'customThemeUrl') appearanceUpdates.custom_theme_url = val as string;
            else if (key === 'fontColor') appearanceUpdates.font_color = val as string;
            else if (key === 'seoTitle') appearanceUpdates.seo_title = val as string;
            else if (key === 'seoDescription') appearanceUpdates.seo_description = val as string;
            else if (key === 'showBrandTag') appearanceUpdates.show_brand_tag = val as boolean;
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

   const getSanitizedUsername = () => {
      return (profileConfig.username || 'user').toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9-_]/g, '');
   };

   const handleCopyLink = () => {
      const url = `${window.location.origin}/${getSanitizedUsername()}`;
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
   };

   const handleShareProfile = async () => {
      const url = `${window.location.origin}/${getSanitizedUsername()}`;
      if (navigator.share) {
         try {
            await navigator.share({
               title: `${profileConfig.username || 'User'}'s LYNKR Profile`,
               url: url,
            });
         } catch (e) { /* ignore cancel */ }
      } else {
         navigator.clipboard.writeText(url);
         toast.success('Profile link copied!');
      }
   };

   const handleOpenProfile = () => {
      window.open(`/${getSanitizedUsername()}`, '_blank');
   };

   const renderView = () => {
      switch (currentView) {
         case 'links':
            return (
               <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleReorderLinks}
               >
                  <LinksView
                     links={links}
                     onAdd={handleCreateLink}
                     onDelete={handleDeleteClick}
                     onUpdate={handleUpdateLink}
                  />
               </DndContext>
            );
         case 'appearance':
            return <AppearanceView
               config={profileConfig}
               onUpdate={handleUpdateConfig}
            />;
         case 'analytics':
            return <AnalyticsView />;
         case 'settings':
            return <SettingsView user={user} profileConfig={profileConfig} onUpdate={handleUpdateConfig} />;
         default:
            return (
               <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleReorderLinks}
               >
                  <LinksView
                     links={links}
                     onAdd={handleCreateLink}
                     onDelete={handleDeleteClick}
                     onUpdate={handleUpdateLink}
                  />
               </DndContext>
            );
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
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                     {profileConfig.avatar && !profileConfig.avatar.includes('unsplash') ? (
                        <img src={profileConfig.avatar} alt="Avatar" className="w-full h-full object-cover" />
                     ) : (
                        profileConfig.username ? profileConfig.username.charAt(0).toUpperCase() : 'U'
                     )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                     <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{profileConfig.username || 'User'}</p>
                     <p className="text-xs text-secondary truncate">{profileConfig.plan ? `${profileConfig.plan.charAt(0).toUpperCase()}${profileConfig.plan.slice(1)} Plan` : 'Plan'}</p>
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
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                           {profileConfig.avatar && !profileConfig.avatar.includes('unsplash') ? (
                              <img src={profileConfig.avatar} alt="Avatar" className="w-full h-full object-cover" />
                           ) : (
                              profileConfig.username ? profileConfig.username.charAt(0).toUpperCase() : 'U'
                           )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                           <p className="text-sm font-medium truncate">{profileConfig.username || 'User'}</p>
                           <p className="text-xs text-secondary truncate">{profileConfig.plan ? `${profileConfig.plan.charAt(0).toUpperCase()}${profileConfig.plan.slice(1)} Plan` : 'Plan'}</p>
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
                  <div
                     onClick={handleCopyLink}
                     className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surfaceHighlight border border-border text-xs text-secondary hover:border-primary/30 transition-colors cursor-pointer group"
                  >
                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                     <span className="max-w-[150px] truncate">/{getSanitizedUsername()}</span>
                     <Copy className="w-3 h-3 ml-2 group-hover:text-primary" />
                  </div>
                  <Button onClick={handleShareProfile} variant="secondary" size="sm" className="hidden sm:flex">
                     <Share2 className="w-4 h-4 mr-2" /> Share
                  </Button>
               </div>
            </header>

            {/* Scrollable Content */}
            <div ref={contentRef} className="flex-1 overflow-y-auto p-4 md:p-8 w-full scrollbar-hide">
               {renderView()}
            </div>

            {/* Live Preview Sidebar - Only visible for Links and Appearance on LARGE screens */}
            {(currentView === 'links' || currentView === 'appearance') && (
               <aside className="fixed right-0 top-0 h-full w-[420px] border-l border-border bg-surface hidden xl:flex flex-col items-center pt-20 pb-8 px-8 transition-all duration-500 z-20">
                  <div className="absolute top-12 left-0 right-0 px-8 flex items-center justify-between">
                     <h3 className="text-sm font-medium text-secondary uppercase tracking-widest">Live Preview</h3>
                     <Button onClick={handleOpenProfile} variant="ghost" size="sm" className="text-secondary hover:text-primary">
                        <ExternalLink className="w-4 h-4 mr-2" /> Open
                     </Button>
                  </div>

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



            <ConfirmationModal
               isOpen={deleteModalOpen}
               onClose={() => setDeleteModalOpen(false)}
               onConfirm={confirmDeleteLink}
               title="Delete Link?"
               message="Are you sure you want to delete this link? This action cannot be undone."
               confirmText="Delete"
               isDestructive={true}
            />

         </main>
      </div>
   );
};

export default Dashboard;
