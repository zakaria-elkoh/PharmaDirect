import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

const BASE_URL = "http://10.0.2.2:3000";

export default function MapScreen() {
  const [pharmacies, setPharmacies] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxDistance, setMaxDistance] = useState(5000);
  const [loading, setLoading] = useState(false);

  // Get user's location
  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to show nearby pharmacies."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(currentLocation);
      // Fetch guard duty pharmacies when location is obtained
      await fetchGuardPharmacies(
        currentLocation.latitude,
        currentLocation.longitude
      );
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Could not get your location. Please try again.");
    }
  };

  // Fetch pharmacies on guard duty
  const fetchGuardPharmacies = async (latitude, longitude) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/pharmacies/guard`, {
        params: {
          latitude,
          longitude,
          maxDistance,
        },
      });

      if (response.data && response.data.data) {
        setPharmacies(response.data.data);
      } else {
        setPharmacies([]);
      }
    } catch (error) {
      console.error("Error fetching guard pharmacies:", error);
      Alert.alert(
        "Error",
        "Could not fetch nearby pharmacies on duty. Please try again later."
      );
      setPharmacies([]);
    } finally {
      setLoading(false);
    }
  };

  // Search pharmacies by query
  const searchPharmacies = async () => {
    if (!userLocation) {
      Alert.alert(
        "Error",
        "Please enable location services to search nearby pharmacies."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/pharmacies/search`, {
        params: {
          query: searchQuery,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          maxDistance,
        },
      });

      if (response.data && response.data.data) {
        setPharmacies(response.data.data);
      } else {
        setPharmacies([]);
        Alert.alert(
          "Info",
          "No pharmacies found matching your search criteria."
        );
      }
    } catch (error) {
      console.error("Error searching pharmacies:", error);
      Alert.alert(
        "Error",
        "Could not complete the search. Please try again later."
      );
      setPharmacies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search pharmacies..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={searchPharmacies}
          disabled={loading}
        >
          <MaterialIcons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude || 32.2462,
          longitude: userLocation?.longitude || -8.5298,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {pharmacies &&
          pharmacies.length > 0 &&
          pharmacies.map((pharmacy) => (
            <Marker
              key={pharmacy._id}
              coordinate={{
                latitude: parseFloat(pharmacy.latitude) || 0,
                longitude: parseFloat(pharmacy.longitude) || 0,
              }}
              title={pharmacy.name}
              description={`${pharmacy.isOnDuty ? "On Duty" : "Not On Duty"}${
                pharmacy.distance
                  ? ` - ${pharmacy.distance.toFixed(1)}km away`
                  : ""
              }`}
              pinColor={pharmacy.isOnDuty ? "#2E8B57" : "#dc3545"}
            />
          ))}
      </MapView>

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() =>
          userLocation &&
          fetchGuardPharmacies(userLocation.latitude, userLocation.longitude)
        }
        disabled={loading}
      >
        <MaterialIcons name="refresh" size={24} color="#fff" />
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: "#2E8B57",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  refreshButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: "#2E8B57",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
