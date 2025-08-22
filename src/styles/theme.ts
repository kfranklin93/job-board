/**
 * Enterprise-focused theme with purple, black, and gold accents
 */

export const theme = {
  colors: {
    // Primary colors
    primary: {
      main: '#5E35B1', // Deep purple - primary brand color
      light: '#7E57C2',
      dark: '#4527A0',
      contrastText: '#FFFFFF'
    },
    
    // Secondary colors
    secondary: {
      main: '#D4AF37', // Gold - for accents and highlights
      light: '#F7D772',
      dark: '#B7942D',
      contrastText: '#121212'
    },
    
    // Neutral colors
    neutral: {
      black: '#121212', // Rich black
      gray900: '#212121',
      gray800: '#424242',
      gray700: '#616161',
      gray600: '#757575',
      gray500: '#9E9E9E',
      gray400: '#BDBDBD',
      gray300: '#E0E0E0',
      gray200: '#EEEEEE',
      gray100: '#F5F5F5',
      gray50: '#FAFAFA',
      white: '#FFFFFF'
    },
    
    // Status colors
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#FFFFFF'
    },
    warning: {
      main: '#FFC107',
      light: '#FFD54F',
      dark: '#FFA000',
      contrastText: '#121212'
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#D32F2F',
      contrastText: '#FFFFFF'
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
      contrastText: '#FFFFFF'
    }
  },
  
  // Typography
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', sans-serif",
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700
    },
    sizes: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      md: '1rem',        // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem'      // 48px
    }
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '2.5rem', // 40px
    '3xl': '3rem'    // 48px
  },
  
  // Borders
  borders: {
    radius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px'
    }
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    outline: '0 0 0 3px rgba(94, 53, 177, 0.5)',
    none: 'none'
  },

  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out'
  }
};
// ADD THIS LINE: This exports the TypeScript type of your theme object
export type ThemeType = typeof theme;

// Re-export theme as default
export default theme;