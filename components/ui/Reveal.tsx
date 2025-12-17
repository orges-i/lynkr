import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  width?: 'fit-content' | '100%';
  delay?: number;
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({ children, width = 'fit-content', delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Fail-safe: If IntersectionObserver is not supported, show content immediately
    if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    // Disconnect any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger if intersecting OR if the element is somehow already above viewport (scrolled past)
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0, // Trigger immediately when even 1 pixel is visible
        rootMargin: '0px 0px -50px 0px' // Slightly offset bottom trigger
      }
    );

    observer.observe(element);
    observerRef.current = observer;

    // SAFETY TIMEOUT:
    // If for any reason (race condition, heavy load) the observer doesn't fire,
    // force the content to show after a short delay. This prevents "invisible text" bugs.
    const safetyTimeout = setTimeout(() => {
      if (!isVisible) {
        setIsVisible(true);
        if (observerRef.current) observerRef.current.disconnect();
      }
    }, 2000); 

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      clearTimeout(safetyTimeout);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width,
        transitionDelay: `${delay}ms`,
      }}
      className={`transform transition-all duration-1000 ease-out will-change-[transform,opacity] ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
};