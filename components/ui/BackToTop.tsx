import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { smoothScroll } from '../../utils/smoothScroll';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`fixed bottom-8 right-8 z-40 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
      <button
        onClick={scrollToTop}
        className="group relative flex items-center justify-center w-14 h-14 rounded-2xl bg-surface/70 dark:bg-zinc-800/50 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-110 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        aria-label="Back to top"
      >
        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-y-full group-hover:translate-y-[-100%] transition-transform duration-700 ease-in-out" />
        
        <ArrowUp className="w-6 h-6 text-primary group-hover:animate-bounce" />
      </button>
    </div>
  );
};

export default BackToTop;