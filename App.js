import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AuthScreen from './components/AuthScreen';
import Questions from './components/Questions';
import MealPlan from './components/MealPlan';
import MealDetails from './components/MealDetails';
import UserProfile from './components/UserProfile';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Questions':
              iconName = focused ? 'menu' : 'menu';
              break;
            case 'MealPlan':
              iconName = focused ? 'nutrition' : 'nutrition';
              break;
            case 'MealDetails':
              iconName = focused ? 'restaurant' : 'restaurant';
              break;
            case 'UserProfile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Questions" component={Questions} />
      <Tab.Screen name="MealPlan" component={MealPlan} />
      <Tab.Screen name="MealDetails" component={MealDetails} />
      <Tab.Screen name="UserProfile" component={UserProfile} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={MyTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
