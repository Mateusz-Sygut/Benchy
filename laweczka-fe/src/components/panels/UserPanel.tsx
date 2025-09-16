import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useAchievements } from '../../hooks/useAchievements';
import { glassmorphismStyles, panelStyles } from '../../styles/glassmorphism';
import { colors } from '../../styles/colors';
import { Achievement, UserAchievement } from '../../types/database';

export const UserPanel: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { userProfile, achievements, unlockedAchievements } = useAchievements();

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10 }}>
      {/* User Profile Section */}
      <View style={[glassmorphismStyles.glassCard, { marginBottom: 20 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <View style={panelStyles.avatarContainer}>
            <Ionicons name="person" size={30} color={colors.text.white} />
          </View>
          <View style={{ marginLeft: 15 }}>
            <Text style={glassmorphismStyles.cardTitle}>{user?.email || 'User'}</Text>
            <Text style={glassmorphismStyles.cardSubtitle}>
              {userProfile?.selected_title_id ? 
                t('titles.novice') : 
                t('titles.novice')
              }
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
            <Text style={panelStyles.statNumber}>{userProfile?.total_time_spent || 0}</Text>
            <Text style={panelStyles.statLabel}>min</Text>
              </View>
        </View>
      </View>

      {/* Achievements Section */}
      <View style={[glassmorphismStyles.glassCard, { marginBottom: 20 }]}>
        <Text style={glassmorphismStyles.cardTitle}>{t('achievements.title')}</Text>
        <Text style={glassmorphismStyles.cardSubtitle}>
          {unlockedAchievements.length} / {achievements.length} {t('achievements.unlocked')}
        </Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 15 }}>
          {achievements.map((achievement: Achievement) => {
            const isUnlocked = unlockedAchievements.some((ua: UserAchievement) => ua.achievement_id === achievement.id);
            return (
              <View 
                key={achievement.id} 
                style={[
                  panelStyles.achievementCard,
                  !isUnlocked && panelStyles.achievementCardLocked
                ]}
              >
                <Text style={panelStyles.achievementIcon}>{achievement.icon}</Text>
                <Text style={panelStyles.achievementName}>{achievement.name}</Text>
                {isUnlocked && (
                  <View style={panelStyles.achievementBadge}>
                    <Ionicons name="checkmark" size={12} color={colors.text.white} />
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Tasks Section */}
      <View style={[glassmorphismStyles.glassCard]}>
        <Text style={glassmorphismStyles.cardTitle}>{t('tasks.title')}</Text>
        <Text style={glassmorphismStyles.cardSubtitle}>{t('tasks.subtitle')}</Text>
        
        <View style={{ marginTop: 15 }}>
          <TouchableOpacity style={panelStyles.taskItem}>
            <Ionicons name="add-circle" size={20} color={colors.primary[400]} />
            <Text style={panelStyles.taskText}>{t('tasks.addFirstBench')}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={panelStyles.taskItem}>
            <Ionicons name="star" size={20} color={colors.primary[400]} />
            <Text style={panelStyles.taskText}>{t('tasks.rateBench')}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={panelStyles.taskItem}>
            <Ionicons name="heart" size={20} color={colors.primary[400]} />
            <Text style={panelStyles.taskText}>{t('tasks.addFavorite')}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
