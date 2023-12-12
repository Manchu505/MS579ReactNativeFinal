import React, {useState, useEffect} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';
import AnyQRCode from './screens/AnyQRCode';
import QRCodeGenerator from './screens/ContactCard';
import Camera from './screens/Camera';
import QRCodeDisplay from './QRCodeDisplay';


//The splash screen is shown for 5 seconds before hiding automatically.
SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 5000);
 
//A navigation component that creates a bottom tab navigation
const Tab = createBottomTabNavigator();

export function MyTabs() {
	return (
	  <Tab.Navigator
		initialRouteName="Home"
		screenOptions={{
		  tabBarActiveTintColor: '#e91e63',
		}}
	  >
    <Tab.Screen
		  name="Digital vCard"
		  component={HomeStack}
		  options={{
			tabBarLabel: 'vCard',
			tabBarIcon: ({ color, size }) => (
			  <MaterialCommunityIcons name="atom" color={color} size={size} />
			),
		  }}
		/>
		<Tab.Screen
		  name="Let's Scan Some Codes!"
		  component={Camera}
		  options={{
			tabBarLabel: 'Camera',
			tabBarIcon: ({ color, size }) => (
			  <MaterialCommunityIcons name="hexagon-slice-5" color={color} size={size} />
			),
		  }}
		/>
    <Tab.Screen
		  name="Get Ready to Generate"
		  component={AnyQRCode}
		  options={{
			tabBarLabel: 'QR Code',
			tabBarIcon: ({ color, size }) => (
			  <MaterialCommunityIcons name="qrcode-edit" color={color} size={size} />
			),
		  }}
		/>
		
	
	  </Tab.Navigator>
	);
}

const Stack = createStackNavigator();
const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName='Contact Card'>
      <Stack.Screen name="Contact Card" component={QRCodeGenerator} options={{ headerShown: false }}/>
      <Stack.Screen name="QRCard" component={QRCodeDisplay} />
    </Stack.Navigator>
  )
}

function App() {
  return (
    <NavigationContainer>
            <MyTabs/>
    </NavigationContainer>
   
  );
}

export default App;