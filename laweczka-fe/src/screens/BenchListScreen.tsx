import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Button } from '../components/common/Button';
import supabase from '../lib/supabase';
import { Bench } from '../types/database';

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
      style={styles.benchCard}
      onPress={() => navigation.navigate('BenchDetails', { benchId: item.id })}
    >
      <View style={styles.benchIconContainer}>
        <Text style={styles.benchIcon}>{getBenchIcon(item.image_type)}</Text>
      </View>
      
      <View style={styles.benchContent}>
        <Text style={styles.benchDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.benchMeta}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>
              {item.average_rating && item.average_rating > 0 ? item.average_rating.toFixed(1) : t('benchList.noRating')}
            </Text>
          </View>
          
          <Text style={styles.usernameText}>
            {t('bench.addedBy')}
          </Text>
        </View>
        
        <Text style={styles.locationText}>
          📍 {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
        </Text>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <LinearGradient
        colors={['#e8f5e8', '#f1f8e9']}
        style={styles.emptyGradient}
      >
        <View style={styles.emptyIconContainer}>
          <Ionicons name="map-outline" size={64} color="#2e7d32" />
        </View>
        <Text style={styles.emptyTitle}>
          {t('benchList.noBenchesTitle')}
        </Text>
        <Text style={styles.emptyText}>
          {t('benchList.noBenchesText')}
        </Text>
        <Button
          title={t('benchList.addFirstBench')}
          onPress={() => navigation.navigate('AddBench')}
          icon="add"
          style={styles.emptyButton}
        />
      </LinearGradient>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2e7d32" />
      <View style={styles.container}>
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
          contentContainerStyle={benches.length === 0 ? styles.emptyContentContainer : styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  benchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  benchIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#e8f5e8',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  benchIcon: {
    fontSize: 24,
  },
  benchContent: {
    flex: 1,
  },
  benchDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  benchMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  usernameText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  locationText: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
  },
  emptyContentContainer: {
    flex: 1,
  },
  emptyGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
});

export default BenchListScreen;