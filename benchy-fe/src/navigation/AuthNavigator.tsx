import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ScrollingBenchesHeader from '../components/common/ScrollingBenchesHeader';
import {
  AnimatedBackground,
  BackgroundPlants,
  ParticleEffects,
  PlantAnimations,
  RandomLeaves,
} from '../components/common/AnimationSystem';
import { useThemedStyles } from '../hooks/useThemedStyles';

const Stack = createNativeStackNavigator();

const authHero = require('../../assets/benchy-title-hero.png');

const AuthNavigator = () => {
  const { common, screen: screenStyles } = useThemedStyles();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={styles.background} pointerEvents="none">
        <ImageBackground
          source={authHero}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          imageStyle={screenStyles.authBackgroundStyle}
        >
          <LinearGradient
            colors={[
              'rgba(0, 0, 0, 0.2)',
              'rgba(0, 0, 0, 0.3)',
              'rgba(0, 0, 0, 0.5)',
              'rgba(0, 0, 0, 0.7)',
            ]}
            style={StyleSheet.absoluteFill}
          >
            <AnimatedBackground />
            <BackgroundPlants />
            <PlantAnimations variant="login" />
            <ParticleEffects />
            <RandomLeaves />
          </LinearGradient>
        </ImageBackground>
      </View>

      <View
        style={[
          common.authHeaderContainer,
          { paddingTop: Math.max(insets.top, 12) + 8 },
        ]}
      >
        <ScrollingBenchesHeader />
      </View>

      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          contentStyle: styles.transparent,
          animation: 'fade',
          animationDuration: 180,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#3d5c3a',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
});

export default AuthNavigator;
