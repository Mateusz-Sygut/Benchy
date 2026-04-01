import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { ExtendedBench } from '../../types/database';
import supabase from '../../lib/supabase';

const TIP_KEYS = ['tips.addBench', 'tips.rarity', 'tips.explore', 'tips.favorites'] as const;

interface NearbyBenchesPanelProps {
  onBenchPress?: (bench: ExtendedBench) => void;
}

export const NearbyBenchesPanel: React.FC<NearbyBenchesPanelProps> = ({ onBenchPress }) => {
  const { t } = useTranslation();
  const { glass: glassmorphismStyles, panel: panelStyles, theme } = useThemedStyles();
  const navigation = useNavigation<any>();
  const [nearbyBenches, setNearbyBenches] = useState<ExtendedBench[]>([]);
  const [loading, setLoading] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    loadNearbyBenches();
  }, []);

  useEffect(() => {
    if (nearbyBenches.length > 0) return;
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % TIP_KEYS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [nearbyBenches.length]);

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
          <Ionicons name="chevron-forward" size={20} color={theme.glass.textMuted} />
        </View>

        <View style={panelStyles.benchCardRarityContainer}>
          <View style={[
            panelStyles.benchCardRarityBadge,
            { backgroundColor: bench.rarity?.color ? `${bench.rarity.color}30` : 'rgba(124, 179, 66, 0.3)' }
          ]}>
            <Text style={[
              panelStyles.benchCardRarityText,
              { color: bench.rarity?.color || theme.primary[400] }
            ]}>
              {bench.rarity?.name ? t(`rarity.${bench.rarity.name}`) : t('rarity.normal')}
            </Text>
          </View>

          <View style={panelStyles.benchCardRatingContainer}>
            <Ionicons name="star" size={14} color={theme.warning} />
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
            tintColor={theme.text.white}
          />
        }
      >
        {nearbyBenches.length === 0 ? (
          <View style={panelStyles.emptyState}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Ionicons name="radio-outline" size={28} color={theme.primary[400]} />
              <Text style={[panelStyles.emptyStateTitle, { marginTop: 0, marginLeft: 8 }]}>
                {t('tips.title')} ŁawAppki
              </Text>
            </View>
            <Text style={panelStyles.emptyStateText}>
              {t(TIP_KEYS[tipIndex])}
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 16, gap: 6 }}>
              {TIP_KEYS.map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: i === tipIndex ? theme.primary[400] : theme.text.secondary,
                  }}
                />
              ))}
            </View>
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
