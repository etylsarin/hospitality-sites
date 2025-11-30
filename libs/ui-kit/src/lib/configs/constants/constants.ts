import type { Easing } from 'framer-motion';

const easing: Easing = 'easeInOut';

export const fadeInBottom = (duration: number = 0.3) => {
  return {
    from: {
      top: '100%',
      opacity: 0.5,
      transition: {
        ease: easing,
        duration: duration,
      },
    },
    to: {
      top: 0,
      opacity: 1,
      transition: {
        ease: easing,
        duration: duration,
      },
    },
  };
}

export const fromOpacity = (duration: number = 0.5, delay: number = 0.5) => {
  return {
    from: {
      opacity: 0,
      transition: {
        ease: easing,
        duration: duration,
        delay: delay,
      },
    },
    to: {
      opacity: 1,
      transition: {
        ease: easing,
        duration: duration,
        delay: delay,
      },
    },
  };
}
