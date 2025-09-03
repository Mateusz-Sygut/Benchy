import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { StarRating } from '../components/common/StarRating';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import supabase from '../lib/supabase';
import { Database } from '../types/database';

type Bench = Database['public']['Tables']['benches']['Row'];
type Rating = Database['public']['Tables']['ratings']['Row'];

const BenchDetailsScreen = ({ route }: any) => {
  const { benchId } = route.params;
  const { user } = useAuth();
  const { t } = useTranslation();
  const [bench, setBench] = useState<Bench | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBenchDetails();
  }, [benchId]);

  const loadBenchDetails = async () => {
    try {
      // Load bench details
      const { data: benchData, error: benchError } = await supabase
        .from('benches')
        .select('*')
        .eq('id', benchId)
        .single();

      if (benchError) {
        console.error('Error loading bench:', benchError);
        Alert.alert(t('common.error'), 'Nie udało się załadować szczegółów ławeczki');
        return;
      }

      setBench(benchData);

      // Load ratings for this bench
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
      Alert.alert(t('common.error'), 'Wystąpił błąd podczas ładowania danych');
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
      Alert.alert(t('common.error'), 'Musisz być zalogowany żeby dodać ocenę');
      return;
    }

    setLoading(true);
    try {
      // Insert or update rating
      const { error } = await supabase
        .from('ratings')
        .upsert({
          bench_id: benchId,
          user_id: user.id,
          rating: userRating,
          comment: userComment.trim(),
        });

      if (error) {
        console.error('Error submitting rating:', error);
        Alert.alert(t('common.error'), t('benchDetails.ratingError'));
        return;
      }

      Alert.alert(t('common.success'), t('benchDetails.ratingAdded'));
      setUserRating(0);
      setUserComment('');
      loadBenchDetails(); // Refresh data
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert(t('common.error'), t('benchDetails.ratingError'));
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
      <View style={styles.container}>
        <Text style={styles.loading}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Bench Info */}
      <View style={styles.benchInfo}>
        <Text style={styles.icon}>{getBenchIcon(bench.image_type)}</Text>
        <View style={styles.benchDetails}>
          <Text style={styles.benchName}>
            {bench.name}
          </Text>
          {bench.description && (
            <Text style={styles.description}>
              {bench.description}
            </Text>
          )}
          <View style={styles.ratingRow}>
            <StarRating 
              rating={Math.round(bench.average_rating || 0)} 
              readonly={true}
              size={20}
            />
            <Text style={styles.ratingText}>
              {(bench.average_rating || 0).toFixed(1)} ({ratings.length} ocen)
            </Text>
          </View>
          <Text style={styles.location}>
            📍 {bench.latitude.toFixed(4)}, {bench.longitude.toFixed(4)}
          </Text>
          <Text style={styles.addedBy}>
            Dodane {formatDate(bench.created_at)}
          </Text>
        </View>
      </View>

      {/* Add Rating */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('benchDetails.addRating')}
        </Text>
        <View style={styles.ratingForm}>
          <View style={styles.starContainer}>
            <StarRating 
              rating={userRating} 
              onRatingChange={setUserRating}
              readonly={false}
              size={32}
            />
          </View>
          <View style={styles.commentInput}>
            <Input
              placeholder={t('benchDetails.commentPlaceholder')}
              value={userComment}
              onChangeText={setUserComment}
              multiline
              numberOfLines={3}
              style={{ minHeight: 80 }}
            />
          </View>
          <View style={styles.submitButton}>
            <Button
              title={loading ? t('benchDetails.adding') : t('benchDetails.addRatingButton')}
              onPress={submitRating}
              loading={loading}
              disabled={loading}
            />
          </View>
        </View>
      </View>

      {/* Ratings List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('benchDetails.userRatings')} ({ratings.length})
        </Text>
        {ratings.length === 0 ? (
          <Text style={styles.noRatings}>{t('benchList.noRating')}. {t('benchDetails.beFirst')}</Text>
        ) : (
          ratings.map((rating, index) => (
            <View key={rating.id} style={[
              styles.ratingItem,
              index === ratings.length - 1 && { borderBottomWidth: 0, marginBottom: 0 }
            ]}>
              <View style={styles.ratingHeader}>
                <Text style={styles.ratingUser}>
                  Użytkownik
                </Text>
                <View style={styles.ratingInfo}>
                  <StarRating 
                    rating={rating.rating} 
                    readonly={true}
                    size={16}
                  />
                  <Text style={styles.ratingDate}>
                    {formatDate(rating.created_at)}
                  </Text>
                </View>
              </View>
              <Text style={styles.ratingComment}>
                {rating.comment}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8f0',
  },
  loading: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#6b7280',
  },
  benchInfo: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    fontSize: 60,
    marginRight: 16,
    backgroundColor: '#f0f8f0',
    padding: 12,
    borderRadius: 50,
    textAlign: 'center',
    width: 80,
    height: 80,
    lineHeight: 56,
  },
  benchDetails: {
    flex: 1,
  },
  benchName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#4b5563',
    marginBottom: 12,
    lineHeight: 22,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#f8fdf8',
    padding: 8,
    borderRadius: 8,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
  },
  location: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
    fontWeight: '500',
  },
  addedBy: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  ratingForm: {
    alignItems: 'center',
  },
  starContainer: {
    backgroundColor: '#f8fdf8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  commentInput: {
    width: '100%',
    marginBottom: 20,
  },
  submitButton: {
    width: '100%',
  },
  noRatings: {
    textAlign: 'center',
    color: '#9ca3af',
    fontStyle: 'italic',
    marginVertical: 30,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 12,
  },
  ratingItem: {
    backgroundColor: '#f8fdf8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingUser: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1f2937',
    backgroundColor: '#e5f7e5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingDate: {
    marginLeft: 8,
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  ratingComment: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    fontStyle: 'italic',
  },
});

export default BenchDetailsScreen;