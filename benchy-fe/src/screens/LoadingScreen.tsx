import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemedStyles } from '../hooks/useThemedStyles';

const LoadingScreen = () => {
  const { t } = useTranslation();
  const { component: componentStyles, theme } = useThemedStyles();
  return (
    <View style={componentStyles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.primary[900]} />
      <Text style={componentStyles.loadingText}>{t('common.loading')}</Text>
    </View>
  );
};

export default LoadingScreen;
