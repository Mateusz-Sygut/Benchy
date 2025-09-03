export const colors = {
  primary: {
    50: '#f1f8e9',
    100: '#dcedc1', 
    200: '#c5e19b',
    300: '#add674',
    400: '#9ccc65',
    500: '#8bc34a',
    600: '#7cb342',
    700: '#689f38',
    800: '#558b2f',
    900: '#2e7d32',
  },
  
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  
  rating: '#ffd700',
  
  background: {
    primary: '#ffffff',
    secondary: '#f5f5f5',
    disabled: '#cccccc',
  },
  
  text: {
    primary: '#333333',
    secondary: '#666666',
    disabled: '#999999',
    white: '#ffffff',
  },
} as const;

export type ColorKey = keyof typeof colors;
export type ColorShade = keyof typeof colors.primary;

