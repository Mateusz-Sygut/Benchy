import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ScrollingBenchesHeader from '../components/common/ScrollingBenchesHeader';
import { useThemedStyles } from '../hooks/useThemedStyles';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const { common, theme } = useThemedStyles();

  const CustomHeader = () => (
    <View style={common.authHeaderContainer}>
      <ScrollingBenchesHeader />
    </View>
  );

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: common.authHeaderStyle,
        headerTintColor: theme.navigation.headerTint,
        headerTitleStyle: common.authHeaderTitleStyle,
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
