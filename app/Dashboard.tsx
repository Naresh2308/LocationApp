import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./index";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Dashboard">;

interface Place {
  id: string;
  title: string;
  distance: number;
  averageRating?: number;
  lat: number;
  lng: number;
}

const Dashboard = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationText, setLocationText] = useState("");
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission to access location was denied");
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        console.log("User Location:", latitude, longitude);

        const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        const address = reverseGeocode[0];
        const fullAddress = `${address.name}, ${address.city}`;
        setLocationText(fullAddress);

        const response = await axios.get("https://discover.search.hereapi.com/v1/discover", {
          params: {
            apiKey: "_UGuAWY5t6u2nIPx_HTh3Dc6jkRHg9LTmv_oPAoTvkA",
            at: `${latitude},${longitude}`,
            q: "restaurant,cafe,hotel",
            limit: 30,
          },
        });

        const data: Place[] = response.data.items.map((item: any) => ({
          id: item.id,
          title: item.title,
          distance: item.distance,
          averageRating: item.averageRating,
          lat: item.position.lat,
          lng: item.position.lng,
        }));

        const filtered = data.filter((place) => place.distance <= 5000);
        setPlaces(filtered);
      } catch (e: any) {
        setError("Failed to fetch places. " + e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return <ActivityIndicator size="large" color="#4F46E5" style={styles.loader} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.brand}>FindMyEats 🍽️</Text>
        <Text style={styles.locationText}>📍 {locationText}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Nearby Places</Text>
        {places.length === 0 ? (
          <Text style={styles.info}>No places found nearby.</Text>
        ) : (
          <FlatList
            data={places}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  navigation.navigate("MapScreen", {
                    destination: {
                      lat: item.lat,
                      lng: item.lng,
                      name: item.title,
                    },
                  });
                }}
              >
                <Text style={styles.placeTitle}>{item.title}</Text>
                <Text style={styles.placeInfo}>📍 {Math.round(item.distance)} meters away</Text>
                <Text style={styles.placeInfo}>
                  ⭐ {item.averageRating ? item.averageRating.toFixed(1) : "N/A"}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerContainer: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: "#4F46E5",
  },
  brand: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  locationText: {
    fontSize: 14,
    color: "#e0e7ff",
    marginTop: 4,
  },
  body: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  placeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  placeInfo: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  info: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 16,
  },
  error: {
    color: "red",
    padding: 20,
    textAlign: "center",
  },
});

export default Dashboard;
