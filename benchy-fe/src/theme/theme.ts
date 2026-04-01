import { ViewStyle } from 'react-native';
import { colors, shadows as baseShadows } from '../styles/colors';

export type ThemePreference = 'system' | 'light' | 'dark';

const darkGray = {
  50: '#2a3340',
  100: '#242b34',
  200: '#323c4a',
  300: '#3d4756',
  400: '#556070',
  500: '#7a8799',
  600: '#9aa8b8',
  700: '#b8c1cc',
  800: '#d4d9e0',
  900: '#eceff3',
} as const;

function withShadowColor(shadow: ViewStyle, shadowColor: string): ViewStyle {
  return { ...shadow, shadowColor };
}

export interface AppTheme {
  isDark: boolean;
  statusBarStyle: 'light' | 'dark';
  preference: ThemePreference;
  navigation: {
    mainHeaderBg: string;
    authHeaderBg: string;
    tabHeaderBg: string;
    headerTint: string;
  };
  background: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    white: string;
  };
  gray: (typeof colors.gray) | typeof darkGray;
  gradient: {
    light: string;
    lighter: string;
    primary: readonly string[];
  };
  primary: typeof colors.primary;
  success: string;
  warning: string;
  error: string;
  star: string;
  shadows: {
    small: ViewStyle;
    medium: ViewStyle;
    large: ViewStyle;
    button: ViewStyle;
  };
  authCardBg: string;
  authCardBorder: string;
  authRandomBtnBg: string;
  authRandomBtnText: string;
  glass: {
    sheetFill: string;
    sheetBorder: string;
    cardFill: string;
    cardBorder: string;
    buttonFill: string;
    buttonBorder: string;
    inputFill: string;
    inputBorder: string;
    inputText: string;
    modalFill: string;
    textMuted: string;
  };
  panels: {
    overlay: string;
    leftBg: string;
    rightBg: string;
    bottomBg: string;
  };
  map: {
    chromeBg: string;
    emptyOverlayBg: string;
    emptyOverlayBorder: string;
  };
}

export function buildAppTheme(isDark: boolean, preference: ThemePreference): AppTheme {
  const shadowBase = isDark ? '#000000' : colors.gray[900];
  const themedShadows = {
    small: withShadowColor(baseShadows.small, shadowBase),
    medium: withShadowColor(baseShadows.medium, shadowBase),
    large: withShadowColor(baseShadows.large, shadowBase),
    button: withShadowColor(baseShadows.button, shadowBase),
  };

  if (!isDark) {
    return {
      isDark: false,
      statusBarStyle: 'dark',
      preference,
      navigation: {
        mainHeaderBg: colors.primary[800],
        authHeaderBg: colors.primary[600],
        tabHeaderBg: colors.primary[800],
        headerTint: colors.text.white,
      },
      background: { ...colors.background },
      text: { ...colors.text },
      gray: colors.gray,
      gradient: { ...colors.gradient, primary: colors.gradient.primary },
      primary: colors.primary,
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
      star: colors.star,
      shadows: themedShadows,
      authCardBg: 'rgba(255, 255, 255, 0.98)',
      authCardBorder: 'rgba(255, 255, 255, 0.2)',
      authRandomBtnBg: colors.primary[100],
      authRandomBtnText: colors.primary[700],
      glass: {
        sheetFill: 'rgba(255, 255, 255, 0.1)',
        sheetBorder: 'rgba(255, 255, 255, 0.2)',
        cardFill: 'rgba(255, 255, 255, 0.08)',
        cardBorder: 'rgba(255, 255, 255, 0.15)',
        buttonFill: 'rgba(255, 255, 255, 0.2)',
        buttonBorder: 'rgba(255, 255, 255, 0.3)',
        inputFill: 'rgba(255, 255, 255, 0.1)',
        inputBorder: 'rgba(255, 255, 255, 0.2)',
        inputText: '#ffffff',
        modalFill: 'rgba(0, 0, 0, 0.3)',
        textMuted: 'rgba(255, 255, 255, 0.75)',
      },
      panels: {
        overlay: 'rgba(0, 0, 0, 0.5)',
        leftBg: 'rgba(30, 30, 50, 0.95)',
        rightBg: 'rgba(50, 30, 30, 0.95)',
        bottomBg: 'rgba(30, 50, 30, 0.95)',
      },
      map: {
        chromeBg: colors.gray[100],
        emptyOverlayBg: 'rgba(255, 255, 255, 0.95)',
        emptyOverlayBorder: 'rgba(124, 179, 66, 0.2)',
      },
    };
  }

  return {
    isDark: true,
    statusBarStyle: 'light',
    preference,
    navigation: {
      mainHeaderBg: colors.primary[900],
      authHeaderBg: colors.primary[800],
      tabHeaderBg: colors.primary[900],
      headerTint: '#ffffff',
    },
    background: {
      primary: '#252d38',
      secondary: '#161a1f',
      disabled: '#4a5568',
    },
    text: {
      primary: '#eef1f5',
      secondary: '#a8b4c4',
      disabled: '#6b7788',
      white: '#ffffff',
    },
    gray: darkGray,
    gradient: {
      light: 'rgba(46, 125, 50, 0.22)',
      lighter: '#1a222c',
      primary: colors.gradient.primary,
    },
    primary: colors.primary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    star: colors.star,
    shadows: themedShadows,
    authCardBg: 'rgba(32, 40, 52, 0.97)',
    authCardBorder: 'rgba(255, 255, 255, 0.1)',
    authRandomBtnBg: 'rgba(124, 179, 66, 0.25)',
    authRandomBtnText: colors.primary[200],
    glass: {
      sheetFill: 'rgba(255, 255, 255, 0.07)',
      sheetBorder: 'rgba(255, 255, 255, 0.14)',
      cardFill: 'rgba(255, 255, 255, 0.06)',
      cardBorder: 'rgba(255, 255, 255, 0.12)',
      buttonFill: 'rgba(255, 255, 255, 0.12)',
      buttonBorder: 'rgba(255, 255, 255, 0.18)',
      inputFill: 'rgba(255, 255, 255, 0.08)',
      inputBorder: 'rgba(255, 255, 255, 0.15)',
      inputText: '#ffffff',
      modalFill: 'rgba(0, 0, 0, 0.45)',
      textMuted: 'rgba(255, 255, 255, 0.72)',
    },
    panels: {
      overlay: 'rgba(0, 0, 0, 0.62)',
      leftBg: 'rgba(22, 26, 40, 0.97)',
      rightBg: 'rgba(40, 26, 28, 0.97)',
      bottomBg: 'rgba(24, 36, 28, 0.97)',
    },
    map: {
      chromeBg: '#12161c',
      emptyOverlayBg: 'rgba(30, 38, 48, 0.94)',
      emptyOverlayBorder: 'rgba(124, 179, 66, 0.35)',
    },
  };
}
