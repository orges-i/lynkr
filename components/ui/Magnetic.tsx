import React, { useRef, useState, useEffect } from 'react';

interface MagneticProps {
  children: React.ReactElement;
  strength?: number; // How strong the pull is (higher = stronger)
}

export const Magnetic: React.FC<MagneticProps> = ({ children, strength = 30 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const element = ref.current;
      
      if (!element) return;

      const { left, top, width, height } = element.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;

      // Only activate if close enough
      if (Math.abs(distanceX) < width && Math.abs(distanceY) < height) {
        setPosition({ 
          x: distanceX / (100 / strength), 
          y: distanceY / (100 / strength) 
        });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    const element = ref.current;
    if (element) {
      window.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (element) {
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [strength]);

  return (
    <div 
      ref={ref}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      className="transition-transform duration-200 ease-out will-change-transform inline-block"
    >
      {React.cloneElement(children, {
        className: `${children.props.className || ''} block`, 
      })}
    </div>
  );
};