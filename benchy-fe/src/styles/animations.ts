import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

const { width, height } = Dimensions.get('window');

export const animationStyles = StyleSheet.create({
  floatingLeafContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    pointerEvents: 'none',
  },
  
  backgroundPlantsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -2,
    pointerEvents: 'none',
  },
  
  particleEffectsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    pointerEvents: 'none',
  },
  
  animatedBackgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -3,
    pointerEvents: 'none',
  },
  
  animatedBackgroundGradient: {
    flex: 1,
  },
  
  fallingLeavesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    pointerEvents: 'none',
  },
});

export const animationConfigs = {
  floatingLeaves: [
    {
      icon: 'leaf-outline',
      size: 16,
      delay: 0,
      duration: 12000,
      startX: -30,
      startY: height * 0.3,
      endX: width + 30,
      endY: height * 0.1,
      color: colors.primary[400],
    },
    {
      icon: 'flower-outline',
      size: 12,
      delay: 4000,
      duration: 15000,
      startX: -25,
      startY: height * 0.5,
      endX: width + 25,
      endY: height * 0.2,
      color: colors.primary[300],
    },
  ],
  
  backgroundPlants: [
    {
      icon: 'leaf',
      size: 24,
      x: 20,
      y: height * 0.2,
      delay: 0,
      color: colors.primary[500],
    },
    {
      icon: 'flower',
      size: 20,
      x: 15,
      y: height * 0.4,
      delay: 2000,
      color: colors.primary[400],
    },
    
    {
      icon: 'leaf',
      size: 22,
      x: width - 50,
      y: height * 0.3,
      delay: 1000,
      color: colors.primary[500],
    },
    {
      icon: 'flower',
      size: 18,
      x: width - 45,
      y: height * 0.5,
      delay: 3000,
      color: colors.primary[400],
    },
  ],
  
  particles: [
    {
      icon: 'sparkles',
      size: 8,
      delay: 0,
      duration: 5000,
      startX: width * 0.1,
      startY: height * 0.3,
      endX: width * 0.3,
      endY: height * 0.1,
      color: colors.primary[300],
    },
    {
      icon: 'sparkles',
      size: 6,
      delay: 3000,
      duration: 6000,
      startX: width * 0.7,
      startY: height * 0.4,
      endX: width * 0.9,
      endY: height * 0.2,
      color: colors.primary[400],
    },
  ],
  
  durations: {
    gradientAnimation: 6000,
    plantPulse: 1500,
    leafFloat: 6000,
    particleSparkle: 2000,
  },
  
  delays: {
    plantStagger: 500,
    particleStagger: 1000,
    leafStagger: 2000,
  },
  
  gradientColors: ['rgba(34, 197, 94, 0.15)', 'rgba(34, 197, 94, 0.08)', 'rgba(0, 0, 0, 0.35)'] as const,
  gradientStart: { x: 0, y: 0 },
  gradientEnd: { x: 1, y: 1 },
  
  fallingLeavesColor: colors.primary[400],
};