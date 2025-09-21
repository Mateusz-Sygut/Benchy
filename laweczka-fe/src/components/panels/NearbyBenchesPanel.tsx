import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { glassmorphismStyles, panelStyles } from '../../styles/glassmorphism';
import { colors } from '../../styles/colors';
import { ExtendedBench } from '../../types/database';
import supabase from '../../lib/supabase';

interface NearbyBenchesPanelProps {
  onBenchPress?: (bench: ExtendedBench) => void;
}

export const NearbyBenchesPanel: React.FC<NearbyBenchesPanelProps> = ({ onBenchPress }) => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [nearbyBenches, setNearbyBenches] = useState<ExtendedBench[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNearbyBenches();
  }, []);

  const loadNearbyBenches = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('benches')
        .select(`
          *,
          rarity:rarity_id(id, name, level, color, description, created_at),
          bench_type:bench_type_id(id, name, icon, created_at),
          location:location_id(id, name, icon, created_at)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading nearby benches:', error);
        return;
      }

      setNearbyBenches(data || []);
    } catch (error) {
      console.error('Error loading nearby benches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBenchPress = (bench: ExtendedBench) => {
    if (onBenchPress) {
      onBenchPress(bench);
    } else {
      // Fallback - jeśli nie ma funkcji, otwórz szczegóły
      navigation.navigate('BenchDetails', { benchId: bench.id });
    }
  };

  const renderBenchItem = ({ item: bench }: { item: ExtendedBench }) => (
    <TouchableOpacity 
      style={panelStyles.benchCard}
      onPress={() => handleBenchPress(bench)}
    >
      <View>
        <View style={panelStyles.benchCardHeader}>
          <Text style={[panelStyles.benchName, panelStyles.benchCardTitle]} numberOfLines={1}>
            {bench.name || bench.description || t('bench.unnamedBench')}
          </Text>
          <Ionicons name="chevron-forward" size={panelStyles.benchCardChevron.fontSize} color={panelStyles.benchCardChevron.color} />
        </View>
        
        {/* Rarity i ocena pod tytułem */}
        <View style={panelStyles.benchCardRarityContainer}>
          {/* Rzadkość */}
          <View style={[
            panelStyles.benchCardRarityBadge,
            { backgroundColor: bench.rarity?.color ? `${bench.rarity.color}30` : 'rgba(124, 179, 66, 0.3)' }
          ]}>
            <Text style={[
              panelStyles.benchCardRarityText,
              { color: bench.rarity?.color || colors.primary[400] }
            ]}>
              {bench.rarity?.name ? t(`rarity.${bench.rarity.name}`) : t('rarity.normal')}
            </Text>
          </View>
          
          {/* Ocena */}
          <View style={panelStyles.benchCardRatingContainer}>
            <Ionicons name="star" size={panelStyles.benchCardRatingIcon.fontSize} color={panelStyles.benchCardRatingIcon.color} />
            <Text style={[panelStyles.benchRating, panelStyles.benchCardRatingText]}>
              {bench.average_rating ? bench.average_rating.toFixed(1) : t('bench.noRating')}
            </Text>
          </View>
        </View>
        
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={panelStyles.nearbyBenchesContainer}>
      <ScrollView 
        style={panelStyles.nearbyBenchesScrollView}
        contentContainerStyle={panelStyles.nearbyBenchesContentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadNearbyBenches}
            tintColor={colors.text.white}
          />
        }
      >
        {nearbyBenches.length === 0 ? (
          <View style={panelStyles.emptyState}>
            <Ionicons name="location-outline" size={48} color={colors.text.secondary} />
            <Text style={panelStyles.emptyStateTitle}>{t('nearby.noBenches')}</Text>
            <Text style={panelStyles.emptyStateText}>{t('nearby.noBenchesText')}</Text>
          </View>
        ) : (
          nearbyBenches.map((bench) => (
            <View key={bench.id}>
              {renderBenchItem({ item: bench })}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};
