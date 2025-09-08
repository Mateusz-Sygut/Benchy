import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ScrollingBenchesHeader from '../components/common/ScrollingBenchesHeader';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const CustomHeader = () => (
    <View style={{ backgroundColor: '#22c55e', paddingTop: 40, paddingBottom: 8 }}>
      <ScrollingBenchesHeader />
    </View>
  );
  
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
        options={{
          header: () => <CustomHeader />,
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{
          header: () => <CustomHeader />,
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

