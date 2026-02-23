import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { animationStyles, animationConfigs } from '../../styles/animations';

const { width, height } = Dimensions.get('window');

interface AnimationElementProps {
  icon: string;
  size: number;
  delay: number;
  duration: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  animationType: 'floating' | 'falling' | 'particle' | 'pulsing' | 'random';
}

const AnimationElement: React.FC<AnimationElementProps> = ({
  icon,
  size,
  delay,
  duration,
  startX,
  startY,
  endX,
  endY,
  color,
  animationType
}) => {
  const translateX = useRef(new Animated.Value(startX)).current;
  const translateY = useRef(new Animated.Value(startY)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.3)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const animate = () => {
      const animations: Animated.CompositeAnimation[] = [];

      animations.push(
        Animated.timing(translateX, {
          toValue: endX,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: endY,
          duration: duration,
          useNativeDriver: true,
        })
      );

      switch (animationType) {
        case 'floating':
          animations.push(
            Animated.timing(rotate, {
              toValue: 1,
              duration: duration,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(opacity, {
                toValue: 0.8,
                duration: duration * 0.3,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0.3,
                duration: duration * 0.7,
                useNativeDriver: true,
              }),
            ])
          );
          break;

        case 'falling':
          animations.push(
            Animated.timing(rotate, {
              toValue: 1,
              duration: duration,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(opacity, {
                toValue: 1,
                duration: duration * 0.1,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0,
                duration: duration * 0.9,
                useNativeDriver: true,
              }),
            ])
          );
          break;

        case 'particle':
          animations.push(
            Animated.sequence([
              Animated.timing(scale, {
                toValue: 1,
                duration: duration * 0.2,
                useNativeDriver: true,
              }),
              Animated.timing(scale, {
                toValue: 0,
                duration: duration * 0.8,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(opacity, {
                toValue: 1,
                duration: duration * 0.1,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0,
                duration: duration * 0.9,
                useNativeDriver: true,
              }),
            ])
          );
          break;

        case 'pulsing':
          animations.push(
            Animated.sequence([
              Animated.timing(scale, {
                toValue: 1.2,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(scale, {
                toValue: 0.8,
                duration: 2000,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(opacity, {
                toValue: 0.8,
                duration: 1500,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0.4,
                duration: 1500,
                useNativeDriver: true,
              }),
            ])
          );
          break;

        case 'random':
          const newStartX = Math.random() * width;
          const newStartY = Math.random() * height * 0.8 + height * 0.1;
          const newEndX = Math.random() * width;
          const newEndY = Math.random() * height * 0.8 + height * 0.1;
          
          translateX.setValue(newStartX);
          translateY.setValue(newStartY);
          
          animations.push(
            Animated.timing(translateX, {
              toValue: newEndX,
              duration: duration,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: newEndY,
              duration: duration,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(opacity, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0.8,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0.8,
                duration: duration - 1600,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(scale, {
                toValue: 0.5,
                duration: 0,
                useNativeDriver: true,
              }),
              Animated.timing(scale, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(scale, {
                toValue: 1,
                duration: duration - 1600,
                useNativeDriver: true,
              }),
              Animated.timing(scale, {
                toValue: 0.5,
                duration: 800,
                useNativeDriver: true,
              }),
            ])
          );
          break;
      }

      Animated.parallel(animations).start(() => {
        if (animationType === 'random') {
          const newStartX = Math.random() * width;
          const newStartY = Math.random() * height * 0.8 + height * 0.1;
          translateX.setValue(newStartX);
          translateY.setValue(newStartY);
        } else {
          translateX.setValue(startX);
          translateY.setValue(startY);
        }
        rotate.setValue(0);
        opacity.setValue(0.3);
        scale.setValue(0.8);
        setTimeout(animate, delay);
      });
    };

    const timer = setTimeout(animate, delay);
    return () => clearTimeout(timer);
  }, [delay, duration, startX, startY, endX, endY, animationType]);

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        transform: [
          { translateX },
          { translateY },
          { rotate: rotation },
          { scale },
        ],
        opacity,
      }}
    >
      <Ionicons name={icon as any} size={size} color={color} />
    </Animated.View>
  );
};

const AnimatedBackgroundComponent: React.FC = () => {
  const opacityAnimation = useRef(new Animated.Value(0.1)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacityAnimation, {
          toValue: 0.2,
          duration: animationConfigs.durations.gradientAnimation,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimation, {
          toValue: 0.1,
          duration: animationConfigs.durations.gradientAnimation,
          useNativeDriver: true,
        }),
      ]).start(() => {
        animate();
      });
    };

    animate();
  }, []);

  return (
    <View style={animationStyles.animatedBackgroundContainer}>
      <Animated.View style={[animationStyles.animatedBackgroundGradient, { opacity: opacityAnimation }]}>
        <LinearGradient
          colors={animationConfigs.gradientColors}
          style={animationStyles.animatedBackgroundGradient}
          start={animationConfigs.gradientStart}
          end={animationConfigs.gradientEnd}
        />
      </Animated.View>
    </View>
  );
};

interface AnimationSystemProps {
  type: 'background' | 'floating' | 'falling' | 'particles' | 'pulsing' | 'random';
  isVisible?: boolean;
  customElements?: AnimationElementProps[];
}

export const AnimationSystem: React.FC<AnimationSystemProps> = ({ 
  type, 
  isVisible = true, 
  customElements 
}) => {
  if (!isVisible) return null;

  const getElements = (): AnimationElementProps[] => {
    if (customElements) return customElements;

    switch (type) {
      case 'floating':
        return animationConfigs.floatingLeaves.map(leaf => ({
          ...leaf,
          animationType: 'floating' as const
        }));
      
      case 'falling':
        return [
          {
            icon: 'leaf-outline',
            size: 12,
            delay: 0,
            duration: 2000,
            startX: width * 0.3,
            startY: 60,
            endX: width * 0.25,
            endY: height * 0.2,
            color: animationConfigs.fallingLeavesColor,
            animationType: 'falling' as const
          },
          {
            icon: 'flower-outline',
            size: 10,
            delay: 300,
            duration: 2500,
            startX: width * 0.7,
            startY: 60,
            endX: width * 0.65,
            endY: height * 0.25,
            color: animationConfigs.fallingLeavesColor,
            animationType: 'falling' as const
          }
        ];
      
      case 'particles':
        return animationConfigs.particles.map(particle => ({
          ...particle,
          animationType: 'particle' as const
        }));
      
      case 'pulsing':
        return animationConfigs.backgroundPlants.map(plant => ({
          ...plant,
          animationType: 'pulsing' as const,
          startX: plant.x,
          startY: plant.y,
          endX: plant.x,
          endY: plant.y,
          duration: 4000
        }));
      
      case 'random':
        return Array.from({ length: 3 }, (_, index) => ({
          icon: ['leaf-outline', 'flower-outline', 'leaf'][index],
          size: 12 + index * 2,
          delay: 1000 + index * 1500,
          duration: 3000 + index * 1000,
          startX: width * 0.5,
          startY: height * 0.5,
          endX: width * 0.5,
          endY: height * 0.5,
          color: animationConfigs.fallingLeavesColor,
          animationType: 'random' as const
        }));
      
      default:
        return [];
    }
  };

  const elements = getElements();
  const getContainerStyle = () => {
    switch (type) {
      case 'floating':
        return animationStyles.floatingLeafContainer;
      case 'particles':
        return animationStyles.particleEffectsContainer;
      case 'pulsing':
        return animationStyles.backgroundPlantsContainer;
      case 'falling':
        return animationStyles.fallingLeavesContainer;
      default:
        return animationStyles.floatingLeafContainer;
    }
  };
  
  const containerStyle = getContainerStyle();

  if (type === 'background') {
    return <AnimatedBackgroundComponent />;
  }

  return (
    <View style={containerStyle}>
      {elements.map((element, index) => (
        <AnimationElement key={index} {...element} />
      ))}
    </View>
  );
};

export const PlantAnimations: React.FC<{ variant?: 'login' | 'register' }> = ({ variant = 'login' }) => (
  <AnimationSystem type="floating" />
);

export const BackgroundPlants: React.FC = () => (
  <AnimationSystem type="pulsing" />
);

export const ParticleEffects: React.FC = () => (
  <AnimationSystem type="particles" />
);

export const FallingLeavesEffect: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
  <AnimationSystem type="falling" isVisible={isVisible} />
);

export const AnimatedBackground: React.FC = () => (
  <AnimationSystem type="background" />
);

export const RandomLeaves: React.FC = () => (
  <AnimationSystem type="random" />
);

export default AnimationSystem;
