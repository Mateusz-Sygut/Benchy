import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import { Bench } from '../../types/database';

interface ExpoMapProps {
  benches: Bench[];
  onMarkerPress?: (bench: Bench) => void;
  mapRef?: React.RefObject<MapView | null>;
}

export const ExpoMap: React.FC<ExpoMapProps> = ({ benches, onMarkerPress, mapRef: externalMapRef }) => {
  const { t } = useTranslation();
  const internalMapRef = useRef<MapView>(null);
  const mapRef = externalMapRef || internalMapRef;
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('common.error'),
          'Permission to access location was denied'
        );
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(t('common.error'), t('location.locationError'));
    }
  };

  const centerOnUserLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(newLocation);
      
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          ...newLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(t('common.error'), 'Nie udało się pobrać lokalizacji');
    }
  };

  // Don't render map until we have user location
  if (!userLocation) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
      >
        {/* Bench markers */}
        {benches.map((bench) => (
          <Marker
            key={bench.id}
            coordinate={{
              latitude: bench.latitude,
              longitude: bench.longitude,
            }}
            title={bench.name}
            description={bench.description || t('bench.noDescription')}
            pinColor="#22c55e" // Green color for benches
            onPress={() => onMarkerPress?.(bench)}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});


