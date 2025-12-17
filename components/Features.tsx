import React, { useRef, useState, useEffect } from 'react';
import { Smartphone, BarChart3, Globe, Lock, Palette, Zap } from 'lucide-react';
import { Reveal } from './ui/Reveal';

const features = [
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Designed natively for the screens your audience uses most. Looks perfect on any device.'
  },
  {
    icon: Palette,
    title: 'Custom Branding',
    description: 'Remove our branding and add your own logo, custom fonts, and colors.'
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    description: 'Understand your audience with pixel-perfect tracking and conversion insights.'
  },
  {
    icon: Globe,
    title: 'Custom Domain',
    description: 'Connect your own domain name for the ultimate professional look.'
  },
  {
    icon: Lock,
    title: 'Gated Content',
    description: 'Monetize your audience by locking exclusive content behind a paywall.'
  },
  {
    icon: Zap,
    title: 'Blazing Fast',
    description: 'Optimized for speed. Your page loads instantly, even on slow connections.'
  }
];

const Features: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && scrollRef.current) {
        if (scrollRef.current.scrollWidth > scrollRef.current.clientWidth) {
          const nextIndex = (activeIndex + 1) % features.length;
          scrollTo(nextIndex);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex, isPaused]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const itemWidth = scrollRef.current.scrollWidth / features.length;
      const index = Math.round(scrollLeft / itemWidth);
      const safeIndex = Math.min(Math.max(index, 0), features.length - 1);
      if (safeIndex !== activeIndex) {
        setActiveIndex(safeIndex);
      }
    }
  };

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const child = container.children[index] as HTMLElement;
      if (child) {
        const scrollLeft = child.offsetLeft - (container.clientWidth / 2) + (child.clientWidth / 2);
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        setActiveIndex(index);
      }
    }
  };

  return (
    <div className="py-24 bg-surface dark:bg-zinc-900/20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary">Everything you need.</h2>
          <p className="text-secondary text-lg max-w-2xl">
            Powerful features packed into a simple interface. 
            We handle the complexity so you can focus on creating.
          </p>
        </Reveal>

        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          /* Fixed clipping by adding more padding to container (md:p-4) */
          className="flex overflow-x-auto snap-x snap-mandatory pb-8 gap-4 -mx-6 px-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:pb-8 md:mx-0 md:p-4 scrollbar-hide"
        >
          {features.map((feature, index) => (
            <Reveal key={index} delay={index * 100} className="min-w-[85vw] md:min-w-0 snap-center shrink-0 h-full">
              <div className="group h-full p-8 rounded-2xl bg-background border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 rounded-lg bg-surfaceHighlight border border-border flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-background transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-secondary group-hover:text-background transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-primary">{feature.title}</h3>
                <p className="text-secondary leading-relaxed">{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Mobile Pagination Dots */}
        <div className="flex justify-center gap-2 mt-4 md:hidden">
            {features.map((_, i) => (
                <button
                    key={i}
                    onClick={() => {
                        setIsPaused(true); 
                        scrollTo(i);
                        setTimeout(() => setIsPaused(false), 5000);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                        i === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-secondary/30'
                    }`}
                    aria-label={`Go to feature ${i + 1}`}
                />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Features;