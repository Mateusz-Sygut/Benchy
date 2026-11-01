import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { BenchMapMarker, BENCH_MARKER_ANCHOR } from '../components/common/BenchMapMarker';
import { BenchTypeIcon } from '../components/common/BenchTypeIcon';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useAchievements } from '../hooks/useAchievements';
import { Button } from '../components/common/Button';
import { SitSessionCard } from '../components/bench/SitSessionCard';
import supabase from '../lib/supabase';
import { reverseGeocode, formatCityForDisplay } from '../lib/geocoding';
import { Database } from '../types/database';
import { useThemedStyles } from '../hooks/useThemedStyles';

type Bench = Database['public']['Tables']['benches']['Row'];

const BenchDetailsScreen = ({ route }: any) => {
  const { benchId } = route.params;
  const { user } = useAuth();
  const { t } = useTranslation();
  const { screen: screenStyles, theme } = useThemedStyles();
  const { refreshProgress } = useAchievements();
  const [bench, setBench] = useState<Bench | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [rarities, setRarities] = useState<any[]>([]);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [benchTypeName, setBenchTypeName] = useState<string | null>(null);
  const [benchTypeEmoji, setBenchTypeEmoji] = useState<string>('🪑');

  useEffect(() => {
    loadBenchDetails();
    loadRarities();
    loadFavorite();
  }, [benchId, user?.id]);

  const loadRarities = async () => {
    try {
      const { data, error } = await supabase
        .from('rarity')
        .select('*')
        .order('level', { ascending: true });

      if (error) {
        console.error('Error loading rarities:', error);
        return;
      }

      setRarities(data || []);
    } catch (error) {
      console.error('Error loading rarities:', error);
    }
  };

  const loadBenchDetails = async () => {
    try {
      const { data: benchData, error: benchError } = await supabase
        .from('benches')
        .select('*')
        .eq('id', benchId)
        .single();

      if (benchError) {
        console.error('Error loading bench:', benchError);
        Alert.alert(t('common.error'), t('errors.failedToLoadBench'));
        return;
      }

      const typedBench = benchData as Bench;
      setBench(typedBench);
      await Promise.all([
        loadLocation(typedBench.latitude, typedBench.longitude),
        loadBenchTypeIcon(typedBench.bench_type_id),
      ]);
    } catch (error) {
      console.error('Error loading bench details:', error);
      Alert.alert(t('common.error'), t('errors.failedToLoadData'));
    }
  };

  const loadFavorite = async () => {
    if (!user) {
      setIsFavorite(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('bench_id', benchId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading favorite:', error);
        return;
      }

      setIsFavorite((data || []).length > 0);
    } catch (error) {
      console.error('Error loading favorite:', error);
    }
  };

  const loadLocation = async (latitude: number, longitude: number) => {
    try {
      const result = await reverseGeocode(latitude, longitude, t);
      const city = formatCityForDisplay(result, t);
      const district =
        result?.district &&
        result.district !== city
          ? result.district
          : null;

      if (district) {
        setLocationLabel(`${city}, ${district}`);
      } else {
        setLocationLabel(city);
      }
    } catch (error) {
      console.error('Error loading location label:', error);
      setLocationLabel(t('geocoding.unknownLocation'));
    }
  };

  const loadBenchTypeIcon = async (benchTypeId: string | null) => {
    if (!benchTypeId) {
      setBenchTypeName(null);
      setBenchTypeEmoji('🪑');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bench_types')
        .select('name, icon')
        .eq('id', benchTypeId)
        .single();

      if (error) {
        console.error('Error loading bench type icon:', error);
        setBenchTypeName(null);
        setBenchTypeEmoji('🪑');
        return;
      }

      setBenchTypeName((data as any)?.name ?? null);
      setBenchTypeEmoji((data as any)?.icon || '🪑');
    } catch (error) {
      console.error('Error loading bench type icon:', error);
      setBenchTypeName(null);
      setBenchTypeEmoji('🪑');
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      Alert.alert(t('common.error'), t('errors.mustBeLoggedIn'));
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('bench_id', benchId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error removing favorite:', error);
          Alert.alert(t('common.error'), t('errors.failedToUpdateRarity'));
          return;
        }

        setIsFavorite(false);
        await refreshProgress();
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert([{ bench_id: benchId, user_id: user.id }] as any);

        if (error) {
          console.error('Error adding favorite:', error);
          Alert.alert(t('common.error'), t('errors.failedToUpdateRarity'));
          return;
        }

        setIsFavorite(true);
        await refreshProgress();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const submitRarity = async () => {
    if (!selectedRarity || !bench) {
      Alert.alert(t('common.error'), t('benchDetails.selectRarity'));
      return;
    }

    setLoading(true);
    try {
      const { error } = await (supabase as any)
        .from('benches')
        .update({ rarity_id: selectedRarity })
        .eq('id', bench.id);

      if (error) {
        console.error('Error updating rarity:', error);
        Alert.alert(t('common.error'), t('errors.failedToUpdateRarity'));
        return;
      }

      Alert.alert(t('common.success'), t('benchDetails.rarityUpdated'));
      setSelectedRarity(null);
      loadBenchDetails();
    } catch (error) {
      console.error('Error updating rarity:', error);
      Alert.alert(t('common.error'), t('errors.failedToUpdateRarity'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL');
  };

  if (!bench) {
    return (
      <View style={screenStyles.benchDetailsContainer}>
        <Text style={screenStyles.benchDetailsLoading}>{t('common.loading')}</Text>
      </View>
    );
  }

  const benchRarityLevel =
    rarities.find((rarity) => rarity.id === bench.rarity_id)?.level ?? 1;

  return (
    <ScrollView style={screenStyles.benchDetailsContainer} contentContainerStyle={screenStyles.benchDetailsScrollContent}>
      <View style={screenStyles.benchDetailsMiniMapCard}>
        <MapView
          style={screenStyles.benchDetailsMiniMap}
          initialRegion={{
            latitude: bench.latitude,
            longitude: bench.longitude,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          pointerEvents="none"
        >
          <Marker
            coordinate={{
              latitude: bench.latitude,
              longitude: bench.longitude,
            }}
            title={bench.name}
            anchor={BENCH_MARKER_ANCHOR}
            tracksViewChanges={false}
          >
            <BenchMapMarker rarityLevel={benchRarityLevel} size={18} />
          </Marker>
        </MapView>
      </View>

      <View style={screenStyles.benchDetailsBenchInfo}>
        <View style={screenStyles.benchDetailsIcon}>
          <BenchTypeIcon
            typeName={benchTypeName}
            emojiFallback={benchTypeEmoji}
            size={56}
          />
        </View>
        <View style={screenStyles.benchDetailsBenchDetails}>
          <TouchableOpacity
            style={[
              screenStyles.benchDetailsFavoriteChip,
              isFavorite && screenStyles.benchDetailsFavoriteChipActive,
            ]}
            onPress={toggleFavorite}
            disabled={favoriteLoading}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? theme.error : theme.primary[600]}
            />
          </TouchableOpacity>
          <Text style={screenStyles.benchDetailsBenchName}>
            {bench.name}
          </Text>
          {bench.description && bench.description.trim() !== (bench.name || '').trim() && (
            <Text style={screenStyles.benchDetailsDescription}>
              {bench.description}
            </Text>
          )}
          <Text style={screenStyles.benchDetailsLocation}>
            📍 {locationLabel || t('geocoding.unknownLocation')}
          </Text>
          <Text style={screenStyles.benchDetailsAddedBy}>
            {t('benchDetails.addedOn')} {formatDate(bench.created_at)}
          </Text>
        </View>
      </View>

      <SitSessionCard
        benchId={bench.id}
        benchName={bench.name || t('bench.unnamedBench')}
        latitude={bench.latitude}
        longitude={bench.longitude}
      />

      <View style={screenStyles.benchDetailsSection}>
        <Text style={screenStyles.benchDetailsSectionTitle}>
          {t('benchDetails.setRarity')}
        </Text>
        <View style={screenStyles.benchDetailsRarityContainer}>
          {rarities.map((rarity) => (
            <Button
              key={rarity.id}
              title={t(`rarity.${rarity.name}`)}
              onPress={() => setSelectedRarity(rarity.id)}
              style={[
                screenStyles.benchDetailsRarityButton,
                selectedRarity === rarity.id && screenStyles.benchDetailsRarityButtonSelected
              ]}
            />
          ))}
        </View>
        <View style={screenStyles.benchDetailsSubmitButton}>
          <Button
            title={loading ? t('benchDetails.updating') : t('benchDetails.updateRarityButton')}
            onPress={submitRarity}
            loading={loading}
            disabled={loading || !selectedRarity}
          />
        </View>
      </View>
    </ScrollView>
  );
};


export default BenchDetailsScreen;