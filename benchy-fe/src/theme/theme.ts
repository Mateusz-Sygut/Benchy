import { ViewStyle } from 'react-native';
import { colors, shadows as baseShadows } from '../styles/colors';

function withShadowColor(shadow: ViewStyle, shadowColor: string): ViewStyle {
  return { ...shadow, shadowColor };
}

export interface AppTheme {
  navigation: {
    mainHeaderBg: string;
    authHeaderBg: string;
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
  gray: typeof colors.gray;
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

const shadowBase = colors.gray[900];

export const appTheme: AppTheme = {
  navigation: {
    mainHeaderBg: colors.primary[800],
    authHeaderBg: colors.primary[600],
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
  shadows: {
    small: withShadowColor(baseShadows.small, shadowBase),
    medium: withShadowColor(baseShadows.medium, shadowBase),
    large: withShadowColor(baseShadows.large, shadowBase),
    button: withShadowColor(baseShadows.button, shadowBase),
  },
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
