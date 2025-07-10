// Color System for xText Design System
// Based on collaboration needs and accessibility

export const colors = {
  // Primary palette - Professional and trustworthy
  primary: {
    50: '#e6f0ff',
    100: '#b3d1ff',
    200: '#80b3ff',
    300: '#4d94ff',
    400: '#1a75ff',
    500: '#0056e0', // Main primary
    600: '#0047b8',
    700: '#003890',
    800: '#002968',
    900: '#001a40'
  },
  
  // Gray scale - For UI elements
  gray: {
    50: '#f7f9fc',
    100: '#e9ecf2',
    200: '#d3d9e4',
    300: '#a8b3c7',
    400: '#7d8ca5',
    500: '#5a6881',
    600: '#454f63',
    700: '#2e3749',
    800: '#1a2030',
    900: '#0d1117'
  },
  
  // Semantic colors
  success: {
    light: '#4ade80',
    main: '#22c55e',
    dark: '#16a34a',
    contrast: '#ffffff'
  },
  
  warning: {
    light: '#fbbf24',
    main: '#f59e0b',
    dark: '#d97706',
    contrast: '#000000'
  },
  
  error: {
    light: '#f87171',
    main: '#ef4444',
    dark: '#dc2626',
    contrast: '#ffffff'
  },
  
  info: {
    light: '#60a5fa',
    main: '#3b82f6',
    dark: '#2563eb',
    contrast: '#ffffff'
  },
  
  // Collaboration colors - For user identification
  collaboration: {
    users: [
      '#8b5cf6', // Purple
      '#06b6d4', // Cyan
      '#10b981', // Emerald
      '#f59e0b', // Amber
      '#ec4899', // Pink
      '#6366f1', // Indigo
      '#14b8a6', // Teal
      '#f97316', // Orange
    ],
    
    // Presence states
    presence: {
      active: '#22c55e',
      idle: '#f59e0b',
      away: '#6b7280',
      offline: '#e5e7eb'
    }
  },
  
  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#f7f9fc',
    tertiary: '#e9ecf2',
    inverse: '#0d1117'
  },
  
  // Text colors
  text: {
    primary: '#0d1117',
    secondary: '#454f63',
    tertiary: '#7d8ca5',
    disabled: '#a8b3c7',
    inverse: '#ffffff'
  },
  
  // Border colors
  border: {
    light: '#e9ecf2',
    main: '#d3d9e4',
    dark: '#a8b3c7'
  }
};

// Dark mode colors
export const darkColors = {
  ...colors,
  
  background: {
    primary: '#0d1117',
    secondary: '#161b22',
    tertiary: '#21262d',
    inverse: '#ffffff'
  },
  
  text: {
    primary: '#ffffff',
    secondary: '#8b949e',
    tertiary: '#6e7681',
    disabled: '#484f58',
    inverse: '#0d1117'
  },
  
  border: {
    light: '#21262d',
    main: '#30363d',
    dark: '#484f58'
  }
};

// Color utilities
export const getContrastColor = (backgroundColor: string): string => {
  // Simple contrast calculation
  const rgb = parseInt(backgroundColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma < 128 ? '#ffffff' : '#000000';
};

export const getUserColor = (userId: string): string => {
  const index = userId.charCodeAt(0) % colors.collaboration.users.length;
  return colors.collaboration.users[index];
};