import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { getDisplayName } from '../../lib/displayName';
import { ProfileAvatar } from '../common/ProfileAvatar';
import { useAchievements } from '../../hooks/useAchievements';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { getTitleLabel } from '../../lib/titles';
import { getActiveUserTasks } from '../../lib/userTasks';
import { pickShowcaseAchievements } from '../../lib/achievementProgress';
import { Achievement } from '../../types/database';
import { AppTheme } from '../../theme/theme';

const SHOWCASE_SLOTS = 3;

function ringColor(tier: number, theme: AppTheme): string {
  if (tier >= 4) return theme.star;
  if (tier === 3) return theme.warning;
  if (tier === 2) return theme.primary[200];
  return theme.primary[400];
}

export const UserPanel: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { glass: glassmorphismStyles, panel: panelStyles, theme } = useThemedStyles();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { userProfile, achievements, unlockedAchievements, selectedTitle } = useAchievements();

  const { tasks, tierIndex, tierTotal, subtitleKey, allComplete } = useMemo(
    () => getActiveUserTasks(userProfile, (screen) => navigation.navigate(screen)),
    [navigation, userProfile],
  );

  const showcase = useMemo(() => {
    const unlockedIds = new Set(unlockedAchievements.map((row) => row.achievement_id));
    return pickShowcaseAchievements(achievements, unlockedIds);
  }, [achievements, unlockedAchievements]);

  const slots: Array<Achievement | null> = Array.from(
    { length: SHOWCASE_SLOTS },
    (_, index) => showcase[index] ?? null,
  );

  const completedTasks = tasks.filter((task) => task.isComplete).length;
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);
  const selectedBadge = showcase.find((achievement) => achievement.id === selectedBadgeId) ?? null;

  return (
    <View style={panelStyles.profileColumn}>
      <View style={panelStyles.identityBlock}>
        <View style={panelStyles.portraitRing}>
          <View style={panelStyles.portraitInnerRing}>
            <ProfileAvatar
              avatarUrl={userProfile?.avatar_url}
              size={92}
              variant="default"
            />
          </View>
        </View>
        <Text style={panelStyles.identityName}>
          {getDisplayName(user ?? null) || t('profile.user')}
        </Text>
        <Text style={panelStyles.identityTitle}>
          {selectedTitle ? getTitleLabel(selectedTitle, t) : t('titles.novice')}
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12 }}
      >
        <View style={[glassmorphismStyles.glassCard, { marginBottom: 20 }]}>
          <View style={[panelStyles.statsContainer, { marginTop: 0 }]}>
            <View style={panelStyles.statItem}>
              <Text style={panelStyles.statNumber}>{userProfile?.total_benches_created || 0}</Text>
              <Text style={panelStyles.statLabel}>{t('profile.addedBenches')}</Text>
            </View>
            <View style={panelStyles.statItem}>
              <Text style={[panelStyles.statNumber, { color: theme.warning }]}>
                {userProfile?.current_streak || 0}
              </Text>
              <Text style={panelStyles.statLabel}>{t('streak.label')}</Text>
            </View>
          </View>
        </View>

        <View style={glassmorphismStyles.glassCard}>
          <Text style={glassmorphismStyles.cardTitle}>{t('tasks.title')}</Text>
          <Text style={glassmorphismStyles.cardSubtitle}>
            {allComplete
              ? t('tasks.allComplete')
              : `${t(subtitleKey)} · ${t('tasks.tier', { current: tierIndex, total: tierTotal })} · ${t('tasks.progress', { done: completedTasks, total: tasks.length })}`}
          </Text>

          <View style={{ marginTop: 15 }}>
            {!allComplete && tasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={[
                  panelStyles.taskItem,
                  task.isComplete && panelStyles.taskItemCompleted,
                ]}
                onPress={task.onPress}
              >
                <Ionicons
                  name={task.isComplete ? 'checkmark-circle' : task.icon}
                  size={20}
                  color={task.isComplete ? theme.success : theme.primary[400]}
                />
                <Text
                  style={[
                    panelStyles.taskText,
                    task.isComplete && panelStyles.taskTextCompleted,
                  ]}
                >
                  {t(task.labelKey, task.labelParams)}
                </Text>
                <Ionicons
                  name={task.isComplete ? 'checkmark' : 'chevron-forward'}
                  size={16}
                  color={task.isComplete ? theme.success : theme.text.secondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[panelStyles.badgeFooter, { paddingBottom: insets.bottom + 16 }]}>
        {selectedBadge && (
          <>
            <Text style={panelStyles.badgeCaption}>
              {t(`achievements.${selectedBadge.name}`) || selectedBadge.name}
            </Text>
            {selectedBadge.description ? (
              <Text style={panelStyles.badgeCaptionDetail}>
                {t(selectedBadge.description)}
              </Text>
            ) : null}
          </>
        )}
        <View style={panelStyles.badgeRow}>
          {slots.map((achievement, index) => {
            const medallionStyle = [
              panelStyles.badgeMedallion,
              achievement
                ? { borderColor: ringColor(achievement.token_tier, theme) }
                : panelStyles.badgeMedallionEmpty,
            ];
            if (!achievement) {
              return <View key={`empty-${index}`} style={medallionStyle} />;
            }
            return (
              <TouchableOpacity
                key={achievement.id}
                activeOpacity={0.8}
                onPress={() =>
                  setSelectedBadgeId((current) =>
                    current === achievement.id ? null : achievement.id,
                  )
                }
                style={medallionStyle}
              >
                <Text style={panelStyles.badgeEmoji}>{achievement.icon}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};
