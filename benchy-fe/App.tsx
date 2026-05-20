import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AchievementsProvider } from './src/contexts/AchievementsContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import LoadingScreen from './src/screens/LoadingScreen';
import './src/i18n';

const AppContent = () => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar style={theme.statusBarStyle} />
      {user ? <AppNavigator /> : <AuthNavigator />}
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AchievementsProvider>
            <NavigationContainer>
              <AppContent />
            </NavigationContainer>
          </AchievementsProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
