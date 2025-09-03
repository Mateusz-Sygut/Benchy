import React, { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import TabNavigator from './TabNavigator';
import AddBenchScreen from '../screens/AddBenchScreen';
import BenchDetailsScreen from '../screens/BenchDetailsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { t } = useTranslation();
  
  const screenOptions = useMemo(() => ({
    addBench: {
      title: t('navigation.addBench'),
      headerStyle: { backgroundColor: '#2E7D32' },
      headerTintColor: '#fff',
    },
    benchDetails: {
      title: t('navigation.benchDetails'),
      headerStyle: { backgroundColor: '#2E7D32' },
      headerTintColor: '#fff',
    },
  }), [t]);
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={TabNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AddBench" 
        component={AddBenchScreen} 
        options={screenOptions.addBench}
      />
      <Stack.Screen 
        name="BenchDetails" 
        component={BenchDetailsScreen} 
        options={screenOptions.benchDetails}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;

