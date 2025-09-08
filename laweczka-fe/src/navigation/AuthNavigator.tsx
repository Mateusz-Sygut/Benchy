import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ScrollingBenchesHeader from '../components/common/ScrollingBenchesHeader';
import { commonStyles } from '../styles/common';
import { colors } from '../styles/colors';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const CustomHeader = () => (
    <View style={commonStyles.authHeaderContainer}>
      <ScrollingBenchesHeader />
    </View>
  );
  
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerStyle: commonStyles.authHeaderStyle,
        headerTintColor: colors.text.white,
        headerTitleStyle: commonStyles.authHeaderTitleStyle,
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

