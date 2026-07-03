import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { ExtendedBench } from '../../types/database';
import { distanceKm, formatDistanceKm } from '../../lib/geocoding';
import supabase from '../../lib/supabase';

const TIP_KEYS = ['tips.addBench', 'tips.rarity', 'tips.explore', 'tips.favorites'] as const;
const NEARBY_LIMIT = 10;
const NEARBY_FETCH_LIMIT = 200;

type NearbyBench = ExtendedBench & { distanceKm?: number };

interface NearbyBenchesPanelProps {
  onBenchPress?: (bench: ExtendedBench) => void;
}

export const NearbyBenchesPanel: React.FC<NearbyBenchesPanelProps> = ({ onBenchPress }) => {
  const { t } = useTranslation();
  const { glass: glassmorphismStyles, panel: panelStyles, theme } = useThemedStyles();
  const navigation = useNavigation<any>();
  const [nearbyBenches, setNearbyBenches] = useState<NearbyBench[]>([]);
  const [loading, setLoading] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [sortedByLocation, setSortedByLocation] = useState(false);

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
        .limit(NEARBY_FETCH_LIMIT);

      if (error) {
        console.error('Error loading nearby benches:', error);
        return;
      }

      const benches: NearbyBench[] = (data || []).map((bench) => ({
        ...(bench as ExtendedBench),
        is_favorite: false,
      }));

      let userCoords: { latitude: number; longitude: number } | null = null;
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        try {
          const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          userCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        } catch {
          const lastKnown = await Location.getLastKnownPositionAsync();
          if (lastKnown) {
            userCoords = {
              latitude: lastKnown.coords.latitude,
              longitude: lastKnown.coords.longitude,
            };
          }
        }
      }

      if (userCoords) {
        const withDistance = benches
          .map((bench) => ({
            ...bench,
            distanceKm: distanceKm(userCoords!, {
              latitude: bench.latitude,
              longitude: bench.longitude,
            }),
          }))
          .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
          .slice(0, NEARBY_LIMIT);

        setNearbyBenches(withDistance);
        setSortedByLocation(true);
      } else {
        const recent = [...benches]
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          .slice(0, NEARBY_LIMIT);

        setNearbyBenches(recent);
        setSortedByLocation(false);
      }
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

  const renderBenchItem = ({ item: bench }: { item: NearbyBench }) => (
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

          {bench.distanceKm !== undefined && (
            <View style={panelStyles.benchCardRatingContainer}>
              <Ionicons name="navigate-outline" size={14} color={theme.primary[400]} />
              <Text style={[panelStyles.benchRating, panelStyles.benchCardRatingText]}>
                {formatDistanceKm(bench.distanceKm)}
              </Text>
            </View>
          )}
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
        {!sortedByLocation && nearbyBenches.length > 0 && (
          <Text style={[panelStyles.emptyStateText, { marginBottom: 12, textAlign: 'center' }]}>
            {t('nearby.locationFallback')}
          </Text>
        )}
        {nearbyBenches.length === 0 ? (
          <View style={panelStyles.emptyState}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Ionicons name="radio-outline" size={28} color={theme.primary[400]} />
              <Text style={[panelStyles.emptyStateTitle, { marginTop: 0, marginLeft: 8 }]}>
                {t('tips.panelTitle')}
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
