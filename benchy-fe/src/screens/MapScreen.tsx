import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { Button } from '../components/common/Button';
import { ExpoMap } from '../components/common/ExpoMap';
import supabase from '../lib/supabase';
import { ExtendedBench } from '../types/database';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { screenStyles } from '../styles/screens';
import { colors } from '../styles/colors';

interface MapScreenProps {
  onBenchPress?: (bench: ExtendedBench) => void;
}

export interface MapScreenRef {
  focusOnBench: (bench: ExtendedBench) => void;
}

const MapScreen = forwardRef<MapScreenRef, MapScreenProps>(({ onBenchPress }, ref) => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [benches, setBenches] = useState<ExtendedBench[]>([]);
  const [nearbyBenches, setNearbyBenches] = useState<ExtendedBench[]>([]);
  const [activeBenchTab, setActiveBenchTab] = useState<'myBenches' | 'favorites' | 'addBench'>('myBenches');
  const mapRef = useRef<MapView>(null);
  const { t } = useTranslation();

  useFocusEffect(
    React.useCallback(() => {
      loadBenches();
    }, [])
  );

  React.useEffect(() => {
    const focusBench = route.params?.focusBench;
    if (focusBench && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: focusBench.latitude,
          longitude: focusBench.longitude,
        },
        pitch: 45,
        heading: 0,
        altitude: 1000,
        zoom: 16,
      }, { duration: 1500 });
    }
  }, [route.params?.focusBench]);

  const focusOnBench = (bench: ExtendedBench) => {
    if (mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: bench.latitude,
          longitude: bench.longitude,
        },
        pitch: 45,
        heading: 0,
        altitude: 1000,
        zoom: 16,
      }, { duration: 1500 });
    }
  };

  useImperativeHandle(ref, () => ({
    focusOnBench,
  }));

  const loadBenches = async () => {
    try {
      const { data, error } = await supabase
        .from('benches')
        .select(`
          *,
          rarity:rarity_id(id, name, level, color, description, created_at),
          bench_type:bench_type_id(id, name, icon, created_at),
          location:location_id(id, name, icon, created_at)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading benches:', error);
        return;
      }

      const convertedBenches = (data || []).map((bench: any) => ({
        ...bench,
        description: bench.description || undefined,
        average_rating: bench.average_rating || undefined,
        rarity: bench.rarity,
        bench_type: bench.bench_type,
        location: bench.location,
        tags: bench.tags || [],
        is_favorite: bench.is_favorite || false,
      }));
      setBenches(convertedBenches);
      setNearbyBenches(convertedBenches.slice(0, 10));
    } catch (error) {
      console.error('Error loading benches:', error);
    }
  };

  const handleMarkerPress = (bench: ExtendedBench) => {
    navigation.navigate('BenchDetails', { benchId: bench.id });
  };



  const handleLocationButtonClick = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('common.error'), t('errors.locationPermissionDenied'));
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      if (mapRef.current) {
        mapRef.current.animateCamera({
          center: {
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
          },
          pitch: 45,
          heading: 0,
          altitude: 1000,
          zoom: 16,
        }, { duration: 1000 });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(t('common.error'), t('errors.locationFailed'));
    }
  };

  return (
      <View style={screenStyles.mapScreenContainer}>
        <ExpoMap 
          benches={benches} 
          onMarkerPress={handleMarkerPress}
          mapRef={mapRef}
        />

        <View style={screenStyles.mapScreenControlButtonsContainer}>
          <TouchableOpacity
            onPress={handleLocationButtonClick}
            style={screenStyles.mapScreenControlButton}
          >
            <Ionicons name="locate" size={24} color={colors.text.white} />
          </TouchableOpacity>
        </View>
      </View>
  );
});

MapScreen.displayName = 'MapScreen';

export default MapScreen;