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
  
  star: '#ffd700',
  gradient: {
    light: '#e8f5e8',
    lighter: '#f1f8e9',
    primary: ['#2e7d32', '#388e3c', '#43a047'],
  },
  
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

export const shadows = {
  small: {
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  button: {
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

