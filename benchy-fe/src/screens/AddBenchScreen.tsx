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
import { useAchievements } from '../hooks/useAchievements';
import supabase from '../lib/supabase';
import { BenchInsert, BenchType, Location as LocationType, Tag } from '../types/database';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { LocationMapPicker } from '../components/common/LocationMapPicker';
import { screenStyles } from '../styles/screens';
import { commonStyles } from '../styles/common';
import { colors } from '../styles/colors';
import { glassmorphismStyles } from '../styles/glassmorphism';

const AddBenchScreen = ({ navigation }: any) => {
  const [description, setDescription] = useState('');
  const [selectedBenchType, setSelectedBenchType] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [locationSource, setLocationSource] = useState<'gps' | 'map' | null>(null);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [benchTypes, setBenchTypes] = useState<BenchType[]>([]);
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const { t } = useTranslation();
  const { user } = useAuth();
  const { updateUserStats } = useAchievements();

  const benchImages = [
    { id: 'wooden_classic', name: t('benchTypes.wooden_classic'), icon: '🪑' },
    { id: 'metal_modern', name: t('benchTypes.metal_modern'), icon: '🛋️' },
    { id: 'stone_bench', name: t('benchTypes.stone_bench'), icon: '🗿' },
    { id: 'park_bench', name: t('benchTypes.park_bench'), icon: '🌳' },
    { id: 'concrete_bench', name: t('benchTypes.concrete_bench'), icon: '⬜' },
    { id: 'picnic_table', name: t('benchTypes.picnic_table'), icon: '🏕️' },
  ];

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      const { data: benchTypesData } = await supabase
        .from('bench_types')
        .select('*')
        .order('name');

      const { data: locationsData } = await supabase
        .from('locations')
        .select('*')
        .order('name');

      const { data: tagsData } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (benchTypesData) setBenchTypes(benchTypesData);
      if (locationsData) setLocations(locationsData);
      if (tagsData) setTags(tagsData);
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

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
      setLocationSource('gps');
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

    if (!selectedBenchType) {
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
        Alert.alert(t('common.error'), t('addBench.selectLocation'));
        return;
      }

      const benchData: BenchInsert = {
        name: description.trim(),
        description: description.trim(),
        image_type: selectedBenchType,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        user_id: user.id,
        bench_type_id: selectedBenchType,
        location_id: selectedLocation,
        tags: selectedTags.length > 0 ? selectedTags : null,
      };

      const { data, error } = await supabase
        .from('benches')
        .insert([benchData] as any)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        Alert.alert(t('common.error'), t('errors.failedToAddBench') + ': ' + error.message);
        return;
      }

      await updateUserStats('bench_created');

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

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(tag => tag !== tagName));
    } else if (selectedTags.length < 4) {
      setSelectedTags([...selectedTags, tagName]);
    } else {
      Alert.alert(t('common.error'), t('addBench.maxTags'));
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary[900]} />
      <LinearGradient
        colors={[colors.gradient.light, colors.gradient.lighter]}
        style={commonStyles.container}
      >
        <ScrollView style={commonStyles.scrollView}>
          <View style={commonStyles.content}>
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

            <View style={screenStyles.addBenchSectionCard}>
              <Text style={screenStyles.addBenchSectionTitle}>{t('addBench.locationMethod')}</Text>
              <Text style={screenStyles.addBenchInfoSubtext}>{t('addBench.locationInfo')}</Text>
              <View style={screenStyles.addBenchLocationOptions}>
                <TouchableOpacity
                  style={[screenStyles.addBenchLocationOption, glassmorphismStyles.glassContainer]}
                  onPress={async () => {
                    await getCurrentLocation();
                  }}
                >
                  <View style={screenStyles.addBenchLocationOptionIcon}>
                    <Ionicons name="locate" size={28} color={colors.primary[600]} />
                  </View>
                  <Text style={screenStyles.addBenchLocationOptionTitle}>{t('addBench.yourLocation')}</Text>
                  <Text style={screenStyles.addBenchInfoSubtext}>{t('addBench.yourLocationDesc')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[screenStyles.addBenchLocationOption, glassmorphismStyles.glassContainer]}
                  onPress={() => setShowMapPicker(true)}
                >
                  <View style={screenStyles.addBenchLocationOptionIcon}>
                    <Ionicons name="map" size={28} color={colors.primary[600]} />
                  </View>
                  <Text style={screenStyles.addBenchLocationOptionTitle}>{t('addBench.pickOnMap')}</Text>
                  <Text style={screenStyles.addBenchInfoSubtext}>{t('addBench.pickOnMapDesc')}</Text>
                </TouchableOpacity>
              </View>
              {userLocation && (
                <Text style={[screenStyles.addBenchInfoText, { marginTop: 12 }]}>
                  ✓ {locationSource === 'gps' ? t('addBench.locationSetGps') : t('addBench.locationSetMap')}
                </Text>
              )}
            </View>

            <LocationMapPicker
              visible={showMapPicker}
              initialLat={userLocation?.latitude}
              initialLon={userLocation?.longitude}
              onConfirm={(lat, lon) => {
                setUserLocation({ latitude: lat, longitude: lon });
                setLocationSource('map');
              }}
              onClose={() => setShowMapPicker(false)}
            />

            <View style={screenStyles.addBenchSectionCard}>
              <Text style={screenStyles.addBenchSectionTitle}>{t('addBench.benchType')}</Text>
              <View style={screenStyles.addBenchGrid}>
                {benchTypes.map((benchType) => (
                  <TouchableOpacity
                    key={benchType.id}
                    style={[
                      screenStyles.addBenchOption,
                      glassmorphismStyles.glassContainer,
                      selectedBenchType === benchType.id && { borderColor: colors.primary[400] }
                    ]}
                    onPress={() => setSelectedBenchType(benchType.id)}
                  >
                    <Text style={screenStyles.addBenchIcon}>{benchType.icon}</Text>
                    <Text style={screenStyles.addBenchName}>{benchType.name}</Text>
                    {selectedBenchType === benchType.id && (
                      <View style={screenStyles.addBenchCheckmark}>
                        <Ionicons 
                          name="checkmark-circle" 
                          size={24} 
                          color={colors.primary[400]} 
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={[screenStyles.addBenchSectionCard, glassmorphismStyles.glassCard]}>
              <Text style={screenStyles.addBenchSectionTitle}>{t('addBench.surroundings')}</Text>
              <View style={screenStyles.addBenchGrid}>
                {locations.map((location) => (
                  <TouchableOpacity
                    key={location.id}
                    style={[
                      screenStyles.addBenchOption,
                      glassmorphismStyles.glassContainer,
                      selectedLocation === location.id && { borderColor: colors.primary[400] }
                    ]}
                    onPress={() => setSelectedLocation(location.id)}
                  >
                    <Text style={screenStyles.addBenchIcon}>{location.icon}</Text>
                    <Text style={screenStyles.addBenchName}>{location.name}</Text>
                    {selectedLocation === location.id && (
                      <View style={screenStyles.addBenchCheckmark}>
                        <Ionicons 
                          name="checkmark-circle" 
                          size={24} 
                          color={colors.primary[400]} 
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={[screenStyles.addBenchSectionCard, glassmorphismStyles.glassCard]}>
              <Text style={screenStyles.addBenchSectionTitle}>
                {t('addBench.tagsCount', { count: selectedTags.length })}
              </Text>
              <View style={screenStyles.addBenchGrid}>
                {tags.map((tag) => (
                  <TouchableOpacity
                    key={tag.id}
                    style={[
                      screenStyles.addBenchOption,
                      glassmorphismStyles.glassContainer,
                      selectedTags.includes(tag.name) && { borderColor: colors.primary[400] }
                    ]}
                    onPress={() => toggleTag(tag.name)}
                  >
                    <Text style={screenStyles.addBenchName}>{tag.name}</Text>
                    {selectedTags.includes(tag.name) && (
                      <View style={screenStyles.addBenchCheckmark}>
                        <Ionicons 
                          name="checkmark-circle" 
                          size={24} 
                          color={colors.primary[400]} 
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

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