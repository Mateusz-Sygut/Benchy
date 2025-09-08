import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import { Bench } from '../../types/database';
import { componentStyles } from '../../styles/components';

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

  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
        pitch: 45,
        heading: 0,
        altitude: 1000,
        zoom: 16,
      }, { duration: 2000 });
    }
  }, [userLocation]);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('common.error'),
          t('errors.locationPermissionDenied')
        );
        return;
      }

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

  if (!userLocation) {
    return (
      <View style={componentStyles.mapContainer}>
        <View style={componentStyles.loadingContainer}>
          <Text style={componentStyles.loadingText}>{t('common.loading')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={componentStyles.mapContainer}>
      <MapView
        ref={mapRef}
        style={componentStyles.map}
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
        pitchEnabled={true}
        rotateEnabled={true}
        mapType="standard"
      >
        {benches.map((bench) => (
          <Marker
            key={bench.id}
            coordinate={{
              latitude: bench.latitude,
              longitude: bench.longitude,
            }}
            title={bench.name}
            description={bench.description || t('bench.noDescription')}
            pinColor="#22c55e"
            onPress={() => onMarkerPress?.(bench)}
          />
        ))}
      </MapView>
    </View>
  );
};



