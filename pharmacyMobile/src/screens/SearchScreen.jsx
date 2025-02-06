import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import PharmacyCard from "../components/PharmacyCard";
import { API_BASE_URL } from "../config/api.config";

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pharmaciesOnGuard, setPharmaciesOnGuard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredPharmacies, setFilteredPharmacies] = useState([]);

  // Charger les pharmacies de garde au démarrage
  useEffect(() => {
    fetchPharmaciesOnGuard();
  }, []);

  // Fonction pour formater l'adresse pour la recherche
  const getSearchableAddress = (pharmacy) => {
    if (!pharmacy.address) return "";

    if (typeof pharmacy.address === "string") {
      return pharmacy.address.toLowerCase();
    }

    const {
      street = "",
      city = "",
      country = "",
      postalCode = "",
    } = pharmacy.address;
    return `${street} ${city} ${country} ${postalCode}`.toLowerCase();
  };

  // Filtrer les pharmacies en fonction de la recherche
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPharmacies(pharmaciesOnGuard);
    } else {
      const searchTerm = searchQuery.toLowerCase();
      const filtered = pharmaciesOnGuard.filter((pharmacy) => {
        const nameMatch = pharmacy.name?.toLowerCase().includes(searchTerm);
        const addressMatch =
          getSearchableAddress(pharmacy).includes(searchTerm);
        return nameMatch || addressMatch;
      });
      setFilteredPharmacies(filtered);
    }
  }, [searchQuery, pharmaciesOnGuard]);

  const fetchPharmaciesOnGuard = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/pharmacies/on-guard`);
      if (response.data && response.data.data) {
        setPharmaciesOnGuard(response.data.data);
        setFilteredPharmacies(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching pharmacies on guard:", error);
      Alert.alert("Erreur", "Impossible de récupérer les pharmacies de garde.");
    } finally {
      setLoading(false);
    }
  };

  const navigateToNearbySearch = () => {
    navigation.navigate("NearbyPharmacies");
  };

  return (
    <View style={styles.container}>
      {/* Header avec titre */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pharmacies de Garde</Text>
      </View>

      {/* Bouton pour la recherche par proximité */}
      <TouchableOpacity
        style={styles.nearbyButton}
        onPress={navigateToNearbySearch}
      >
        <MaterialIcons name="location-on" size={24} color="white" />
        <Text style={styles.nearbyButtonText}>
          Trouver les pharmacies de garde près de moi
        </Text>
      </TouchableOpacity>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une pharmacie..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Liste des pharmacies */}
      {loading ? (
        <ActivityIndicator size="large" color="#0066CC" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredPharmacies}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                // console.log("Pharmacy data:", item);
                navigation.navigate("PharmacyDetails", {
                  pharmacy: item, // Assurez-vous que 'item' contient toutes les données de la pharmacie
                });
              }}
            >
              <PharmacyCard pharmacy={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Aucune pharmacie de garde trouvée
            </Text>
          }
          refreshing={loading}
          onRefresh={fetchPharmaciesOnGuard}
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
  nearbyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22C55E",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
  },
  nearbyButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 0,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginLeft: 8,
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

export default SearchScreen;
