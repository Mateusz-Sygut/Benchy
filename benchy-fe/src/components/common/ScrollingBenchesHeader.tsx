import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { getRecentBenches, RecentBench } from '../../lib/api';
import { componentStyles } from '../../styles/components';
import { colors } from '../../styles/colors';
import { FallingLeavesEffect } from './AnimationSystem';

const ScrollingBenchesHeader: React.FC = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recentBenches, setRecentBenches] = useState<RecentBench[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFallingLeaves, setShowFallingLeaves] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fetchRecentBenches = async () => {
      try {
        const benches = await getRecentBenches(5, t);
        setRecentBenches(benches);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recent benches:', error);
        setLoading(false);
      }
    };

    fetchRecentBenches();
  }, [t]);

  useEffect(() => {
    if (recentBenches.length > 0 && !loading) {
      setShowFallingLeaves(true);
      const timer = setTimeout(() => {
        setShowFallingLeaves(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [recentBenches, loading]);

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
      <FallingLeavesEffect isVisible={showFallingLeaves} />
      <View style={componentStyles.scrollingHeaderIconContainer}>
        <Ionicons name="time-outline" size={16} color={colors.text.white} />
      </View>
      <View style={componentStyles.scrollingHeaderTextContainer}>
        <Text style={componentStyles.scrollingHeaderMainText}>
          {t('header.latestBench')}
        </Text>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={componentStyles.scrollingHeaderBenchText}>
            "{currentBench.name}" {t('header.in')} {currentBench.city}
          </Text>
          <Text style={componentStyles.scrollingHeaderTimeText}>
            {currentBench.addedAt}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};


export default ScrollingBenchesHeader;
