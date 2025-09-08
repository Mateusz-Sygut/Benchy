import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Button } from '../components/common/Button';
import supabase from '../lib/supabase';
import { Bench } from '../types/database';
import { screenStyles } from '../styles/screens';
import { commonStyles } from '../styles/common';

const BenchListScreen = () => {
  const navigation = useNavigation<any>();
  const [benches, setBenches] = useState<Bench[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useFocusEffect(
    React.useCallback(() => {
      loadBenches();
    }, [])
  );

  const loadBenches = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('benches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading benches:', error);
        setBenches([]);
        return;
      }

      setBenches(data || []);
    } catch (error) {
      console.error('Error loading benches:', error);
      setBenches([]);
    } finally {
      setLoading(false);
    }
  };

  const getBenchIcon = (imageType: string) => {
    switch (imageType) {
      case 'wooden_classic': return '🪑';
      case 'metal_modern': return '🛋️';
      case 'stone_bench': return '🗿';
      case 'park_bench': return '🌳';
      case 'concrete_bench': return '⬜';
      case 'picnic_table': return '🏕️';
      default: return '🪑';
    }
  };

  const renderBenchItem = ({ item }: { item: Bench }) => (
    <TouchableOpacity
      style={screenStyles.benchListBenchCard}
      onPress={() => navigation.navigate('BenchDetails', { benchId: item.id })}
    >
      <View style={screenStyles.benchListBenchIconContainer}>
        <Text style={screenStyles.benchListBenchIcon}>{getBenchIcon(item.image_type)}</Text>
      </View>
      
      <View style={screenStyles.benchListBenchContent}>
        <Text style={screenStyles.benchListBenchDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={screenStyles.benchListBenchMeta}>
          <View style={screenStyles.benchListRatingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={screenStyles.benchListRatingText}>
              {item.average_rating && item.average_rating > 0 ? item.average_rating.toFixed(1) : t('benchList.noRating')}
            </Text>
          </View>
          
          <Text style={screenStyles.benchListUsernameText}>
            {t('bench.addedBy')}
          </Text>
        </View>
        
        <Text style={screenStyles.benchListLocationText}>
          📍 {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
        </Text>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={screenStyles.benchListEmptyContainer}>
      <LinearGradient
        colors={['#e8f5e8', '#f1f8e9']}
        style={screenStyles.benchListEmptyGradient}
      >
        <View style={screenStyles.benchListEmptyIconContainer}>
          <Ionicons name="map-outline" size={64} color="#2e7d32" />
        </View>
        <Text style={screenStyles.benchListEmptyTitle}>
          {t('benchList.noBenchesTitle')}
        </Text>
        <Text style={screenStyles.benchListEmptyText}>
          {t('benchList.noBenchesText')}
        </Text>
        <Button
          title={t('benchList.addFirstBench')}
          onPress={() => navigation.navigate('AddBench')}
          icon="add"
          style={screenStyles.benchListEmptyButton}
        />
      </LinearGradient>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2e7d32" />
      <View style={screenStyles.benchListContainer}>
        <FlatList
          data={benches}
          renderItem={renderBenchItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadBenches}
              colors={['#2e7d32']}
              tintColor="#2e7d32"
            />
          }
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={benches.length === 0 ? screenStyles.benchListEmptyContentContainer : screenStyles.benchListListContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
};


export default BenchListScreen;