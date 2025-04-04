import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { RootStackParamList } from "./index"; // Adjust this import if needed
import { useNavigation } from "@react-navigation/native"; 
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import FoodBG from "../assets/imagres/foodbg.jpg";

// Define navigation prop type
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "LandingPage">;

const LandingPage = () => {
  const navigation = useNavigation<NavigationProp>(); // Use the NavigationProp type here

  return (
    <ImageBackground
      source={require('../assets/images/foodbg.jpg')}  // Replace with your image path
      resizeMode="cover"
      style={styles.container}
    >
    <View style={styles.overlay}>
      {/* Header */}
      <Text style={styles.brand}>FindMyEats</Text>

      {/* Heading */}
      <Text style={styles.title}>Discover Delicious, Anytime, Anywhere!</Text>

      {/* Subheading */}
      <Text style={styles.subtitle}>
      Craving something tasty? Let FindMyEats lead the way!
      </Text>

      {/* Get Started Button */}
      <TouchableOpacity
        style={styles.button}
        // onPress={} // Now navigation is typed correctly
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      {/* Feature Cards */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personalized Picks</Text>
          <Text style={styles.cardSubtitle}>
          Tailored restaurant recommendations based on your taste and cravings.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top-Rated Spots</Text>
          <Text style={styles.cardSubtitle}>
            Discover the best restaurants near you, handpicked for quality.
          </Text>
        </View>
      </View>
      </View>
      
    </ImageBackground>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  brand: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4F46E5",
    marginBottom: 20,
    marginTop:50
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 10,
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // adjust 0.4 to control brightness
    zIndex: 1,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 30,
    height: 40,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardContainer: {
    flexDirection: "row",
    margin: 10,
    padding: 1,
  },
  card: {
    margin: 5,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    width: "45%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 5,
    alignContent:"center"
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    alignContent:"center"
  },
});

export default LandingPage;
