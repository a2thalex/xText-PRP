// xText Design System Tokens
// Central configuration for all design decisions

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './animation';
export * from './shadows';
export * from './borders';
export * from './breakpoints';

// Composite tokens
export const tokens = {
  // Component-specific tokens
  components: {
    button: {
      height: {
        sm: '32px',
        md: '40px',
        lg: '48px'
      },
      padding: {
        sm: '0 12px',
        md: '0 16px',
        lg: '0 24px'
      }
    },
    input: {
      height: {
        sm: '32px',
        md: '40px',
        lg: '48px'
      }
    },
    avatar: {
      size: {
        xs: '24px',
        sm: '32px',
        md: '40px',
        lg: '48px',
        xl: '64px'
      }
    }
  },
  
  // Collaboration-specific tokens
  collaboration: {
    cursor: {
      size: '12px',
      labelOffset: '4px'
    },
    presence: {
      indicatorSize: '8px',
      borderWidth: '2px'
    },
    selection: {
      opacity: 0.3,
      borderWidth: '2px'
    }
  },
  
  // Z-index scale
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    notification: 1080,
    cursor: 1090
  }
};