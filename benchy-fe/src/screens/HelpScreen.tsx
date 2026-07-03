import React from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemedStyles } from '../hooks/useThemedStyles';

const FAQ_KEYS = ['addBench', 'rate', 'titles', 'streak', 'favorites'] as const;

const HelpScreen = () => {
  const { t } = useTranslation();
  const { screen: screenStyles, theme } = useThemedStyles();

  return (
    <>
      <StatusBar
        barStyle={theme.statusBarStyle === 'light' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background.primary}
      />
      <ScrollView style={screenStyles.profileContainer} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={[screenStyles.profileMenuCard, { marginTop: 16 }]}>
          <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
            <Text style={screenStyles.profileMenuSubtitle}>{t('help.intro')}</Text>
          </View>
        </View>

        {FAQ_KEYS.map((key) => (
          <View
            key={key}
            style={[
              screenStyles.profileMenuCard,
              { marginTop: 12, marginHorizontal: 16 },
            ]}
          >
            <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
              <Text style={screenStyles.profileMenuTitle}>{t(`help.faq.${key}.q`)}</Text>
              <Text style={[screenStyles.profileMenuSubtitle, { marginTop: 8, lineHeight: 20 }]}>
                {t(`help.faq.${key}.a`)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </>
  );
};

export default HelpScreen;
