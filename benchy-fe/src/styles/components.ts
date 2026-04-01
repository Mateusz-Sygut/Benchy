import { StyleSheet } from 'react-native';
import { AppTheme } from '../theme/theme';

export const createComponentStyles = (t: AppTheme) =>
  StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    buttonPrimary: {
      backgroundColor: t.primary[600],
    },
    buttonDanger: {
      backgroundColor: t.error,
    },
    buttonOutline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: t.primary[600],
    },
    buttonDisabled: {
      backgroundColor: t.background.disabled,
    },
    buttonText: {
      color: t.text.white,
      fontSize: 16,
      fontWeight: 'bold' as 'bold',
      textAlign: 'center' as 'center',
    },
    buttonTextOutline: {
      color: t.primary[600],
      fontSize: 16,
      fontWeight: 'bold' as 'bold',
      textAlign: 'center' as 'center',
    },
    buttonIcon: {
      marginRight: 8,
    },

    inputContainer: {
      marginBottom: 16,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: t.background.secondary,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: t.gray[300],
      minHeight: 50,
    },
    inputIconContainer: {
      paddingLeft: 16,
      paddingRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: t.text.primary,
      backgroundColor: 'transparent',
    },
    inputWithIcon: {
      paddingLeft: 8,
    },
    inputMultiline: {
      minHeight: 80,
      textAlignVertical: 'top' as 'top',
    },
    inputError: {
      borderColor: t.error,
      backgroundColor: t.gray[50],
    },
    inputErrorText: {
      color: t.error,
      fontSize: 14,
      marginTop: 4,
      marginLeft: 16,
    },

    mapContainer: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
    mapButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: t.primary[600],
      borderRadius: 25,
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      ...t.shadows.medium,
    },

    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: t.background.secondary,
    },
    loadingText: {
      fontSize: 16,
      color: t.text.secondary,
    },

    scrollingHeaderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: 24,
      marginHorizontal: 16,
      marginTop: 4,
      ...t.shadows.medium,
    },
    scrollingHeaderIconContainer: {
      marginRight: 14,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 12,
      padding: 6,
    },
    scrollingHeaderTextContainer: {
      flex: 1,
    },
    scrollingHeaderMainText: {
      color: t.text.white,
      fontSize: 11,
      fontWeight: '600' as '600',
      opacity: 0.85,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as 'uppercase',
    },
    scrollingHeaderBenchText: {
      color: t.text.white,
      fontSize: 15,
      fontWeight: '700' as '700',
      marginTop: 3,
      letterSpacing: 0.3,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    scrollingHeaderTimeText: {
      color: t.text.white,
      fontSize: 12,
      opacity: 0.75,
      marginTop: 2,
      fontWeight: '500' as '500',
      fontStyle: 'italic' as 'italic',
    },

    starRatingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    starRatingStar: {
      marginHorizontal: 2,
    },
  });
