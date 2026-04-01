import { StyleSheet } from 'react-native';
import { AppTheme } from '../theme/theme';

export const createCommonStyles = (t: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 16,
      paddingBottom: 40,
    },

    card: {
      backgroundColor: t.background.primary,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      ...t.shadows.medium,
    },

    title: {
      fontSize: 24,
      fontWeight: 'bold' as 'bold',
      color: t.text.primary,
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: 'bold' as 'bold',
      color: t.primary[600],
      marginBottom: 16,
    },
    text: {
      fontSize: 16,
      color: t.text.primary,
    },
    textSecondary: {
      fontSize: 14,
      color: t.text.secondary,
    },

    marginBottom: {
      marginBottom: 16,
    },
    marginTop: {
      marginTop: 16,
    },

    row: {
      flexDirection: 'row',
    },
    column: {
      flexDirection: 'column',
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },

    backgroundPrimary: {
      backgroundColor: t.background.primary,
    },
    backgroundSecondary: {
      backgroundColor: t.background.secondary,
    },

    authHeaderContainer: {
      backgroundColor: t.navigation.authHeaderBg,
      paddingTop: 40,
      paddingBottom: 8,
    },
    authHeaderStyle: {
      backgroundColor: t.navigation.authHeaderBg,
    },
    authHeaderTitleStyle: {
      fontWeight: 'bold' as const,
    },
    mainHeaderStyle: {
      backgroundColor: t.navigation.mainHeaderBg,
    },
    tabHeaderStyle: {
      backgroundColor: t.navigation.tabHeaderBg,
    },
    tabHeaderTitleStyle: {
      fontWeight: 'bold' as const,
    },
  });
