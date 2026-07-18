import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
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
import { formatAchievementProgress } from '../../lib/achievementProgress';
import { Achievement, UserAchievement } from '../../types/database';

export const UserPanel: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { glass: glassmorphismStyles, panel: panelStyles, theme } = useThemedStyles();
  const { user } = useAuth();
  const { userProfile, achievements, unlockedAchievements, selectedTitle } = useAchievements();

  const { tasks, tierIndex, tierTotal, subtitleKey, allComplete } = useMemo(
    () => getActiveUserTasks(userProfile, (screen) => navigation.navigate(screen)),
    [navigation, userProfile],
  );

  const completedTasks = tasks.filter((task) => task.isComplete).length;

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10 }}>
      <View style={[glassmorphismStyles.glassCard, { marginBottom: 20 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <View style={panelStyles.avatarContainer}>
            <ProfileAvatar
              avatarUrl={userProfile?.avatar_url}
              size={48}
              variant="default"
              onPress={() => navigation.navigate('Profile')}
            />
          </View>
          <View style={{ marginLeft: 15 }}>
            <Text style={glassmorphismStyles.cardTitle}>{getDisplayName(user ?? null) || t('profile.user')}</Text>
            <Text style={glassmorphismStyles.cardSubtitle}>
              {selectedTitle ? getTitleLabel(selectedTitle, t) : t('titles.novice')}
            </Text>
          </View>
        </View>
        
        <View style={panelStyles.statsContainer}>
          <View style={panelStyles.statItem}>
            <Text style={panelStyles.statNumber}>{userProfile?.total_benches_created || 0}</Text>
            <Text style={panelStyles.statLabel}>{t('profile.addedBenches')}</Text>
          </View>
          <View style={panelStyles.statItem}>
            <Text style={panelStyles.statNumber}>{userProfile?.total_ratings_given || 0}</Text>
            <Text style={panelStyles.statLabel}>{t('profile.givenRatings')}</Text>
          </View>
          <View style={panelStyles.statItem}>
            <Text style={[panelStyles.statNumber, { color: theme.warning }]}>
              {userProfile?.current_streak || 0}
            </Text>
            <Text style={panelStyles.statLabel}>{t('streak.label')}</Text>
          </View>
        </View>
      </View>

      <View style={[glassmorphismStyles.glassCard, { marginBottom: 20 }]}>
        <Text style={glassmorphismStyles.cardTitle}>{t('achievements.title')}</Text>
        <Text style={glassmorphismStyles.cardSubtitle}>
          {unlockedAchievements.length} / {achievements.length} {t('achievements.unlocked')}
        </Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 15 }}>
          {achievements.map((achievement: Achievement) => {
            const isUnlocked = unlockedAchievements.some((ua: UserAchievement) => ua.achievement_id === achievement.id);
            const progressLabel = !isUnlocked
              ? formatAchievementProgress(achievement, userProfile, t)
              : null;
            return (
              <View 
                key={achievement.id} 
                style={[
                  panelStyles.achievementCard,
                  !isUnlocked && panelStyles.achievementCardLocked
                ]}
              >
                {!isUnlocked && (
                  <View style={panelStyles.achievementLockIcon}>
                    <Ionicons name="lock-closed" size={12} color={theme.text.secondary} />
                  </View>
                )}
                <Text style={panelStyles.achievementIcon}>{achievement.icon}</Text>
                <Text style={panelStyles.achievementName}>
                  {t(`achievements.${achievement.name}`) || achievement.name}
                </Text>
                {!isUnlocked && achievement.description && (
                  <Text style={panelStyles.achievementCardDescription} numberOfLines={2}>
                    {t(achievement.description)}
                  </Text>
                )}
                {!isUnlocked && progressLabel && (
                  <Text style={panelStyles.achievementCardProgress}>
                    {progressLabel}
                  </Text>
                )}
                {isUnlocked && (
                  <View style={panelStyles.achievementBadge}>
                    <Ionicons name="checkmark" size={12} color={theme.text.white} />
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View style={[glassmorphismStyles.glassCard]}>
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
  );
};