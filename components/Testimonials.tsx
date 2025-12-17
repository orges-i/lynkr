import React, { useRef, useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Reveal } from './ui/Reveal';

const testimonials = [
  {
    quote: "I've tried every link-in-bio tool out there. LYNKR is the only one that feels like a professional website builder. The design quality is unmatched.",
    author: "Alex Rivera",
    role: "Visual Designer",
    image: "https://picsum.photos/100/100?random=2"
  },
  {
    quote: "My conversion rate doubled after switching to LYNKR. The speed and clean aesthetic just builds trust immediately.",
    author: "Jordan Lee",
    role: "Founder, TechStart",
    image: "https://picsum.photos/100/100?random=3"
  },
  {
    quote: "Finally, a tool that doesn't look cheap. It gives my personal brand the premium feel I've been looking for.",
    author: "Casey Smith",
    role: "Lifestyle Creator",
    image: "https://picsum.photos/100/100?random=4"
  }
];

const Testimonials: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && scrollRef.current) {
        if (scrollRef.current.scrollWidth > scrollRef.current.clientWidth) {
          const nextIndex = (activeIndex + 1) % testimonials.length;
          scrollTo(nextIndex);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex, isPaused]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const itemWidth = scrollRef.current.scrollWidth / testimonials.length;
      const index = Math.round(scrollLeft / itemWidth);
      const safeIndex = Math.min(Math.max(index, 0), testimonials.length - 1);
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
    <div className="py-24 max-w-7xl mx-auto px-6">
      <Reveal className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary">Loved by creators.</h2>
      </Reveal>
      
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex overflow-x-auto snap-x snap-mandatory pb-8 gap-6 -mx-6 px-6 md:grid md:grid-cols-3 md:gap-8 md:pb-0 md:mx-0 md:px-0 scrollbar-hide"
      >
        {testimonials.map((t, index) => (
          <Reveal key={index} delay={index * 150} className="min-w-[85vw] md:min-w-0 snap-center shrink-0 h-full">
            <div className="h-full p-8 rounded-2xl bg-surface/50 border border-border hover:bg-surface transition-colors flex flex-col justify-between shadow-sm hover:shadow-lg">
              <div>
                <div className="flex gap-1 text-yellow-500 mb-6">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-primary text-lg mb-8 leading-relaxed">"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.author} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                <div>
                  <div className="font-bold text-primary">{t.author}</div>
                  <div className="text-sm text-secondary">{t.role}</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-4 md:hidden">
          {testimonials.map((_, i) => (
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
                  aria-label={`Go to testimonial ${i + 1}`}
              />
          ))}
      </div>
    </div>
  );
};

export default Testimonials;