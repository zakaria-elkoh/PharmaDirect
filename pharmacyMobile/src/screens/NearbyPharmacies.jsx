import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import PharmacyCard from "../components/PharmacyCard";
import { API_BASE_URL } from "../config/api.config.js";

const NearbyPharmacies = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
        searchNearbyPharmacies(currentLocation.coords);
      }
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert(
        "Erreur",
        "Impossible d'obtenir votre position. Veuillez vérifier vos paramètres de localisation."
      );
    }
  };

  const searchNearbyPharmacies = async (coords) => {
    if (!coords || !coords.latitude || !coords.longitude) {
      Alert.alert("Erreur", "Coordonnées GPS non valides");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/pharmacies/guard`, {
        params: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          maxDistance: 10000,
        },
      });

      if (response.data && response.data.data) {
        setPharmacies(response.data.data);
      } else {
        setPharmacies([]);
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      let errorMessage = "Impossible de rechercher les pharmacies à proximité.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Alert.alert("Erreur", errorMessage, [
        {
          text: "Réessayer",
          onPress: () => coords && searchNearbyPharmacies(coords),
        },
        { text: "OK" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const navigateToPharmacyDetails = async (pharmacyId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/pharmacies/${pharmacyId}`
      );
      if (response.data) {
        navigation.navigate("PharmacyDetails", { pharmacy: response.data });
      }
    } catch (error) {
      console.error("Error fetching pharmacy details:", error);
      Alert.alert(
        "Erreur",
        "Impossible de charger les détails de la pharmacie."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pharmacies à proximité</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0066CC" style={styles.loader} />
      ) : (
        <FlatList
          data={pharmacies}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigateToPharmacyDetails(item._id)}
            >
              <PharmacyCard pharmacy={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Aucune pharmacie de garde trouvée à proximité
            </Text>
          }
          refreshing={loading}
          onRefresh={() => {
            if (location) {
              searchNearbyPharmacies(location);
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    backgroundColor: "#0066CC",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  listContainer: {
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});

export default NearbyPharmacies;
