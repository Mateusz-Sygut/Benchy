import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { glassmorphismStyles, panelStyles } from '../../styles/glassmorphism';
import { colors } from '../../styles/colors';

export const BenchPanel: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const handleAddBench = () => {
    navigation.navigate('AddBench');
  };

  const handleMyBenches = () => {
    // Navigate to user's benches
  };

  const handleFavorites = () => {
    // Navigate to favorites
  };

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10 }}>
      {/* Add Bench Section */}
      <TouchableOpacity 
        style={[glassmorphismStyles.glassCard, { marginBottom: 20 }]}
        onPress={handleAddBench}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={panelStyles.iconContainer}>
            <Ionicons name="add" size={24} color={colors.primary[400]} />
          </View>
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={glassmorphismStyles.cardTitle}>{t('swipe.addBench')}</Text>
            <Text style={glassmorphismStyles.cardSubtitle}>{t('addBench.title')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
        </View>
      </TouchableOpacity>

      {/* My Benches Section */}
      <TouchableOpacity 
        style={[glassmorphismStyles.glassCard, { marginBottom: 20 }]}
        onPress={handleMyBenches}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={panelStyles.iconContainer}>
            <Ionicons name="list" size={24} color={colors.primary[400]} />
          </View>
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={glassmorphismStyles.cardTitle}>{t('swipe.myBenches')}</Text>
            <Text style={glassmorphismStyles.cardSubtitle}>{t('profile.myBenchesSubtitle')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
        </View>
      </TouchableOpacity>

      {/* Favorites Section */}
      <TouchableOpacity 
        style={[glassmorphismStyles.glassCard, { marginBottom: 20 }]}
        onPress={handleFavorites}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={panelStyles.iconContainer}>
            <Ionicons name="heart" size={24} color={colors.primary[400]} />
          </View>
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={glassmorphismStyles.cardTitle}>{t('swipe.favorites')}</Text>
            <Text style={glassmorphismStyles.cardSubtitle}>{t('favorites.myFavorites')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
        </View>
      </TouchableOpacity>

      {/* Quick Stats */}
      <View style={[glassmorphismStyles.glassCard]}>
        <Text style={glassmorphismStyles.cardTitle}>{t('stats.title')}</Text>
        <Text style={glassmorphismStyles.cardSubtitle}>{t('stats.subtitle')}</Text>
        
        <View style={panelStyles.statsContainer}>
          <View style={panelStyles.statItem}>
            <Text style={panelStyles.statNumber}>0</Text>
            <Text style={panelStyles.statLabel}>{t('stats.myBenches')}</Text>
          </View>
          <View style={panelStyles.statItem}>
            <Text style={panelStyles.statNumber}>0</Text>
            <Text style={panelStyles.statLabel}>{t('stats.favorites')}</Text>
          </View>
          <View style={panelStyles.statItem}>
            <Text style={panelStyles.statNumber}>0</Text>
            <Text style={panelStyles.statLabel}>{t('stats.ratings')}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
