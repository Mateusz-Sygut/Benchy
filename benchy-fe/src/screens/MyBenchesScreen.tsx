import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import supabase from '../lib/supabase';
import { Bench } from '../types/database';
import { screenStyles } from '../styles/screens';
import { colors } from '../styles/colors';

const MyBenchesScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [benches, setBenches] = useState<Bench[]>([]);
  const [filteredBenches, setFilteredBenches] = useState<Bench[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();

  useFocusEffect(
    React.useCallback(() => {
      loadBenches();
    }, [user?.id])
  );

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBenches(benches);
      return;
    }

    const filtered = benches.filter((bench) => {
      const query = searchQuery.toLowerCase();
      return (
        (bench.name && bench.name.toLowerCase().includes(query)) ||
        (bench.description && bench.description.toLowerCase().includes(query)) ||
        bench.latitude.toString().includes(query) ||
        bench.longitude.toString().includes(query)
      );
    });
    setFilteredBenches(filtered);
  }, [benches, searchQuery]);

  const loadBenches = async () => {
    if (!user) {
      setBenches([]);
      setFilteredBenches([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('benches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading my benches:', error);
        setBenches([]);
        setFilteredBenches([]);
        return;
      }

      setBenches(data || []);
      setFilteredBenches(data || []);
    } catch (error) {
      console.error('Error loading my benches:', error);
      setBenches([]);
      setFilteredBenches([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const navigateToMapWithBench = (bench: Bench) => {
    navigation.navigate('Map', {
      focusBench: {
        latitude: bench.latitude,
        longitude: bench.longitude,
        name: bench.name,
      },
    });
  };

  const getBenchIcon = (imageType: string) => {
    switch (imageType) {
      case 'wooden_classic':
        return '🪑';
      case 'metal_modern':
        return '🛋️';
      case 'stone_bench':
        return '🗿';
      case 'park_bench':
        return '🌳';
      case 'concrete_bench':
        return '⬜';
      case 'picnic_table':
        return '🏕️';
      default:
        return '🪑';
    }
  };

  const renderBenchItem = ({ item }: { item: Bench }) => (
    <TouchableOpacity
      style={screenStyles.benchListBenchCard}
      onPress={() => navigation.navigate('BenchDetails', { benchId: item.id })}
    >
      <TouchableOpacity
        style={screenStyles.benchListBenchIconContainer}
        onPress={() => navigateToMapWithBench(item)}
      >
        <Text style={screenStyles.benchListBenchIcon}>
          {getBenchIcon(item.image_type || 'wooden_classic')}
        </Text>
      </TouchableOpacity>

      <View style={screenStyles.benchListBenchContent}>
        <Text style={screenStyles.benchListBenchDescription} numberOfLines={2}>
          {item.description || t('bench.noDescription')}
        </Text>

        <View style={screenStyles.benchListBenchMeta}>
          <View style={screenStyles.benchListRatingContainer}>
            <Ionicons name="star" size={16} color={colors.star} />
            <Text style={screenStyles.benchListRatingText}>
              {item.average_rating && item.average_rating > 0
                ? item.average_rating.toFixed(1)
                : t('benchList.noRating')}
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

  const renderSearchBar = () => (
    <View style={screenStyles.benchListSearchContainer}>
      <View style={screenStyles.benchListSearchInputContainer}>
        <Ionicons
          name="search"
          size={20}
          color={colors.text.secondary}
          style={screenStyles.benchListSearchIcon}
        />
        <TextInput
          style={screenStyles.benchListSearchInput}
          placeholder={t('benchList.searchPlaceholder')}
          placeholderTextColor={colors.text.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={clearSearch}
            style={screenStyles.benchListSearchClearButton}
          >
            <Ionicons name="close" size={16} color={colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={screenStyles.benchListEmptyContainer}>
      <LinearGradient
        colors={[colors.gradient.light, colors.gradient.lighter]}
        style={screenStyles.benchListEmptyGradient}
      >
        <View style={screenStyles.benchListEmptyIconContainer}>
          <Ionicons name="map-outline" size={64} color={colors.primary[900]} />
        </View>
        <Text style={screenStyles.benchListEmptyTitle}>
          {t('benchList.noBenchesTitle')}
        </Text>
        <Text style={screenStyles.benchListEmptyText}>
          {t('benchList.noBenchesText')}
        </Text>
        {!loading && (
          <Button
            title={t('benchList.addFirstBench')}
            onPress={() => navigation.navigate('AddBench')}
            icon="add"
            style={screenStyles.benchListEmptyButton}
          />
        )}
      </LinearGradient>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary[900]} />
      <View style={screenStyles.benchListContainer}>
        {renderSearchBar()}
        <FlatList
          data={filteredBenches}
          renderItem={renderBenchItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadBenches}
              colors={[colors.primary[900]]}
              tintColor={colors.primary[900]}
            />
          }
          ListEmptyComponent={
            filteredBenches.length === 0 ? () => renderEmptyState() : null
          }
          contentContainerStyle={
            filteredBenches.length === 0
              ? screenStyles.benchListEmptyContentContainer
              : screenStyles.benchListListContent
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
};

export default MyBenchesScreen;

