import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { screenStyles } from '../styles/screens';
import { commonStyles } from '../styles/common';

const AddBenchScreen = ({ navigation }: any) => {
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const { t } = useTranslation();
  const { user } = useAuth();

  const benchImages = [
    { id: 'wooden_classic', name: 'Classic Wooden', icon: '🪑' },
    { id: 'metal_modern', name: 'Modern Metal', icon: '🛋️' },
    { id: 'stone_bench', name: 'Stone Bench', icon: '🗿' },
    { id: 'park_bench', name: 'Park Bench', icon: '🌳' },
    { id: 'concrete_bench', name: 'Concrete Bench', icon: '⬜' },
    { id: 'picnic_table', name: 'Picnic Table', icon: '🏕️' },
  ];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(t('common.error'), t('location.permissionDenied'));
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(t('common.error'), t('location.locationError'));
    }
  };

  const handleSave = async () => {
    if (!description.trim()) {
      Alert.alert(t('common.error'), t('addBench.addDescription'));
      return;
    }

    if (!selectedImage) {
      Alert.alert(t('common.error'), t('addBench.selectType'));
      return;
    }

    if (!user) {
      Alert.alert(t('common.error'), t('errors.mustBeLoggedIn'));
      return;
    }

    setLoading(true);
    try {
      if (!userLocation) {
        Alert.alert(t('common.error'), t('errors.locationFailed'));
        return;
      }

      const { data, error } = await supabase
        .from('benches')
        .insert([
          {
            description: description.trim(),
            image_type: selectedImage,
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            user_id: user.id,
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        Alert.alert(t('common.error'), t('errors.failedToAddBench') + ': ' + error.message);
        return;
      }

      Alert.alert(
        t('common.success'),
        t('addBench.benchAdded'),
        [{ text: t('common.ok'), onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error saving bench:', error);
      Alert.alert(t('common.error'), t('errors.failedToAddBench'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2e7d32" />
      <LinearGradient
        colors={['#e8f5e8', '#f1f8e9']}
        style={commonStyles.container}
      >
        <ScrollView style={commonStyles.scrollView}>
          <View style={commonStyles.content}>
            {/* Header */}
            <View style={screenStyles.addBenchHeaderCard}>
              <Text style={screenStyles.addBenchSectionTitle}>{t('addBench.description')}</Text>
              <Input
                placeholder={t('addBench.descriptionPlaceholder')}
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={4}
                containerStyle={screenStyles.addBenchInputContainer}
              />
            </View>

            {/* Location Info */}
            <View style={screenStyles.addBenchSectionCard}>
              <Text style={screenStyles.addBenchSectionTitle}>{t('addBench.locationInfo')}</Text>
              {userLocation ? (
                <Text style={screenStyles.addBenchInfoText}>
                  📍 {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
                </Text>
              ) : (
                <Text style={screenStyles.addBenchInfoText}>
                  {t('common.loading')}...
                </Text>
              )}
            </View>

            {/* Bench Type Selection */}
            <View style={screenStyles.addBenchSectionCard}>
              <Text style={screenStyles.addBenchSectionTitle}>{t('addBench.benchType')}</Text>
              <View style={screenStyles.addBenchGrid}>
                {benchImages.map((image) => (
                  <TouchableOpacity
                    key={image.id}
                    style={[
                      screenStyles.addBenchOption,
                      selectedImage === image.id && screenStyles.addBenchOptionSelected
                    ]}
                    onPress={() => setSelectedImage(image.id)}
                  >
                    <Text style={screenStyles.addBenchIcon}>{image.icon}</Text>
                    <Text style={screenStyles.addBenchName}>{image.name}</Text>
                    {selectedImage === image.id && (
                      <View style={screenStyles.addBenchCheckmark}>
                        <Ionicons 
                          name="checkmark-circle" 
                          size={24} 
                          color="#2e7d32" 
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Location Info */}
            <View style={screenStyles.addBenchInfoCard}>
              <View style={screenStyles.addBenchInfoIconContainer}>
                <Ionicons name="location" size={20} color="#2e7d32" />
              </View>
              <View style={screenStyles.addBenchLocationInfo}>
                <Text style={screenStyles.addBenchInfoText}>
                  {userLocation 
                    ? `📍 ${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`
                    : 'Pobieranie lokalizacji...'
                  }
                </Text>
                <Text style={screenStyles.addBenchInfoSubtext}>
                  {userLocation ? 'Aktualna lokalizacja' : 'Czekaj...'}
                </Text>
              </View>
            </View>

            {/* Save Button */}
            <Button
              title={loading ? t('addBench.saving') : t('navigation.addBench')}
              onPress={handleSave}
              loading={loading}
              disabled={loading}
              icon="add-circle"
              style={screenStyles.addBenchSaveButton}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};


export default AddBenchScreen;