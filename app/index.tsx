import React from "react";
import { Link } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Tabs from "expo-router";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Header } from "react-native/Libraries/NewAppScreen";
import LandingPage from "./LandingPage";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import MapScreen from "./MapScreen";

export type RootStackParamList = {
  LandingPage: undefined;
  RegisterPage: undefined;
  LoginPage: undefined;
  Dashboard: undefined;
  MapScreen: { destination: { lat: number; lng: number; name: string } };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="LandingPage">
      <Stack.Screen name="LandingPage" component={LandingPage} options={{headerShown:false}} />
      <Stack.Screen name="RegisterPage" component={RegisterPage} options={{headerShown:false}}/>
      <Stack.Screen name="LoginPage" component={LoginPage} options={{headerShown:false}}/>
      <Stack.Screen name="Dashboard" component={Dashboard} options={{headerShown:false}}/>
      <Stack.Screen name="MapScreen" component={MapScreen} options={{headerShown:false}}/>


      {/* <Stack.Screen name="PhoneNumberScreen" component={PhoneNumberScreen} options={{headerShown:false}} />
      <Stack.Screen name="PANInputScreen" component={PANInputScreen} options={{headerShown:false}}/>
      <Stack.Screen name="OTPScreen" component={OTPScreen} options={{headerShown:false}} />
      <Stack.Screen name="VerifiedScreen" component={VerifiedScreen} options={{headerShown:false}} />
      <Stack.Screen name="Dashboard" component={Dashboard}  options={{headerShown:false}}/>
      <Stack.Screen name="MutualFundsPage" component={MutualFundsPage} options={{headerShown:false}}/>
      <Stack.Screen name="StockPortfolio" component={StockPortfolio} options={{headerShown:false}}/>
      <Stack.Screen name="DetailedAnalysis" component={DetailedAnalysis} options={{headerShown:false}}/> */}
    </Stack.Navigator>
  );
}