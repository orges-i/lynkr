import React, { useEffect, useRef, useState } from "react";

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLightTrailActive, setIsLightTrailActive] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  const mousePos = useRef({ x: 0, y: 0 });
  const circlePos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const circleEl = useRef<HTMLDivElement>(null);
  const dotEl = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Check if should render - check INSIDE effect
    const isMobile =
      typeof navigator !== "undefined" &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    const isAdminPage =
      typeof window !== "undefined" &&
      (window.location.pathname.includes("/dashboard") ||
        window.location.pathname.includes("/admin") ||
        window.location.pathname.includes("/super-admin"));

    if (isMobile || isAdminPage) {
      setShouldRender(false);
      return;
    }

    setShouldRender(true);
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    // Check dark mode
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();

    // Listen for theme changes
    const themeObserver = new MutationObserver(checkDarkMode);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Add listeners for hover states on all interactive elements
    const handleLinkHoverEvents = () => {
      const hoverables = document.querySelectorAll(
        'a, button, input, textarea, [role="button"]'
      );

      hoverables.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovering(true));
        el.addEventListener("mouseleave", () => setIsHovering(false));
      });
    };

    // Scroll detection for Light Trail activation (from Product section onwards)
    const handleScroll = () => {
      const heroSection = document.getElementById("hero");
      const productSection = document.getElementById("product");

      if (!heroSection || !productSection) {
        setIsLightTrailActive(false);
        return;
      }

      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      const scrollY = window.scrollY;

      // Show Light Trail from Product section onwards
      setIsLightTrailActive(scrollY >= heroBottom);
    };

    // Physics loop for chained lerp
    const updatePhysics = () => {
      // Always update positions, visibility controlled by JSX
      if (circleEl.current && dotEl.current) {
        // Circle follows mouse with lerp 0.035 (3.5%)
        circlePos.current.x +=
          (mousePos.current.x - circlePos.current.x) * 0.035;
        circlePos.current.y +=
          (mousePos.current.y - circlePos.current.y) * 0.035;

        // Dot follows circle with lerp 0.018 (1.8%) - creates heavy lag effect
        dotPos.current.x += (circlePos.current.x - dotPos.current.x) * 0.018;
        dotPos.current.y += (circlePos.current.y - dotPos.current.y) * 0.018;

        // Apply GPU-accelerated transforms
        circleEl.current.style.transform = `translate3d(${circlePos.current.x}px, ${circlePos.current.y}px, 0)`;
        dotEl.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)`;
      }

      animationFrameId.current = requestAnimationFrame(updatePhysics);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseenter", onMouseEnter);
    document.body.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", handleScroll);

    // Initial setup
    handleLinkHoverEvents();
    handleScroll();

    // Re-run setup when DOM changes
    const observer = new MutationObserver(handleLinkHoverEvents);
    observer.observe(document.body, { childList: true, subtree: true });

    // Start physics loop
    animationFrameId.current = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseenter", onMouseEnter);
      document.body.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      themeObserver.disconnect();
      observer.disconnect();
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <>
      {/* Light Trail - only visible from Product section onwards */}
      {shouldRender && isLightTrailActive && (
        <div className="fixed top-0 left-0 pointer-events-none z-[9999]">
          {/* Inertial Circle - Layer 1 */}
          <div
            ref={circleEl}
            className={`
              trail-circle-physics absolute rounded-full border
              transition-all duration-700 ease-out
              ${
                isDarkMode
                  ? isHovering
                    ? "w-10 h-10 -top-5 -left-5 border-white"
                    : "w-6 h-6 -top-3 -left-3 border-white"
                  : isHovering
                  ? "w-10 h-10 -top-5 -left-5 border-black"
                  : "w-6 h-6 -top-3 -left-3 border-black"
              }
            `}
            style={{
              boxShadow: "none",
              willChange: "transform",
            }}
          />

          {/* Core Dot - Layer 2 (Heavy Trailer) */}
          <div
            ref={dotEl}
            className={`
              trail-dot-physics absolute w-3 h-3 -top-1.5 -left-1.5 rounded-full
              transition-all duration-700 ease-out
              ${isHovering ? "w-0 h-0 opacity-0" : "opacity-100"}
            `}
            style={{
              background: isDarkMode ? "#ffffff" : "#000000",
              boxShadow: "none",
              willChange: "transform, opacity",
            }}
          />
        </div>
      )}
    </>
  );
};

export default CustomCursor;
