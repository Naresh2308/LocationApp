import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./index";
import { Ionicons } from "@expo/vector-icons"; // icon for eye toggle
import supabase from "./config/supabase";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "LoginPage">;

const LoginPage = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = (email: string) => {
    // Simple regex for email validation
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }
  
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    try {
      // Query Supabase for the user with this email
      const { data, error } = await supabase
        .from("users") // Your Supabase table name
        .select("*")
        .eq("email", email)
        .single(); // Expecting a single user
  
      if (error) {
        console.error("Supabase Error:", error.message);
        setError("Login failed. Please try again.");
        return;
      }
  
      if (!data) {
        setError("User not found. Please register first.");
        return;
      }
  
      // For security, check if passwords match (consider hashing passwords)
      if (data.password !== password) {
        setError("Incorrect password. Please try again.");
        return;
      }
  
      console.log("Logged In:", data);
      setError("");
      
      // Navigate to home page or store user session
      Alert.alert("Logged In Successfully");
      navigation.navigate("Dashboard");
  
    } catch (err) {
      console.error("Unexpected Error:", err);
      setError("Something went wrong.");
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/foodbg.jpg')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Text style={styles.brand}>FindMyEats</Text>
        <Text style={styles.title}>Login to Your Account</Text>
        <Text style={styles.subtitle}>Welcome back! Let’s get you eating.</Text>

        {error !== "" && <Text style={styles.error}>{error}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={22}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate("RegisterPage")}
        >
          <Text style={styles.linkText}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    alignItems: "center",
  },
  brand: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4F46E5",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 20,
    textAlign: "center",
  },
  error: {
    color: "#DC2626",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
    color: "#111827",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: '100%',
    height: 48,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
  },
  linkText: {
    color: "#4F46E5",
    fontSize: 14,
  },
});

export default LoginPage;
