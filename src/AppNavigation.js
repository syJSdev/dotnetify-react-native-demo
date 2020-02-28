import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './screens/LoginScreen';
import LiveGaugeScreen from './screens/LiveGaugeScreen';
import AFITop100Screen from './screens/AFITop100Screen';
import AFIDetailsScreen from './screens/AFIDetailsScreen';

const MainTab = createBottomTabNavigator();
const AppStack = createStackNavigator();

const MainTabScreen = () => (
  <MainTab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        const isIos = Platform.OS === 'ios';
        const iosIconSuffix = focused ? '' : '-outline';

        switch (route.name) {
          case 'LiveGauge':
            iconName = isIos
              ? `ios-speedometer${iosIconSuffix}`
              : 'md-speedometer';
            break;
          case 'AFITop100':
            iconName = isIos ? `ios-list-box${iosIconSuffix}` : 'md-list-box';
            break;
        }

        // You can return any component that you like here!
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      headerShown: false,
    })}
    tabBarOptions={{
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    }}>
    <MainTab.Screen
      name="AFITop100"
      options={({ route }) => ({ title: route.name })}
      component={AFITop100Screen}
    />
    <MainTab.Screen
      name="LiveGauge"
      options={({ route }) => ({ title: route.name })}
      component={LiveGaugeScreen}
    />
  </MainTab.Navigator>
);

const AppNavigation = () => (
  <AppStack.Navigator initialRouteName="Login">
    <AppStack.Screen
      name="Login"
      options={{ headerShown: false }}
      component={LoginScreen}
    />
    <AppStack.Screen
      name="Main"
      options={{ headerLeft: null }}
      component={MainTabScreen}
    />
    <AppStack.Screen
      name="AFIDetails"
      options={({ route }) => ({
        title: route.params.title,
      })}
      component={AFIDetailsScreen}
    />
  </AppStack.Navigator>
);
export default AppNavigation;
