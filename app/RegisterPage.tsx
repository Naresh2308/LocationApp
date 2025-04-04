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
import { MaterialIcons } from "@expo/vector-icons";
import supabase  from "./config/supabase"; // Adjust path as needed



type NavigationProp = NativeStackNavigationProp<RootStackParamList, "RegisterPage">;

const RegisterPage = () =>  {
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = (email: string) =>  {
    // Simple regex for email validation
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Please fill out all fields.");
      return;
    }
  
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    try {
      const { data, error: insertError } = await supabase
        .from('users') // Your Supabase table name
        .insert([{ name, email, password }]); // Consider hashing password before storing
  
      if (insertError) {
        console.error("Insert Error:", insertError.message);
        setError("Registration failed. Please try again.");
        return;
      }
  
      console.log("Registered:", { name, email, password });
      Alert.alert("Registered Succesfully.")
      setError("");
      navigation.navigate("LoginPage");
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
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>Join now to discover amazing food!</Text>

        {error !== "" && (
          <View style={styles.errorContainer}>
              <MaterialIcons name="info-outline" size={16} color={"red"} />
              <Text style={styles.error}>{error}</Text>
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />
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

        {/* {!isValidEmail(email) && email!=="" && (
              <View style={styles.errorContainer}>
                <MaterialIcons
                  name="info-outline"
                  size={16}
                  color={"red"}
                />
                <Text style={styles.errorText}>
                  Invalid Email
                </Text>
              </View>
        )} */}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
                  style={styles.link}
                  onPress={() => navigation.navigate("LoginPage")}
                >
                  <Text style={styles.linkText}>Already have an account? Log in</Text>
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
  link: {
    marginTop: 15,
  },
  linkText: {
    color: "#4F46E5",
    fontSize: 14,
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
    marginBottom: 3,
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
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginTop: 2,
    marginBottom: 8,
    gap: 4,
  },
  errorText: {
    color: "red",
    fontSize: 12,
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
});

export default RegisterPage;
