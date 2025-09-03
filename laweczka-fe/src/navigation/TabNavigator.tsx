import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import MapScreen from '../screens/MapScreen';
import BenchListScreen from '../screens/BenchListScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { t } = useTranslation();
  
  const screenOptions = useMemo(() => ({
    map: {
      title: t('navigation.map'),
      headerShown: false // Hide header for full-screen map
    },
    benchList: {
      title: t('navigation.benchList')
    },
    profile: {
      title: t('navigation.profile')
    }
  }), [t]);
  
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
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#2E7D32',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        options={screenOptions.map}
      />
      <Tab.Screen 
        name="BenchList" 
        component={BenchListScreen} 
        options={screenOptions.benchList}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={screenOptions.profile}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

