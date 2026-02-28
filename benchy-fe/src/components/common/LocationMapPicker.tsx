import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { componentStyles } from '../../styles/components';
import { colors } from '../../styles/colors';

// Pomnik Hachikō, Shibuya, Tokyo
const DEFAULT_REGION = {
  latitude: 35.6595,
  longitude: 139.7004,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

interface LocationMapPickerProps {
  visible: boolean;
  initialLat?: number;
  initialLon?: number;
  onConfirm: (latitude: number, longitude: number) => void;
  onClose: () => void;
}

export const LocationMapPicker: React.FC<LocationMapPickerProps> = ({
  visible,
  initialLat,
  initialLon,
  onConfirm,
  onClose,
}) => {
  const { t } = useTranslation();
  const mapRef = useRef<MapView>(null);
  const [selected, setSelected] = useState<{ latitude: number; longitude: number } | null>(
    initialLat != null && initialLon != null ? { latitude: initialLat, longitude: initialLon } : null
  );
  const [userRegion, setUserRegion] = useState<typeof DEFAULT_REGION | null>(null);

  useEffect(() => {
    if (visible && initialLat != null && initialLon != null) {
      setSelected({ latitude: initialLat, longitude: initialLon });
    } else if (visible && (initialLat == null || initialLon == null)) {
      setSelected(null);
    }
  }, [visible, initialLat, initialLon]);

  useEffect(() => {
    if (!visible) return;
    if (initialLat != null && initialLon != null) return;

    let cancelled = false;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted' || cancelled) return;
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (cancelled) return;
        const region = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        setUserRegion(region);
        mapRef.current?.animateCamera?.(
          { center: { latitude: region.latitude, longitude: region.longitude }, zoom: 16 },
          { duration: 500 }
        );
      } catch {
        if (!cancelled) setUserRegion(DEFAULT_REGION);
      }
    })();
    return () => { cancelled = true; };
  }, [visible, initialLat, initialLon]);

  const initialRegion =
    initialLat != null && initialLon != null
      ? { latitude: initialLat, longitude: initialLon, latitudeDelta: 0.005, longitudeDelta: 0.005 }
      : userRegion ?? DEFAULT_REGION;

  const handleMapPress = (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    setSelected(e.nativeEvent.coordinate);
  };

  const handleConfirm = () => {
    if (selected) {
      onConfirm(selected.latitude, selected.longitude);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('addBench.tapMapToSet')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.mapWrapper}>
            <MapView
              ref={mapRef}
              style={componentStyles.map}
              initialRegion={initialRegion}
              onPress={handleMapPress}
            >
              {selected && (
                <Marker
                  coordinate={selected}
                  draggable
                  onDragEnd={(e) => setSelected(e.nativeEvent.coordinate)}
                />
              )}
            </MapView>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.confirmButton, !selected && styles.confirmButtonDisabled]}
              onPress={handleConfirm}
              disabled={!selected}
            >
              <Text style={styles.confirmButtonText}>{t('addBench.confirmLocation')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: 400,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  mapWrapper: {
    height: 320,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  footer: {
    padding: 20,
    paddingTop: 16,
  },
  confirmButton: {
    backgroundColor: colors.primary[600],
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: colors.gray[400],
  },
  confirmButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
