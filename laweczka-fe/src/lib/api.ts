import { supabase } from './supabase';
import { Bench } from '../types/database';
import { reverseGeocode, formatCityForDisplay } from './geocoding';

export interface RecentBench {
  id: string;
  name: string;
  city: string;
  addedAt: string;
}

export const getRecentBenches = async (
  limit: number = 5,
  t: (key: string) => string
): Promise<RecentBench[]> => {
  try {
    const { data, error } = await supabase
      .from('benches')
      .select(`
        id,
        description,
        created_at,
        latitude,
        longitude
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent benches:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    const recentBenches: RecentBench[] = await Promise.all(
      data.map(async (bench) => {
        const createdAt = new Date(bench.created_at);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
        
        let timeAgo: string;
        if (diffInMinutes < 1) {
          timeAgo = t('time.justNow');
        } else if (diffInMinutes < 60) {
          timeAgo = `${diffInMinutes} ${t('time.minutesAgo')}`;
        } else if (diffInMinutes < 1440) {
          const hours = Math.floor(diffInMinutes / 60);
          timeAgo = `${hours} ${t('time.hoursAgo')}`;
        } else {
          const days = Math.floor(diffInMinutes / 1440);
          timeAgo = `${days} ${t('time.daysAgo')}`;
        }

        const geocodingResult = await reverseGeocode(bench.latitude, bench.longitude, t);
        const city = formatCityForDisplay(geocodingResult, t);

        return {
          id: bench.id,
          name: bench.description || t('geocoding.noName'),
          city,
          addedAt: timeAgo,
        };
      })
    );

    return recentBenches;
  } catch (error) {
    console.error('Error in getRecentBenches:', error);
    return [];
  }
};
