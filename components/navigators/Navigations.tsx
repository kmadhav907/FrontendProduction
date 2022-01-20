import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import DashboardView from '../../views/DashboardView';
import LoginView from '../../views/LoginView';
import SplashView from '../../views/SplashView';

const Navigators = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashView"
          component={SplashView}
          // Hiding header for Splash Screen
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LoginView"
          options={{headerShown: false}}
          component={LoginView}
        />
        <Stack.Screen
          name="DashboardView"
          options={{headerShown: false}}
          component={DashboardView}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Navigators;
