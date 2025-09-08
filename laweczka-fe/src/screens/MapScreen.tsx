import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Button } from '../components/common/Button';
import { ExpoMap } from '../components/common/ExpoMap';
import SearchModal from '../components/common/SearchModal';
import supabase from '../lib/supabase';
import { Bench } from '../types/database';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { screenStyles } from '../styles/screens';
import { commonStyles } from '../styles/common';
import { colors } from '../styles/colors';

const MapScreen = () => {
  const navigation = useNavigation<any>();
  const [benches, setBenches] = useState<Bench[]>([]);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const mapRef = useRef<MapView>(null);
  const { t } = useTranslation();

  useFocusEffect(
    React.useCallback(() => {
      loadBenches();
    }, [])
  );

  const loadBenches = async () => {
    try {
      const { data, error } = await supabase
        .from('benches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading benches:', error);
        return;
      }

      const convertedBenches = (data || []).map(bench => ({
        ...bench,
        description: bench.description || undefined,
        average_rating: bench.average_rating || undefined
      }));
      setBenches(convertedBenches);
    } catch (error) {
      console.error('Error loading benches:', error);
    }
  };

  const handleMarkerPress = (bench: Bench) => {
    navigation.navigate('BenchDetails', { benchId: bench.id });
  };

  const handleAddBench = () => {
    navigation.navigate('AddBench');
  };

  const handleSearch = () => {
    setSearchModalVisible(true);
  };

  const handleSearchResult = (query: string) => {
    Alert.alert(t('search.result'), `${t('search.searchingFor')} ${query}`);
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
        mapRef.current.animateToRegion({
          ...newLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
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
          onPress={handleSearch}
          style={screenStyles.mapScreenControlButton}
        >
          <Ionicons name="search" size={24} color={colors.text.white} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLocationButtonClick}
          style={screenStyles.mapScreenControlButton}
        >
          <Ionicons name="locate" size={24} color={colors.text.white} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAddBench}
          style={screenStyles.mapScreenControlButton}
        >
          <Ionicons name="add-circle" size={24} color={colors.text.white} />
        </TouchableOpacity>
      </View>

      <SearchModal
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearchResult}
      />
    </View>
  );
};


export default MapScreen;