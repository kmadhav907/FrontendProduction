import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import CurrentAndHistory from "../../views/CurrentAndHistory";
import DashboardView from "../../views/DashboardView";
import ETAScreen from "../../views/ETAScreen";
import FeedbackScreen from "../../views/Feedback";
import LoginView from "../../views/LoginView";
import MapRoutingScreen from "../../views/MapRoutingScreen";
import SplashView from "../../views/SplashView";
import UserProfileView from "../../views/UserProfileView";

const Navigators = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashView">
        <Stack.Screen
          name="SplashView"
          component={SplashView}
          // Hiding header for Splash Screen
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginView"
          options={{ headerShown: false }}
          component={LoginView}
        />
        <Stack.Screen
          name="DashBoardView"
          options={{ headerShown: false, gestureEnabled: false }}
          component={DashboardView}
        />
        <Stack.Screen
          name="UserProfileView"
          options={{ headerShown: false, gestureEnabled: false }}
          component={UserProfileView}
        />
        <Stack.Screen
          name="CurrentAndHistory"
          options={{ headerShown: false, gestureEnabled: false }}
          component={CurrentAndHistory}
        />

        <Stack.Screen
          name="RouteMap"
          options={{ headerShown: false, gestureEnabled: false }}
          component={MapRoutingScreen}
        />
        <Stack.Screen
          name="ETAScreen"
          options={{ headerShown: false, gestureEnabled: false }}
          component={ETAScreen}
        />
        <Stack.Screen
          name="FeedbackScreen"
          options={{ headerShown: false, gestureEnabled: false }}
          component={FeedbackScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Navigators;
