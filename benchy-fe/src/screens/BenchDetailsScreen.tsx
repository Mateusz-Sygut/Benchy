import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useAchievements } from '../hooks/useAchievements';
import { StarRating } from '../components/common/StarRating';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import supabase from '../lib/supabase';
import { Database, RatingInsert, BenchUpdate } from '../types/database';
import { screenStyles } from '../styles/screens';
import { commonStyles } from '../styles/common';

type Bench = Database['public']['Tables']['benches']['Row'];
type Rating = Database['public']['Tables']['ratings']['Row'];

const BenchDetailsScreen = ({ route }: any) => {
  const { benchId } = route.params;
  const { user } = useAuth();
  const { t } = useTranslation();
  const { updateUserStats } = useAchievements();
  const [bench, setBench] = useState<Bench | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [rarities, setRarities] = useState<any[]>([]);

  useEffect(() => {
    loadBenchDetails();
    loadRarities();
  }, [benchId]);

  const loadRarities = async () => {
    try {
      const { data, error } = await supabase
        .from('rarity')
        .select('*')
        .order('level', { ascending: true });

      if (error) {
        console.error('Error loading rarities:', error);
        return;
      }

      setRarities(data || []);
    } catch (error) {
      console.error('Error loading rarities:', error);
    }
  };

  const loadBenchDetails = async () => {
    try {
      const { data: benchData, error: benchError } = await supabase
        .from('benches')
        .select('*')
        .eq('id', benchId)
        .single();

      if (benchError) {
        console.error('Error loading bench:', benchError);
        Alert.alert(t('common.error'), t('errors.failedToLoadBench'));
        return;
      }

      setBench(benchData);

      const { data: ratingsData, error: ratingsError } = await supabase
        .from('ratings')
        .select('*')
        .eq('bench_id', benchId)
        .order('created_at', { ascending: false });

      if (ratingsError) {
        console.error('Error loading ratings:', ratingsError);
      } else {
        setRatings(ratingsData || []);
      }
    } catch (error) {
      console.error('Error loading bench details:', error);
      Alert.alert(t('common.error'), t('errors.failedToLoadData'));
    }
  };

  const submitRating = async () => {
    if (userRating === 0) {
      Alert.alert(t('common.error'), t('benchDetails.selectRating'));
      return;
    }

    if (!userComment.trim()) {
      Alert.alert(t('common.error'), t('benchDetails.addComment'));
      return;
    }

    if (!user) {
      Alert.alert(t('common.error'), t('errors.mustBeLoggedInToRate'));
      return;
    }

    setLoading(true);
    try {
      const ratingData: RatingInsert = {
        bench_id: benchId,
        user_id: user.id,
        rating: userRating,
        comment: userComment.trim(),
      };

      const { error } = await supabase
        .from('ratings')
        .upsert([ratingData] as any);

      if (error) {
        console.error('Error submitting rating:', error);
        Alert.alert(t('common.error'), t('errors.failedToAddRating'));
        return;
      }

      // Update user stats for achievements
      await updateUserStats('rating_given');

      Alert.alert(t('common.success'), t('benchDetails.ratingAdded'));
      setUserRating(0);
      setUserComment('');
      loadBenchDetails();
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert(t('common.error'), t('errors.failedToAddRating'));
    } finally {
      setLoading(false);
    }
  };

  const submitRarity = async () => {
    if (!selectedRarity || !bench) {
      Alert.alert(t('common.error'), t('benchDetails.selectRarity'));
      return;
    }

    setLoading(true);
    try {
      const { error } = await (supabase as any)
        .from('benches')
        .update({ rarity_id: selectedRarity })
        .eq('id', bench.id);

      if (error) {
        console.error('Error updating rarity:', error);
        Alert.alert(t('common.error'), t('errors.failedToUpdateRarity'));
        return;
      }

      Alert.alert(t('common.success'), t('benchDetails.rarityUpdated'));
      setSelectedRarity(null);
      loadBenchDetails();
    } catch (error) {
      console.error('Error updating rarity:', error);
      Alert.alert(t('common.error'), t('errors.failedToUpdateRarity'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL');
  };

  const getBenchIcon = (imageType: string) => {
    const icons: { [key: string]: string } = {
      wooden_classic: '🪑',
      metal_modern: '🛋️',
      stone_bench: '🗿',
      park_bench: '🌳',
      concrete_bench: '⬜',
      picnic_table: '🏕️',
    };
    return icons[imageType] || '🪑';
  };

  if (!bench) {
    return (
      <View style={screenStyles.benchDetailsContainer}>
        <Text style={screenStyles.benchDetailsLoading}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={screenStyles.benchDetailsContainer} contentContainerStyle={screenStyles.benchDetailsScrollContent}>
      <View style={screenStyles.benchDetailsBenchInfo}>
        <Text style={screenStyles.benchDetailsIcon}>{getBenchIcon(bench.image_type)}</Text>
        <View style={screenStyles.benchDetailsBenchDetails}>
          <Text style={screenStyles.benchDetailsBenchName}>
            {bench.name}
          </Text>
          {bench.description && (
            <Text style={screenStyles.benchDetailsDescription}>
              {bench.description}
            </Text>
          )}
          <View style={screenStyles.benchDetailsRatingRow}>
            <StarRating 
              rating={Math.round(bench.average_rating || 0)} 
              readonly={true}
              size={20}
            />
            <Text style={screenStyles.benchDetailsRatingText}>
              {(bench.average_rating || 0).toFixed(1)} ({ratings.length} {t('benchDetails.ratings')})
            </Text>
          </View>
          <Text style={screenStyles.benchDetailsLocation}>
            📍 {bench.latitude.toFixed(4)}, {bench.longitude.toFixed(4)}
          </Text>
          <Text style={screenStyles.benchDetailsAddedBy}>
            {t('benchDetails.addedOn')} {formatDate(bench.created_at)}
          </Text>
        </View>
      </View>

      <View style={screenStyles.benchDetailsSection}>
        <Text style={screenStyles.benchDetailsSectionTitle}>
          {t('benchDetails.addRating')}
        </Text>
        <View style={screenStyles.benchDetailsRatingForm}>
          <View style={screenStyles.benchDetailsStarContainer}>
            <StarRating 
              rating={userRating} 
              onRatingChange={setUserRating}
              readonly={false}
              size={32}
            />
          </View>
          <View style={screenStyles.benchDetailsCommentInput}>
            <Input
              placeholder={t('benchDetails.commentPlaceholder')}
              value={userComment}
              onChangeText={setUserComment}
              multiline
              numberOfLines={3}
              containerStyle={{ minHeight: 80 }}
            />
          </View>
          <View style={screenStyles.benchDetailsSubmitButton}>
            <Button
              title={loading ? t('benchDetails.adding') : t('benchDetails.addRatingButton')}
              onPress={submitRating}
              loading={loading}
              disabled={loading}
            />
          </View>
        </View>
      </View>

      <View style={screenStyles.benchDetailsSection}>
        <Text style={screenStyles.benchDetailsSectionTitle}>
          {t('benchDetails.setRarity')}
        </Text>
        <View style={screenStyles.benchDetailsRarityContainer}>
          {rarities.map((rarity) => (
            <Button
              key={rarity.id}
              title={rarity.name}
              onPress={() => setSelectedRarity(rarity.id)}
              style={[
                screenStyles.benchDetailsRarityButton,
                selectedRarity === rarity.id && screenStyles.benchDetailsRarityButtonSelected
              ]}
            />
          ))}
        </View>
        <View style={screenStyles.benchDetailsSubmitButton}>
          <Button
            title={loading ? t('benchDetails.updating') : t('benchDetails.updateRarityButton')}
            onPress={submitRarity}
            loading={loading}
            disabled={loading || !selectedRarity}
          />
        </View>
      </View>

      <View style={screenStyles.benchDetailsSection}>
        <Text style={screenStyles.benchDetailsSectionTitle}>
          {t('benchDetails.userRatings')} ({ratings.length})
        </Text>
        {ratings.length === 0 ? (
          <Text style={screenStyles.benchDetailsNoRatings}>{t('benchList.noRating')}. {t('benchDetails.beFirst')}</Text>
        ) : (
          ratings.map((rating, index) => (
            <View key={rating.id} style={[
              screenStyles.benchDetailsRatingItem,
              index === ratings.length - 1 && { borderBottomWidth: 0, marginBottom: 0 }
            ]}>
              <View style={screenStyles.benchDetailsRatingHeader}>
                <Text style={screenStyles.benchDetailsRatingUser}>
                  {t('benchDetails.user')}
                </Text>
                <View style={screenStyles.benchDetailsRatingInfo}>
                  <StarRating 
                    rating={rating.rating} 
                    readonly={true}
                    size={16}
                  />
                  <Text style={screenStyles.benchDetailsRatingDate}>
                    {formatDate(rating.created_at)}
                  </Text>
                </View>
              </View>
              <Text style={screenStyles.benchDetailsRatingComment}>
                {rating.comment}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};


export default BenchDetailsScreen;