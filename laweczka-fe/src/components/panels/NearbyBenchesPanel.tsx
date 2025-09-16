import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { glassmorphismStyles, panelStyles } from '../../styles/glassmorphism';
import { colors } from '../../styles/colors';
import { Bench } from '../../types/database';
import supabase from '../../lib/supabase';

export const NearbyBenchesPanel: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [nearbyBenches, setNearbyBenches] = useState<Bench[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNearbyBenches();
  }, []);

  const loadNearbyBenches = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('benches')
        .select('*')
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

  const handleBenchPress = (bench: Bench) => {
    navigation.navigate('BenchDetails', { benchId: bench.id });
  };

  const renderBenchItem = ({ item: bench }: { item: Bench }) => (
    <TouchableOpacity 
      style={panelStyles.benchCard}
      onPress={() => handleBenchPress(bench)}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={panelStyles.benchIconContainer}>
          <Ionicons name="location" size={20} color={colors.primary[400]} />
        </View>
        <View style={{ marginLeft: 15, flex: 1 }}>
          <Text style={panelStyles.benchName} numberOfLines={1}>
            {bench.name}
          </Text>
          <Text style={panelStyles.benchDescription} numberOfLines={2}>
            {bench.description || t('bench.noDescription')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Ionicons name="star" size={14} color={colors.warning[500]} />
            <Text style={panelStyles.benchRating}>
              {bench.average_rating ? bench.average_rating.toFixed(1) : '0.0'}
            </Text>
            <Text style={panelStyles.benchDistance}>• 0.5 km</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 20, paddingBottom: 10 }}>
        <Text style={glassmorphismStyles.cardTitle}>{t('nearby.title')}</Text>
        <Text style={glassmorphismStyles.cardSubtitle}>{t('nearby.subtitle')}</Text>
      </View>
      
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadNearbyBenches}
            tintColor={colors.text.white}
          />
        }
      >
        {nearbyBenches.length === 0 ? (
          <View style={panelStyles.emptyState}>
            <Ionicons name="location-outline" size={48} color={colors.text.secondary} />
            <Text style={panelStyles.emptyStateTitle}>{t('nearby.noBenches')}</Text>
            <Text style={panelStyles.emptyStateText}>{t('nearby.noBenchesText')}</Text>
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
