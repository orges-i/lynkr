import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { smoothScroll } from "../utils/smoothScroll";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Use a timeout to ensure the DOM is fully rendered
      const timer = setTimeout(() => {
        smoothScroll(hash.replace('#', ''), 1000);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}