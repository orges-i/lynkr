import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    // Add listeners for hover states on all interactive elements
    const handleLinkHoverEvents = () => {
      const hoverables = document.querySelectorAll('a, button, input, textarea, [role="button"]');
      
      hoverables.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseenter', onMouseEnter);
    document.body.addEventListener('mouseleave', onMouseLeave);
    
    // Initial setup
    handleLinkHoverEvents();

    // Re-run setup when DOM changes (simple observer)
    const observer = new MutationObserver(handleLinkHoverEvents);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseenter', onMouseEnter);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      observer.disconnect();
    };
  }, [isVisible]);

  // Hide on mobile / touch devices
  if (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return null;
  }

  return (
    <>
      <style>{`
        body { cursor: none; }
        a, button, input, textarea { cursor: none; }
      `}</style>
      <div 
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      >
        <div 
          className={`
            relative -top-3 -left-3 rounded-full border border-white transition-all duration-150 ease-out
            ${isHovering ? 'w-12 h-12 bg-white/20 -top-6 -left-6 border-transparent' : 'w-6 h-6'}
          `} 
        />
        <div 
          className={`
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full transition-all duration-150
            ${isHovering ? 'w-0 h-0 opacity-0' : 'w-1 h-1'}
          `}
        />
      </div>
    </>
  );
};

export default CustomCursor;