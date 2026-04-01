import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getDisplayName } from '../lib/displayName';
import { useAchievements } from '../hooks/useAchievements';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { Button } from '../components/common/Button';
import { ThemePreference } from '../theme/theme';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { preference, setPreference } = useTheme();
  const { screen: screenStyles, theme } = useThemedStyles();
  const { userProfile, achievements, unlockedAchievements } = useAchievements();

  const handleSignOut = () => {
    Alert.alert(
      t('auth.logout'),
      t('profile.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('auth.logout'), style: 'destructive', onPress: signOut },
      ]
    );
  };

  const themeOptions: { key: ThemePreference; label: string }[] = [
    { key: 'system', label: t('profile.themeSystem') },
    { key: 'light', label: t('profile.themeLight') },
    { key: 'dark', label: t('profile.themeDark') },
  ];

  const menuItems = [
    {
      icon: 'map-outline',
      title: t('profile.myBenches'),
      subtitle: t('profile.myBenchesSubtitle'),
      onPress: () => {
        navigation.navigate('MyBenches');
      },
    },
    {
      icon: 'star-outline',
      title: t('profile.myRatings'),
      subtitle: t('profile.myRatingsSubtitle'),
      onPress: () => {
        navigation.navigate('MyRatings');
      },
    },
    {
      icon: 'settings-outline',
      title: t('profile.settings'),
      subtitle: t('profile.settingsSubtitle'),
      onPress: () => {},
    },
    {
      icon: 'help-circle-outline',
      title: t('profile.help'),
      subtitle: t('profile.helpSubtitle'),
      onPress: () => {},
    },
  ];

  return (
    <>
      <StatusBar
        barStyle={theme.statusBarStyle === 'light' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.primary[900]}
      />
      <ScrollView style={screenStyles.profileContainer}>
        <LinearGradient
          colors={[...theme.gradient.primary] as [string, string, string]}
          style={screenStyles.profileHeader}
        >
          <View style={screenStyles.profileProfileSection}>
            <View style={screenStyles.profileAvatarContainer}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                style={screenStyles.profileAvatar}
              >
                <Ionicons name="person" size={40} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={screenStyles.profileUserName}>
              {getDisplayName(user ?? null) || t('profile.user')}
            </Text>
            <Text style={screenStyles.profileUserEmail}>{user?.email}</Text>
          </View>
        </LinearGradient>

        <View style={screenStyles.profileStatsCard}>
          <View style={screenStyles.profileStatItem}>
            <Text style={screenStyles.profileStatNumber}>{userProfile?.total_benches_created || 0}</Text>
            <Text style={screenStyles.profileStatLabel}>{t('profile.addedBenches')}</Text>
          </View>
          <View style={screenStyles.profileStatDivider} />
          <View style={screenStyles.profileStatItem}>
            <Text style={screenStyles.profileStatNumber}>{userProfile?.total_ratings_given || 0}</Text>
            <Text style={screenStyles.profileStatLabel}>{t('profile.givenRatings')}</Text>
          </View>
        </View>
        <View style={screenStyles.profileUnlockHint}>
          <Text style={screenStyles.profileUnlockHintText}>{t('profile.unlockHint')}</Text>
        </View>

        <View style={[screenStyles.profileMenuCard, { marginTop: 12 }]}>
          <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
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
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 14,
                      borderRadius: 20,
                      borderWidth: 2,
                      borderColor: selected ? theme.primary[600] : theme.gray[300],
                      backgroundColor: selected ? theme.gradient.light : theme.background.primary,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: selected ? theme.primary[700] : theme.text.secondary,
                      }}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {achievements.length > 0 && (
          <View style={screenStyles.profileAchievementsCard}>
            <View style={screenStyles.profileAchievementsHeader}>
              <Text style={screenStyles.profileAchievementsTitle}>{t('achievements.title')}</Text>
              <Text style={screenStyles.profileAchievementsCounter}>
                {unlockedAchievements.length} / {achievements.length} {t('achievements.unlocked')}
              </Text>
            </View>
            <View style={screenStyles.profileAchievementsRow}>
              {achievements.slice(0, 4).map((achievement) => {
                const isUnlocked = unlockedAchievements.some(
                  (ua) => ua.achievement_id === achievement.id
                );
                return (
                  <View
                    key={achievement.id}
                    style={[
                      screenStyles.profileAchievementChip,
                      !isUnlocked && screenStyles.profileAchievementChipLocked,
                    ]}
                  >
                    <Text style={screenStyles.profileAchievementIcon}>{achievement.icon}</Text>
                    <Text style={screenStyles.profileAchievementName} numberOfLines={1}>
                      {t(`achievements.${achievement.name}`) || achievement.name}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={screenStyles.profileMenuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                screenStyles.profileMenuItem,
                index < menuItems.length - 1 && screenStyles.profileMenuItemBorder,
              ]}
              onPress={item.onPress}
            >
              <View style={screenStyles.profileMenuItemContent}>
                <View style={screenStyles.profileMenuIconContainer}>
                  <Ionicons name={item.icon as any} size={24} color={theme.primary[900]} />
                </View>
                <View style={screenStyles.profileMenuTextContainer}>
                  <Text style={screenStyles.profileMenuTitle}>{item.title}</Text>
                  <Text style={screenStyles.profileMenuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.gray[400]} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={screenStyles.profileLogoutContainer}>
          <Button
            title={t('auth.logout')}
            variant="danger"
            onPress={handleSignOut}
            icon="log-out-outline"
          />
        </View>
      </ScrollView>
    </>
  );
};

export default ProfileScreen;
