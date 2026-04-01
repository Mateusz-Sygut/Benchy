import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { StarRating } from '../components/common/StarRating';

interface RatingWithBench {
  id: string;
  bench_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  bench?: {
    id: string;
    name: string;
    description: string | null;
    latitude: number;
    longitude: number;
    image_type: string;
    average_rating: number | null;
  } | null;
}

const MyRatingsScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { screen: screenStyles, theme } = useThemedStyles();
  const [ratings, setRatings] = useState<RatingWithBench[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadRatings();
    }, [user?.id])
  );

  const loadRatings = async () => {
    if (!user) {
      setRatings([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select(
          `
          *,
          bench:bench_id (
            id,
            name,
            description,
            latitude,
            longitude,
            image_type,
            average_rating
          )
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading my ratings:', error);
        setRatings([]);
        return;
      }

      setRatings((data as RatingWithBench[]) || []);
    } catch (error) {
      console.error('Error loading my ratings:', error);
      setRatings([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL');
  };

  const handleOpenBench = (rating: RatingWithBench) => {
    if (rating.bench) {
      navigation.navigate('BenchDetails', { benchId: rating.bench.id });
    } else {
      navigation.navigate('BenchDetails', { benchId: rating.bench_id });
    }
  };

  const renderRatingItem = ({ item }: { item: RatingWithBench }) => (
    <TouchableOpacity
      style={screenStyles.benchDetailsRatingItem}
      onPress={() => handleOpenBench(item)}
    >
      <View style={screenStyles.benchDetailsRatingHeader}>
        <View>
          <Text style={screenStyles.benchDetailsBenchName} numberOfLines={1}>
            {item.bench?.name || t('bench.unnamedBench')}
          </Text>
          <Text style={screenStyles.benchDetailsLocation}>
            📍
            {item.bench
              ? ` ${item.bench.latitude.toFixed(4)}, ${item.bench.longitude.toFixed(4)}`
              : ''}
          </Text>
        </View>
        <View style={screenStyles.benchDetailsRatingInfo}>
          <StarRating rating={item.rating} readonly size={16} />
          <Text style={screenStyles.benchDetailsRatingDate}>
            {formatDate(item.created_at)}
          </Text>
        </View>
      </View>
      {item.comment && (
        <Text style={screenStyles.benchDetailsRatingComment}>{item.comment}</Text>
      )}
      <View style={{ position: 'absolute', right: 0, top: 0 }}>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={screenStyles.benchDetailsSection}>
      <Text style={screenStyles.benchDetailsNoRatings}>
        {t('benchList.noRating')}. {t('benchDetails.beFirst')}
      </Text>
    </View>
  );

  return (
    <>
      <StatusBar
        barStyle={theme.statusBarStyle === 'light' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.primary[900]}
      />
      <View style={screenStyles.benchDetailsContainer}>
        <FlatList
          data={ratings}
          renderItem={renderRatingItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadRatings}
              colors={[theme.primary[900]]}
              tintColor={theme.primary[900]}
            />
          }
          ListEmptyComponent={ratings.length === 0 ? renderEmptyState : null}
          contentContainerStyle={
            ratings.length === 0
              ? screenStyles.benchListEmptyContentContainer
              : screenStyles.benchDetailsScrollContent
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
};

export default MyRatingsScreen;

