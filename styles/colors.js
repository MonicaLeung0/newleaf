/**
 * NewLeaf Color Palette
 * Based on green and pink theme
 */

export const colors = {
  // Green Palette
  green: {
    dark: '#084B41',      // Dark muted green
    medium: '#8A9F77',    // Lighter muted green
    light: '#A8B89A',     // Light green variant
    lighter: '#C4D4B8',   // Very light green
    pale: '#eef7ed',
  },
  
  // Pink Palette
  pink: {
    white: '#fcf5f5',
    pale: '#FDEBEA',      // Very pale pink
    light: '#F5D5D2',     // Light pink/peach (adjusted from visual)
    medium: '#E7B5AC',    // Muted rose/light coral
    dark: '#D99A8F', 
    red: '#ba5949',      // Darker pink variant
  },
  
  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    gray50: '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#E5E5E5',
    gray300: '#D4D4D4',
    gray400: '#A3A3A3',
    gray500: '#737373',
    gray600: '#525252',
    gray700: '#404040',
    gray800: '#262626',
    gray900: '#171717',
    black: '#000000',
  },
  
  // Semantic Colors
  semantic: {
    success: '#084B41',   // Dark green for success
    error: '#D99A8F',     // Darker pink for errors
    warning: '#E7B5AC',    // Coral for warnings
    info: '#8A9F77',       // Medium green for info
  },
};

// Tailwind-compatible color object
export const tailwindColors = {
  green: {
    dark: colors.green.dark,
    medium: colors.green.medium,
    light: colors.green.light,
    lighter: colors.green.lighter,
  },
  pink: {
    pale: colors.pink.pale,
    light: colors.pink.light,
    medium: colors.pink.medium,
    dark: colors.pink.dark,
  },
  neutral: colors.neutral,
};

export default colors;

