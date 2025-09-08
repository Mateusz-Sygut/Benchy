import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import MapScreen from '../screens/MapScreen';
import BenchListScreen from '../screens/BenchListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { commonStyles } from '../styles/common';
import { colors } from '../styles/colors';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { t } = useTranslation();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'BenchList') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary[800],
        tabBarInactiveTintColor: colors.text.secondary,
        headerStyle: commonStyles.tabHeaderStyle,
        headerTintColor: colors.text.white,
        headerTitleStyle: commonStyles.tabHeaderTitleStyle,
      })}
    >
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        options={{
          title: t('navigation.map'),
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="BenchList" 
        component={BenchListScreen} 
        options={{
          title: t('navigation.benchList')
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: t('navigation.profile')
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

