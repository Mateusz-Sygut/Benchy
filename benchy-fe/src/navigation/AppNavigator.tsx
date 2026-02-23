import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import TabNavigator from './TabNavigator';
import AddBenchScreen from '../screens/AddBenchScreen';
import BenchDetailsScreen from '../screens/BenchDetailsScreen';
import { commonStyles } from '../styles/common';
import { colors } from '../styles/colors';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { t } = useTranslation();
  
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
        options={{
          title: t('navigation.addBench'),
          headerStyle: commonStyles.mainHeaderStyle,
          headerTintColor: colors.text.white,
        }}
      />
      <Stack.Screen 
        name="BenchDetails" 
        component={BenchDetailsScreen} 
        options={{
          title: t('navigation.benchDetails'),
          headerStyle: commonStyles.mainHeaderStyle,
          headerTintColor: colors.text.white,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;

