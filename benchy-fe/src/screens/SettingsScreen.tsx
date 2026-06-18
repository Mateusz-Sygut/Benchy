import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { LanguagePreference } from '../i18n/language';
import { ThemePreference } from '../theme/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

const SettingsScreen = () => {
  const { t } = useTranslation();
  const { preference, setPreference } = useTheme();
  const { preference: languagePreference, setPreference: setLanguagePreference } = useLanguage();
  const { screen: screenStyles, theme } = useThemedStyles();

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  const themeOptions: { key: ThemePreference; label: string }[] = [
    { key: 'system', label: t('profile.themeSystem') },
    { key: 'light', label: t('profile.themeLight') },
    { key: 'dark', label: t('profile.themeDark') },
  ];

  const languageOptions: { key: LanguagePreference; label: string }[] = [
    { key: 'system', label: t('profile.languageSystem') },
    { key: 'en', label: t('profile.languageEnglish') },
    { key: 'pl', label: t('profile.languagePolish') },
  ];

  const chipStyle = (selected: boolean) => ({
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: selected ? theme.primary[600] : theme.gray[300],
    backgroundColor: selected ? theme.gradient.light : theme.background.primary,
  });

  const chipTextStyle = (selected: boolean) => ({
    fontSize: 14,
    fontWeight: '600' as const,
    color: selected ? theme.primary[700] : theme.text.secondary,
  });

  return (
    <>
      <StatusBar
        barStyle={theme.statusBarStyle === 'light' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background.primary}
      />
      <ScrollView style={screenStyles.profileContainer}>
        <View style={[screenStyles.profileMenuCard, { marginTop: 16 }]}>
          <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
            <Text style={screenStyles.profileMenuTitle}>{t('profile.appearance')}</Text>
            <Text style={[screenStyles.profileMenuSubtitle, { marginBottom: 12 }]}>
              {t('profile.appearanceSubtitle')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {themeOptions.map((opt) => {
                const selected = preference === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    onPress={() => setPreference(opt.key)}
                    style={chipStyle(selected)}
                  >
                    <Text style={chipTextStyle(selected)}>{opt.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[screenStyles.profileMenuTitle, { marginTop: 24 }]}>
              {t('profile.language')}
            </Text>
            <Text style={[screenStyles.profileMenuSubtitle, { marginBottom: 12 }]}>
              {t('profile.languageSubtitle')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {languageOptions.map((opt) => {
                const selected = languagePreference === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    onPress={() => setLanguagePreference(opt.key)}
                    style={chipStyle(selected)}
                  >
                    <Text style={chipTextStyle(selected)}>{opt.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <View style={[screenStyles.profileMenuCard, { marginTop: 12, marginBottom: 24 }]}>
          <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
            <Text style={screenStyles.profileMenuTitle}>{t('settings.about')}</Text>
            <Text style={[screenStyles.profileMenuSubtitle, { marginTop: 4 }]}>
              {t('settings.version', { version: appVersion })}
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default SettingsScreen;
