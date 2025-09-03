import React, { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ScrollingBenchesHeader from '../components/common/ScrollingBenchesHeader';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const { t } = useTranslation();
  
  const CustomHeader = () => (
    <View style={{ backgroundColor: '#22c55e', paddingTop: 40, paddingBottom: 8 }}>
      <ScrollingBenchesHeader />
    </View>
  );
  
  const screenOptions = useMemo(() => ({
    login: {
      header: () => <CustomHeader />,
      headerShown: true,
    },
    register: {
      header: () => <CustomHeader />,
      headerShown: true,
    }
  }), []);
  
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#22c55e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={screenOptions.login}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={screenOptions.register}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

