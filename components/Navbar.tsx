import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';
import { Button } from './ui/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { smoothScroll } from '../utils/smoothScroll';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';



const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const navLinks = [
    { name: 'Product', href: '/#product', id: 'product' },
    { name: 'How it Works', href: '/#how-it-works', id: 'how-it-works' },
    { name: 'Features', href: '/#features', id: 'features' },
    { name: 'Pricing', href: '/#pricing', id: 'pricing' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      const hash = href.replace('/#', '');
      if (location.pathname === '/') {
        smoothScroll(hash, 1000);
      } else {
        navigate(href);
      }
    } else {
      navigate(href);
      window.scrollTo(0, 0);
    }
  };

  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Check if View Transition API is supported
    if (!(document as any).startViewTransition) {
      toggleTheme();
      return;
    }

    const x = e.clientX;
    const y = e.clientY;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Using flushSync ensures the React state update happens *inside* the transition
    // snapshot window, preventing the "buffering" or race condition where the 
    // new view isn't ready when the browser expects it.
    const transition = (document as any).startViewTransition(() => {
      flushSync(() => {
        toggleTheme();
      });
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      // Animate the new view expanding
      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 400,
          easing: 'ease-in',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  return (
    <>
      {/* Centered Floating Navbar */}
      <header
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[90%] md:w-auto max-w-5xl`}
      >
        <div className={`
          flex items-center justify-between px-4 py-2 md:px-6 md:py-2.5 rounded-2xl
          bg-surface/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-border shadow-xl
        `}>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold tracking-tight text-primary flex items-center gap-2 mr-4">
              LYNKR
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-sm font-medium transition-colors cursor-pointer ${activeSection === link.id
                    ? 'text-primary'
                    : 'text-secondary hover:text-primary'
                    }`}
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-8">
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-full text-secondary hover:text-primary hover:bg-surfaceHighlight transition-all mr-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <Link to="/dashboard">
                <Button variant="primary" size="sm">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-medium">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={handleThemeToggle}
              className="text-secondary hover:text-primary transition-colors p-2"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              className="text-primary p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-background z-40 flex flex-col items-center justify-center gap-8 md:hidden animate-fade-in pt-24">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              className={`text-2xl font-medium transition-colors ${activeSection === link.id
                ? 'text-primary'
                : 'text-secondary hover:text-primary'
                }`}
            >
              {link.name}
            </button>
          ))}
          <div className="flex flex-col gap-4 mt-8 w-full max-w-xs px-6">
            {user ? (
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                <Button variant="primary" size="lg" className="w-full">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                  <Button variant="ghost" size="lg" className="w-full">Log in</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                  <Button size="lg" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;