import React, { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { validateUrl } from "../../utils/validation";
import {
  fetchPublicProfileByUsername,
  fetchPublicLinksByUserId,
  trackLinkClick,
  Link as LinkItem,
  Profile,
  AppearanceSettings,
} from "../../lib/supabaseHelpers";
import {
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Github,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";

const PublicProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [appearance, setAppearance] = useState<AppearanceSettings | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLinkAnimation, setSelectedLinkAnimation] =
    useState<"none" | "glow">("none");

  // Update document title dynamically
  useEffect(() => {
    if (profile) {
      document.title = appearance?.seo_title || `${profile.username} | LYNKR`;
    }
  }, [profile, appearance]);

  useEffect(() => {
    const loadPublicData = async () => {
      if (!username) return;
      setLoading(true);
      try {
        const data = await fetchPublicProfileByUsername(username);
        if (!data) {
          setError("User not found");
          return;
        }

        setProfile(data.profile);
        setAppearance(data.appearance);
        setSelectedLinkAnimation(data.appearance.link_animation || "none");

        const userLinks = await fetchPublicLinksByUserId(data.profile.id);
        setLinks(userLinks);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadPublicData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !profile || !appearance) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center text-white">
        <h1 className="text-6xl font-black mb-4">404</h1>
        <p className="text-zinc-400 text-lg mb-8">
          {error || "Page not found"}
        </p>
        <RouterLink
          to="/"
          className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
        >
          Back to LYNKR
        </RouterLink>
      </div>
    );
  }

  // --- Theme Logic (Synced with PhonePreview) ---
  const themeClassMap: Record<string, string> = {
    simple: "bg-gray-100 text-gray-900",
    dark: "bg-black text-white",
    midnight:
      "bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white",
    sunset:
      "bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 text-white",
    ocean: "bg-gradient-to-b from-cyan-500 to-blue-600 text-white",
    forest: "bg-gradient-to-b from-emerald-800 to-green-900 text-white",
    pastel: "bg-gradient-to-tr from-rose-100 to-teal-100 text-zinc-800",
    retro: "bg-[#f4e4bc] text-[#2c3e50]",
    mint: "bg-gradient-to-b from-emerald-50 to-teal-100 text-teal-900",
    air: "bg-gradient-to-b from-slate-50 to-blue-100 text-slate-800",
    custom: "bg-center bg-cover bg-no-repeat text-white",
  };

  const themeClass = themeClassMap[appearance.theme] || themeClassMap.simple;

  // Button Shape
  const btnShapeMap: Record<string, string> = {
    rounded: "rounded-xl",
    square: "rounded-none",
    pill: "rounded-full",
    hard: "rounded-none",
  };
  const btnShapeClass = btnShapeMap[appearance.button_style] || "rounded-xl";

  // Forced Mode Detection from Font Color
  let forceLightMode = false;
  let textColorClass = "";
  let customTextStyle = {};

  if (appearance.font_color && appearance.font_color !== "auto") {
    customTextStyle = { color: appearance.font_color };
    if (appearance.font_color !== "#ffffff") {
      forceLightMode = true;
    } else {
      textColorClass = "shadow-black/50 drop-shadow-md";
    }
  } else {
    // Auto logic
    const darkThemes = [
      "dark",
      "midnight",
      "sunset",
      "ocean",
      "forest",
      "custom",
    ];
    forceLightMode = !darkThemes.includes(appearance.theme);
  }

  // Dynamic Button Classes
  let btnClasses = `${btnShapeClass} w-full p-4 text-center text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mb-4 flex items-center justify-center gap-3 `;

  if (appearance.button_fill === "solid") {
    btnClasses += forceLightMode
      ? "bg-black text-white"
      : "bg-white text-black";
  } else if (appearance.button_fill === "outline") {
    btnClasses += forceLightMode
      ? "border-2 border-black text-black hover:bg-black/5"
      : "border-2 border-white text-white hover:bg-white/10";
  } else if (appearance.button_fill === "ghost") {
    btnClasses += forceLightMode
      ? "bg-black/5 hover:bg-black/10 text-black"
      : "bg-white/10 backdrop-blur-md hover:bg-white/20 text-white";
  }

  // Shadow
  if (appearance.button_shadow === "soft") {
    btnClasses += " shadow-lg";
  } else if (appearance.button_shadow === "hard") {
    btnClasses += forceLightMode
      ? " border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      : " border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]";
  }

  const fontMap: Record<string, string> = {
    sans: "font-sans",
    serif: "font-serif",
    mono: "font-mono tracking-tight",
    montserrat: "font-montserrat",
    lato: "font-lato",
    oswald: "font-oswald tracking-wide",
    outfit: "font-outfit",
  };
  const fontClass = fontMap[appearance.font] || "font-sans";

  const customBackgroundStyle =
    appearance.theme === "custom" && appearance.custom_theme_url
      ? { backgroundImage: `url(${appearance.custom_theme_url})` }
      : {};

  const containerStyle = { ...customBackgroundStyle, ...customTextStyle };

  // Avatar frame styles
  const avatarFrameClass = (() => {
    const base = "w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden mb-6 shrink-0";
    switch (appearance.avatar_frame) {
      case "glow":
        return `${base} ring-4 ring-white/80 shadow-[0_0_35px_12px_rgba(255,255,255,0.25)] bg-white`;
      case "ghost":
        return `${base} ring-2 ring-white/40 bg-white/70 backdrop-blur-sm`;
      case "classic":
      default:
        return `${base} ring-4 ring-white shadow-xl bg-white`;
    }
  })();

  const normalizeLinkedInUrl = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    const lower = trimmed.toLowerCase();
    if (lower.startsWith("http://") || lower.startsWith("https://")) {
      return trimmed;
    }
    if (lower.includes("linkedin.com") || lower.includes("linked.in")) {
      return `https://${trimmed}`;
    }
    return `https://www.linkedin.com/in/${trimmed.replace(/^@/, "")}`;
  };

  // Social Icon Helper
  const getSocialIcon = (url: string) => {
    const lower = url.toLowerCase();
    if (lower.includes("twitter.com") || lower.includes("x.com"))
      return <Twitter className="w-5 h-5" />;
    if (lower.includes("instagram.com"))
      return <Instagram className="w-5 h-5" />;
    if (lower.includes("linkedin.com")) return <Linkedin className="w-5 h-5" />;
    if (lower.includes("facebook.com")) return <Facebook className="w-5 h-5" />;
    if (lower.includes("youtube.com")) return <Youtube className="w-5 h-5" />;
    if (lower.includes("github.com")) return <Github className="w-5 h-5" />;
    if (lower.includes("mailto:")) return <Mail className="w-5 h-5" />;

    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      return (
        <img
          src={`https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`}
          className="w-5 h-5 rounded-sm"
          alt=""
        />
      );
    } catch (e) {
      return null;
    }
  };

  const contact = profile.contact_info as any;
  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return null;
    const target = new Date(dateString).getTime();
    if (Number.isNaN(target)) return null;
    const diffMs = Date.now() - target;
    const diffSec = Math.max(0, Math.floor(diffMs / 1000));
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay >= 1) return `${diffDay}d ago`;
    if (diffHr >= 1) return `${diffHr}h ago`;
    if (diffMin >= 1) return `${diffMin}m ago`;
    return "Just now";
  };

  // Pick the freshest timestamp we have (profile -> appearance -> newest link)
  const getLatestTimestamp = () => {
    const candidates: (string | undefined)[] = [
      profile.updated_at,
      profile.created_at,
      appearance.updated_at,
    ];
    // Add latest link created_at if present
    if (links.length) {
      const newestLink = links
        .map((l) => l.created_at)
        .filter(Boolean)
        .sort(
          (a, b) =>
            (new Date(b!).getTime() || 0) - (new Date(a!).getTime() || 0)
        )[0];
      if (newestLink) candidates.push(newestLink);
    }
    return candidates.filter(Boolean).sort((a, b) => {
      return (new Date(b!).getTime() || 0) - (new Date(a!).getTime() || 0);
    })[0];
  };

  const rawUpdatedLabel = formatRelativeTime(getLatestTimestamp());
  const lastUpdatedLabel =
    rawUpdatedLabel === "Just now" ? "just now" : rawUpdatedLabel;

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center transition-all duration-500 ${themeClass} ${fontClass}`}
      style={containerStyle}
    >
      {/* Cover Image */}
      {profile.cover_image_url && (
        <div className="w-full h-48 sm:h-64 shrink-0 relative">
          <img
            src={profile.cover_image_url}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
      )}

      {/* Content Wrapper */}
      <div
        className={`w-full max-w-2xl px-6 flex flex-col items-center ${
          profile.cover_image_url ? "-mt-16 sm:-mt-20" : "pt-20 sm:pt-32"
        } pb-24 relative z-10`}
      >
        {/* Avatar */}
        <div className={avatarFrameClass}>
          <img
            src={profile.avatar_url || "/assets/originalavatar.jpg"}
            alt={profile.username}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Info */}
        <h1
          className={`text-2xl sm:text-3xl font-bold mb-1 text-center ${textColorClass}`}
        >
          @{profile.username}
        </h1>
        {appearance.show_updated_chip !== false && lastUpdatedLabel && (
          <div
            className={`text-[11px] sm:text-xs font-medium mb-3 transition-all ${
              forceLightMode ? "text-black/40" : "text-white/60"
            } ${textColorClass}`}
            style={customTextStyle}
          >
            Updated {lastUpdatedLabel}
          </div>
        )}
        {profile.bio && (
          <p
            className={`text-center text-lg sm:text-xl opacity-90 mb-8 max-w-lg leading-relaxed ${textColorClass}`}
          >
            {profile.bio}
          </p>
        )}

        {/* Contact Row */}
        {contact &&
          (contact.phone ||
            contact.email ||
            contact.whatsapp ||
            contact.linkedin) && (
            <div className="w-full flex items-center justify-center gap-3 mb-8">
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
                    forceLightMode
                      ? "bg-black/10 border border-black/10 text-black"
                      : "bg-white/10 border border-white/10 text-white"
                  }`}
                >
                  <Phone className="w-5 h-5" />
                </a>
              )}
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
                    forceLightMode
                      ? "bg-black/10 border border-black/10 text-black"
                      : "bg-white/10 border border-white/10 text-white"
                  }`}
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
              {contact.whatsapp && (
                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
                    forceLightMode
                      ? "bg-black/10 border border-black/10 text-black"
                      : "bg-white/10 border border-white/10 text-white"
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
              {contact.linkedin && (
                <a
                  href={normalizeLinkedInUrl(contact.linkedin)}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
                    forceLightMode
                      ? "bg-black/10 border border-black/10 text-black"
                      : "bg-white/10 border border-white/10 text-white"
                  }`}
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          )}

        {/* Links List */}
        <div className="w-full space-y-4">
          {links.map((link) => {
            const validatedUrl = validateUrl(link.url);
            // Skip rendering invalid URLs (prevents protocol injection)
            if (!validatedUrl) return null;

            const tagColor = forceLightMode
              ? "bg-black/10 text-black/70 border border-black/10"
              : "bg-white/10 text-white/80 border border-white/10";
            const displayAnimation = selectedLinkAnimation;

            return (
              <a
                key={link.id}
                href={validatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackLinkClick(link.id)}
                className={`${btnClasses} flex-col !items-start !justify-center pt-4 relative overflow-hidden ${
                  displayAnimation === "glow"
                    ? forceLightMode
                      ? "link-glow-dark"
                      : "link-glow-light"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3 w-full">
                  {link.show_icon !== false &&
                    (link.thumbnail_url ? (
                      <div className="shrink-0 w-8 h-8 rounded-md overflow-hidden shadow-sm">
                        <img
                          src={link.thumbnail_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : getSocialIcon(link.url) ? (
                      <div className="shrink-0">{getSocialIcon(link.url)}</div>
                    ) : null)}
                  <span className="truncate">{link.title}</span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Branding */}
        {appearance.show_brand_tag && (
          <div className="mt-16 sm:mt-24 flex items-center justify-center text-[11px] font-medium text-white/60 hover:text-white/80 transition-colors">
            <RouterLink to="/" className="flex items-center gap-2">
              <span>Powered by LYNKR</span>
            </RouterLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;
