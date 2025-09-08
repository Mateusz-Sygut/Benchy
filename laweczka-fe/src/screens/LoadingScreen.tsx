import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { componentStyles } from '../styles/components';

const LoadingScreen = () => {
  const { t } = useTranslation();
  return (
    <View style={componentStyles.loadingContainer}>
      <ActivityIndicator size="large" color="#2E7D32" />
      <Text style={componentStyles.loadingText}>{t('common.loading')}</Text>
    </View>
  );
};


export default LoadingScreen;

