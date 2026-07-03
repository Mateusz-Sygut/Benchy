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
import { getDisplayName } from '../lib/displayName';
import { getTitleLabel } from '../lib/titles';
import { useAchievements } from '../hooks/useAchievements';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { Button } from '../components/common/Button';
import { ProfileAvatar } from '../components/common/ProfileAvatar';
import { useProfileAvatar } from '../hooks/useProfileAvatar';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { screen: screenStyles, theme } = useThemedStyles();
  const {
    userProfile,
    achievements,
    unlockedAchievements,
    titles,
    unlockedTitles,
    selectedTitle,
    selectTitle,
  } = useAchievements();
  const { avatarUrl, uploading, showAvatarOptions } = useProfileAvatar();

  const hasBenchUserTitle = unlockedTitles.some((title) => title.name === 'benchUser');
  const showTitleUnlockHint = !hasBenchUserTitle;

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
      onPress: () => {
        navigation.navigate('Settings');
      },
    },
    {
      icon: 'help-circle-outline',
      title: t('profile.help'),
      subtitle: t('profile.helpSubtitle'),
      onPress: () => {
        navigation.navigate('Help');
      },
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
              <ProfileAvatar
                avatarUrl={avatarUrl}
                size={80}
                variant="onPrimary"
                editable
                uploading={uploading}
                onPress={showAvatarOptions}
              />
            </View>
            {selectedTitle && (
              <Text style={screenStyles.profileUserTitle}>
                {getTitleLabel(selectedTitle, t)}
              </Text>
            )}
            <Text style={screenStyles.profileUserName}>
              {getDisplayName(user ?? null) || t('profile.user')}
            </Text>
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
          <View style={screenStyles.profileStatDivider} />
          <View style={screenStyles.profileStatItem}>
            <Text style={[screenStyles.profileStatNumber, { color: theme.warning }]}>
              {userProfile?.current_streak || 0}
            </Text>
            <Text style={screenStyles.profileStatLabel}>{t('streak.label')}</Text>
          </View>
        </View>
        <View style={screenStyles.profileStreakCard}>
          <View style={screenStyles.profileStreakIconWrap}>
            <Text style={screenStyles.profileStreakIcon}>🔥</Text>
          </View>
          <View style={screenStyles.profileStreakContent}>
            <Text style={screenStyles.profileStreakTitle}>
              {t('streak.current', { count: userProfile?.current_streak || 0 })}
            </Text>
            <Text style={screenStyles.profileStreakSubtitle}>{t('streak.subtitle')}</Text>
            {(userProfile?.longest_streak ?? 0) > (userProfile?.current_streak ?? 0) && (
              <Text style={screenStyles.profileStreakBest}>
                {t('streak.best', { count: userProfile?.longest_streak ?? 0 })}
              </Text>
            )}
          </View>
        </View>
        {showTitleUnlockHint && (
          <View style={screenStyles.profileUnlockHint}>
            <Text style={screenStyles.profileUnlockHintText}>{t('profile.unlockHint')}</Text>
          </View>
        )}

        {titles.length > 0 && (
          <View style={screenStyles.profileTitlesCard}>
            <Text style={screenStyles.profileAchievementsTitle}>{t('titles.sectionTitle')}</Text>
            <Text style={[screenStyles.profileMenuSubtitle, { marginTop: 4, marginBottom: 12 }]}>
              {t('titles.selectHint')}
            </Text>
            <View style={screenStyles.profileAchievementsRow}>
              {titles.map((title) => {
                const isUnlocked = unlockedTitles.some((ut) => ut.id === title.id);
                const isSelected = selectedTitle?.id === title.id;
                return (
                  <TouchableOpacity
                    key={title.id}
                    disabled={!isUnlocked}
                    onPress={() => selectTitle(title.id)}
                    style={[
                      screenStyles.profileTitleChip,
                      !isUnlocked && screenStyles.profileAchievementChipLocked,
                      isSelected && screenStyles.profileTitleChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        screenStyles.profileAchievementName,
                        isSelected && { color: theme.primary[700], fontWeight: '700' },
                      ]}
                      numberOfLines={1}
                    >
                      {getTitleLabel(title, t)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

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
