import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useAchievements } from '../../hooks/useAchievements';

export const BenchPanel: React.FC = () => {
  const { t } = useTranslation();
  const { glass: glassmorphismStyles, panel: panelStyles, theme } = useThemedStyles();
  const navigation = useNavigation<any>();
  const { userProfile } = useAchievements();

  const handleAddBench = () => {
    navigation.navigate('AddBench');
  };

  const handleMyBenches = () => {
    navigation.navigate('MyBenches');
  };

  const handleFavorites = () => {};

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10 }}>
      <TouchableOpacity 
        style={[glassmorphismStyles.glassCard, { marginBottom: 20 }]}
        onPress={handleAddBench}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={panelStyles.iconContainer}>
            <Ionicons name="add" size={24} color={theme.primary[400]} />
          </View>
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={glassmorphismStyles.cardTitle}>{t('swipe.addBench')}</Text>
            <Text style={glassmorphismStyles.cardSubtitle}>{t('addBench.title')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.text.secondary} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[glassmorphismStyles.glassCard, { marginBottom: 20 }]}
        onPress={handleMyBenches}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={panelStyles.iconContainer}>
            <Ionicons name="list" size={24} color={theme.primary[400]} />
          </View>
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={glassmorphismStyles.cardTitle}>{t('swipe.myBenches')}</Text>
            <Text style={glassmorphismStyles.cardSubtitle}>{t('profile.myBenchesSubtitle')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.text.secondary} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[glassmorphismStyles.glassCard, { marginBottom: 20 }]}
        onPress={handleFavorites}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={panelStyles.iconContainer}>
            <Ionicons name="heart" size={24} color={theme.primary[400]} />
          </View>
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={glassmorphismStyles.cardTitle}>{t('swipe.favorites')}</Text>
            <Text style={glassmorphismStyles.cardSubtitle}>{t('favorites.myFavorites')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.text.secondary} />
        </View>
      </TouchableOpacity>

      <View style={[glassmorphismStyles.glassCard]}>
        <Text style={glassmorphismStyles.cardTitle}>{t('stats.title')}</Text>
        <Text style={glassmorphismStyles.cardSubtitle}>{t('stats.subtitle')}</Text>
        
        <View style={panelStyles.statsContainer}>
          <View style={panelStyles.statItem}>
            <Text style={panelStyles.statNumber}>{userProfile?.total_benches_created || 0}</Text>
            <Text style={panelStyles.statLabel}>{t('stats.myBenches')}</Text>
          </View>
          <View style={panelStyles.statItem}>
            <Text style={panelStyles.statNumber}>{userProfile?.total_favorites || 0}</Text>
            <Text style={panelStyles.statLabel}>{t('stats.favorites')}</Text>
          </View>
          <View style={panelStyles.statItem}>
            <Text style={panelStyles.statNumber}>{userProfile?.total_ratings_given || 0}</Text>
            <Text style={panelStyles.statLabel}>{t('stats.ratings')}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
