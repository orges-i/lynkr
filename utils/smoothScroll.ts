export const smoothScroll = (targetId: string, duration = 1000) => {
  const target = document.getElementById(targetId);
  if (!target) return;

  const navbarOffset = 80;
  const elementPosition = target.getBoundingClientRect().top;
  const startPosition = window.scrollY;
  const targetPosition = elementPosition + startPosition - navbarOffset;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  // Quadratic easing in/out
  function easeInOutQuad(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
};