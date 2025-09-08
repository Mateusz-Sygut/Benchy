import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { getRecentBenches, RecentBench } from '../../lib/api';
import { componentStyles } from '../../styles/components';
import { colors } from '../../styles/colors';

const ScrollingBenchesHeader: React.FC = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recentBenches, setRecentBenches] = useState<RecentBench[]>([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fetchRecentBenches = async () => {
      try {
        const benches = await getRecentBenches(5, t);
        setRecentBenches(benches);
      } catch (error) {
        console.error('Error fetching recent benches:', error);
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
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex((prev) => (prev + 1) % recentBenches.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [fadeAnim, recentBenches.length]);

  const currentBench = recentBenches[currentIndex];

  if (loading || recentBenches.length === 0) {
    return (
      <View style={componentStyles.scrollingHeaderContainer}>
        <View style={componentStyles.scrollingHeaderIconContainer}>
          <Ionicons name="time-outline" size={16} color={colors.text.white} />
        </View>
        <View style={componentStyles.scrollingHeaderTextContainer}>
          <Text style={componentStyles.scrollingHeaderMainText}>
            {t('header.latestBench')}
          </Text>
          <Text style={componentStyles.scrollingHeaderBenchText}>
            {t('common.loading')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={componentStyles.scrollingHeaderContainer}>
      <View style={componentStyles.scrollingHeaderIconContainer}>
        <Ionicons name="time-outline" size={16} color={colors.text.white} />
      </View>
      <Animated.View style={[componentStyles.scrollingHeaderTextContainer, { opacity: fadeAnim }]}>
        <Text style={componentStyles.scrollingHeaderMainText}>
          {t('header.latestBench')}
        </Text>
        <Text style={componentStyles.scrollingHeaderBenchText}>
          "{currentBench.name}" w {currentBench.city}
        </Text>
        <Text style={componentStyles.scrollingHeaderTimeText}>
          {currentBench.addedAt}
        </Text>
      </Animated.View>
    </View>
  );
};


export default ScrollingBenchesHeader;
