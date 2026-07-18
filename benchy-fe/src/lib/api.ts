import { supabase } from './supabase';
import { Database } from '../types/database';
import { reverseGeocode, formatCityForDisplay, geocodeCoordinateCacheKey } from './geocoding';

type BenchRow = Database['public']['Tables']['benches']['Row'];

export const RECENT_BENCHES_DEFAULT_LIMIT = 10;

export interface RecentBench {
  id: string;
  name: string;
  city: string;
  addedAt: string;
}

function formatTimeAgo(createdAt: Date, t: (key: string) => string): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) {
    return t('time.justNow');
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${t('time.minutesAgo')}`;
  }
  if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} ${t('time.hoursAgo')}`;
  }
  const days = Math.floor(diffInMinutes / 1440);
  return `${days} ${t('time.daysAgo')}`;
}

export const getRecentBenches = async (
  limit: number = RECENT_BENCHES_DEFAULT_LIMIT,
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
      .limit(limit) as {
      data: Pick<BenchRow, 'id' | 'description' | 'created_at' | 'latitude' | 'longitude'>[] | null;
      error: unknown;
    };

    if (error) {
      console.error('Error fetching recent benches:', error);
      return [];
    }

    if (!data?.length) {
      return [];
    }

    const seenCoordKeys = new Set<string>();
    const uniqueCoords: { latitude: number; longitude: number }[] = [];

    for (const bench of data) {
      const key = geocodeCoordinateCacheKey(bench.latitude, bench.longitude);
      if (seenCoordKeys.has(key)) continue;
      seenCoordKeys.add(key);
      uniqueCoords.push({ latitude: bench.latitude, longitude: bench.longitude });
    }

    for (const coord of uniqueCoords) {
      await reverseGeocode(coord.latitude, coord.longitude, t);
    }

    return Promise.all(
      data.map(async (bench) => {
        const createdAt = new Date(bench.created_at);
        const timeAgo = formatTimeAgo(createdAt, t);

        const geocodingResult = await reverseGeocode(bench.latitude, bench.longitude, t);
        const city = geocodingResult
          ? formatCityForDisplay(geocodingResult, t)
          : `${bench.latitude.toFixed(4)}, ${bench.longitude.toFixed(4)}`;

        return {
          id: bench.id,
          name: bench.description || t('geocoding.noName'),
          city,
          addedAt: timeAgo,
        };
      })
    );
  } catch (error) {
    console.error('Error in getRecentBenches:', error);
    return [];
  }
};