// Animation System for xText Design System
// Smooth, purposeful animations that enhance collaboration

export const animation = {
  // Duration scale
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
    slowest: '1000ms'
  },
  
  // Easing functions
  easing: {
    // Cubic bezier curves
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Spring-like animations
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    
    // Specific use cases
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  // Keyframe animations
  keyframes: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 }
    },
    fadeOut: {
      from: { opacity: 1 },
      to: { opacity: 0 }
    },
    slideInUp: {
      from: { transform: 'translateY(100%)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 }
    },
    slideInDown: {
      from: { transform: 'translateY(-100%)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 }
    },
    slideInLeft: {
      from: { transform: 'translateX(-100%)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 }
    },
    slideInRight: {
      from: { transform: 'translateX(100%)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 }
    },
    scaleIn: {
      from: { transform: 'scale(0.95)', opacity: 0 },
      to: { transform: 'scale(1)', opacity: 1 }
    },
    pulse: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 }
    },
    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' }
    },
    ping: {
      '75%, 100%': {
        transform: 'scale(2)',
        opacity: 0
      }
    },
    bounce: {
      '0%, 100%': {
        transform: 'translateY(0)',
        animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
      },
      '50%': {
        transform: 'translateY(-25%)',
        animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
      }
    }
  },
  
  // Transitions - Common property combinations
  transitions: {
    all: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1), color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    shadow: 'box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Interaction states
    hover: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    active: 'all 100ms cubic-bezier(0.4, 0, 0.2, 1)',
    focus: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  // Collaboration-specific animations
  collaboration: {
    cursorMove: 'transform 100ms linear',
    presenceChange: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
    typing: 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)',
    selection: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    commentAppear: 'all 250ms cubic-bezier(0, 0, 0.2, 1)'
  },
  
  // Motion preferences
  motionSafe: {
    '@media (prefers-reduced-motion: no-preference)': {
      animation: 'inherit'
    }
  },
  motionReduce: {
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
      transition: 'none'
    }
  }
};

// Animation utilities
export const createTransition = (
  properties: string | string[],
  duration: keyof typeof animation.duration = 'normal',
  easing: keyof typeof animation.easing = 'standard'
) => {
  const props = Array.isArray(properties) ? properties : [properties];
  return props
    .map(prop => `${prop} ${animation.duration[duration]} ${animation.easing[easing]}`)
    .join(', ');
};

export const stagger = (delay: number = 50, index: number = 0) => ({
  animationDelay: `${delay * index}ms`,
  transitionDelay: `${delay * index}ms`
});