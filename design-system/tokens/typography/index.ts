// Typography System for xText Design System
// Optimized for readability and code editing

export const typography = {
  // Font families
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    display: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  
  // Font sizes - Using rem for accessibility
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  
  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
    code: '1.5' // Specific for code blocks
  },
  
  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800'
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  },
  
  // Text styles - Composed styles
  textStyles: {
    // Headings
    h1: {
      fontSize: '2.25rem',
      lineHeight: '1.25',
      fontWeight: '700',
      letterSpacing: '-0.025em'
    },
    h2: {
      fontSize: '1.875rem',
      lineHeight: '1.375',
      fontWeight: '600',
      letterSpacing: '-0.025em'
    },
    h3: {
      fontSize: '1.5rem',
      lineHeight: '1.375',
      fontWeight: '600',
      letterSpacing: '0'
    },
    h4: {
      fontSize: '1.25rem',
      lineHeight: '1.5',
      fontWeight: '600',
      letterSpacing: '0'
    },
    h5: {
      fontSize: '1.125rem',
      lineHeight: '1.5',
      fontWeight: '600',
      letterSpacing: '0'
    },
    h6: {
      fontSize: '1rem',
      lineHeight: '1.5',
      fontWeight: '600',
      letterSpacing: '0'
    },
    
    // Body text
    body: {
      fontSize: '1rem',
      lineHeight: '1.5',
      fontWeight: '400',
      letterSpacing: '0'
    },
    bodySmall: {
      fontSize: '0.875rem',
      lineHeight: '1.5',
      fontWeight: '400',
      letterSpacing: '0'
    },
    bodyLarge: {
      fontSize: '1.125rem',
      lineHeight: '1.625',
      fontWeight: '400',
      letterSpacing: '0'
    },
    
    // UI text
    label: {
      fontSize: '0.875rem',
      lineHeight: '1.25',
      fontWeight: '500',
      letterSpacing: '0.025em'
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: '1.375',
      fontWeight: '400',
      letterSpacing: '0.025em'
    },
    button: {
      fontSize: '0.875rem',
      lineHeight: '1.25',
      fontWeight: '600',
      letterSpacing: '0.05em',
      textTransform: 'none'
    },
    
    // Code
    code: {
      fontSize: '0.875rem',
      lineHeight: '1.5',
      fontWeight: '400',
      fontFamily: '"SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
    },
    codeBlock: {
      fontSize: '0.875rem',
      lineHeight: '1.625',
      fontWeight: '400',
      fontFamily: '"SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
    }
  }
};

// Typography utilities
export const clampText = (lines: number) => ({
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden'
});

export const truncateText = () => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
});