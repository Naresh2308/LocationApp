import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { decode } from "../flexiblePolylineDecoder"; // Ensure you have this file with the decode function

interface Destination {
  lat: number;
  lng: number;
  name: string;
}

const MapScreen = ({ route }: { route: { params: { destination: Destination } } }) => {
  const { destination } = route.params;

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const HERE_API_KEY = "_UGuAWY5t6u2nIPx_HTh3Dc6jkRHg9LTmv_oPAoTvkA"; // Make sure to add your API Key here

  useEffect(() => {
    (async () => {
      try {
        // Request permission to access location
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission to access location was denied");
          setLoading(false);
          return;
        }

        // Get user's current location
        const location = await Location.getCurrentPositionAsync({});
        const origin = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(origin);

        // Fetch route from HERE Routing API
        await fetchRoute(origin, destination);
      } catch (err) {
        setError("Failed to fetch location or route.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fetchRoute = async (
    origin: { latitude: number; longitude: number },
    destination: { lat: number; lng: number }
  ) => {
    try {
      const url = `https://router.hereapi.com/v8/routes?transportMode=car&origin=${origin.latitude},${origin.longitude}&destination=${destination.lat},${destination.lng}&return=polyline&apiKey=${HERE_API_KEY}`;
      const response = await axios.get(url);
      console.log("HERE API Response:", response.data);
      const polylineEncoded = response.data.routes[0].sections[0].polyline;

      // Decode the flexible polyline into an array of [lat, lng] pairs
      const decoded = decode(polylineEncoded);

      // Map decoded coordinates to the format required by Polyline
      const coords = decoded.map((coord: number[]) => ({
        latitude: coord[0],
        longitude: coord[1],
      }));
      setRouteCoords(coords);
    } catch (error) {
      console.error("Error fetching route:", error);
      setError("Failed to fetch route.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: userLocation?.latitude ?? 0,
        longitude: userLocation?.longitude ?? 0,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {/* User Marker */}
      <Marker coordinate={userLocation!} title="You" />

      {/* Destination Marker */}
      <Marker coordinate={{ latitude: destination.lat, longitude: destination.lng }} title={destination.name} />

      {/* Route Polyline */}
      {routeCoords.length > 0 && (
        <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="blue" />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default MapScreen;
