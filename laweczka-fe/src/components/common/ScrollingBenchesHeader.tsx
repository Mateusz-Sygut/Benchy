import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { getRecentBenches, RecentBench } from '../../lib/api';

const ScrollingBenchesHeader: React.FC = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recentBenches, setRecentBenches] = useState<RecentBench[]>([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Pobierz rzeczywiste dane z API
  useEffect(() => {
    const fetchRecentBenches = async () => {
      try {
        const benches = await getRecentBenches(5, t);
        setRecentBenches(benches);
      } catch (error) {
        console.error('Error fetching recent benches:', error);
        // Fallback do mock data jeśli API nie działa
        setRecentBenches([
          { id: '1', name: 'Park Centralny', city: 'Warszawa', addedAt: '2 min temu' },
          { id: '2', name: 'Nad Wisłą', city: 'Kraków', addedAt: '5 min temu' },
          { id: '3', name: 'Stare Miasto', city: 'Gdańsk', addedAt: '8 min temu' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBenches();
  }, []);

  useEffect(() => {
    if (recentBenches.length === 0) return;

    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        // Change index
        setCurrentIndex((prev) => (prev + 1) % recentBenches.length);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      });
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [fadeAnim, recentBenches.length]);

  const currentBench = recentBenches[currentIndex];

  // Jeśli nie ma danych lub ładowanie, pokaż placeholder
  if (loading || recentBenches.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="time-outline" size={16} color="#ffffff" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>
            {t('header.latestBench')}
          </Text>
          <Text style={styles.benchText}>
            Ładowanie...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="time-outline" size={16} color="#ffffff" />
      </View>
      <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
        <Text style={styles.mainText}>
          {t('header.latestBench')}
        </Text>
        <Text style={styles.benchText}>
          "{currentBench.name}" w {currentBench.city}
        </Text>
        <Text style={styles.timeText}>
          {currentBench.addedAt}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 6,
  },
  textContainer: {
    flex: 1,
  },
  mainText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.85,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  benchText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 3,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  timeText: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.75,
    marginTop: 2,
    fontWeight: '500',
    fontStyle: 'italic',
  },
});

export default ScrollingBenchesHeader;
