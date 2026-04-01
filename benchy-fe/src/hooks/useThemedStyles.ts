import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { createScreenStyles } from '../styles/screens';
import { createCommonStyles } from '../styles/common';
import { createComponentStyles } from '../styles/components';
import {
  createGlassmorphismStyles,
  createPanelNavigatorStyles,
  createPanelStyles,
} from '../styles/glassmorphism';

export function useThemedStyles() {
  const { theme } = useTheme();
  return useMemo(
    () => ({
      theme,
      screen: createScreenStyles(theme),
      common: createCommonStyles(theme),
      component: createComponentStyles(theme),
      glass: createGlassmorphismStyles(theme),
      panelNav: createPanelNavigatorStyles(theme),
      panel: createPanelStyles(theme),
    }),
    [theme]
  );
}
