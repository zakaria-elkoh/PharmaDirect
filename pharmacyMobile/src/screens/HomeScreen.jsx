import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Platform,
  Dimensions,
} from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function HomeScreen({ navigation }) {
  const [pharmacies, setPharmacies] = useState([]);
  const [location, setLocation] = useState(null);
  const [searchAddress, setSearchAddress] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Obtenir la localisation actuelle
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission de localisation refusée");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      fetchNearbyPharmacies(location.coords, date);
    } catch (error) {
      alert("Erreur lors de la récupération de la localisation");
    }
  };

  // Rechercher une adresse
  const searchByAddress = async () => {
    try {
      const result = await Location.geocodeAsync(searchAddress);
      if (result.length > 0) {
        const coords = {
          latitude: result[0].latitude,
          longitude: result[0].longitude,
        };
        setLocation(coords);
        fetchNearbyPharmacies(coords, date);
      }
    } catch (error) {
      alert("Erreur lors de la recherche de l'adresse");
    }
  };

  // Récupérer les pharmacies de garde
  const fetchNearbyPharmacies = async (coords, selectedDate) => {
    try {
      setLoading(true);
      const dateStr = selectedDate.toISOString().split("T")[0];
      const response = await axios(
        `http://localhost:3000/pharmacy/guard?latitude=${coords.latitude}&longitude=${coords.longitude}&date=${dateStr}&maxDistance=5000`
      );
      const data = await response.json();
      setPharmacies(data.data);
    } catch (error) {
      alert("Erreur lors de la récupération des pharmacies");
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les détails d'une pharmacie
  const fetchPharmacyDetails = async (pharmacyId) => {
    try {
      const response = await axios(
        `http://localhost:3000/pharmacy/${pharmacyId}`
      );
      const data = await response.json();
      setSelectedPharmacy(data.data);
      setShowDetails(true);
    } catch (error) {
      alert("Erreur lors de la récupération des détails");
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Modal des détails de la pharmacie
  const PharmacyDetailsModal = () => (
    <Modal
      visible={showDetails}
      animationType="slide"
      onRequestClose={() => setShowDetails(false)}
    >
      <ScrollView style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setShowDetails(false)}
        >
          <MaterialIcons name="close" size={24} color="black" />
        </TouchableOpacity>

        {selectedPharmacy && (
          <View style={styles.detailsContainer}>
            <Image
              source={{
                uri:
                  selectedPharmacy.image || "https://via.placeholder.com/150",
              }}
              style={styles.detailsImage}
            />
            <Text style={styles.detailsTitle}>{selectedPharmacy.name}</Text>

            {/* Informations de contact */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Contact</Text>
              <Text>Téléphone: {selectedPharmacy.phone}</Text>
              <Text>Email: {selectedPharmacy.email}</Text>
              <Text>Adresse: {selectedPharmacy.detailedAddress}</Text>
            </View>

            {/* Horaires */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Horaires d'ouverture</Text>
              <Text>{selectedPharmacy.openingHours || "24h/24"}</Text>
            </View>

            {/* Services */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Services</Text>
              {selectedPharmacy.services?.map((service, index) => (
                <Text key={index}>• {service}</Text>
              ))}
            </View>

            {/* Mini carte */}
            {location && (
              <MapView
                style={styles.miniMap}
                initialRegion={{
                  latitude: selectedPharmacy.latitude,
                  longitude: selectedPharmacy.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: selectedPharmacy.latitude,
                    longitude: selectedPharmacy.longitude,
                  }}
                  title={selectedPharmacy.name}
                />
              </MapView>
            )}
          </View>
        )}
      </ScrollView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Barre de recherche d'adresse */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Entrez une adresse..."
          value={searchAddress}
          onChangeText={setSearchAddress}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchByAddress}>
          <Text style={styles.buttonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>

      {pharmacies.length > 0 &&
        pharmacies?.map((pharmacy) => (
          <View key={pharmacy._id} style={styles.card}>
            <Image
              source={{ uri: "https://via.placeholder.com/150" }}
              style={styles.image}
            />
            <View style={styles.cardContent}>
              <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
              <Text style={styles.email}>{pharmacy.email}</Text>
              <Text style={styles.phone}>{pharmacy.phone}</Text>
              <View style={styles.ratingContainer}>
                {[...Array(5)]?.map((_, index) => (
                  <MaterialIcons
                    key={index}
                    name={
                      index < Math.floor(pharmacy?.rating || 3)
                        ? "star"
                        : index < 3
                        ? "star-half"
                        : "star-border"
                    }
                    size={20}
                    color={
                      index < Math.floor(pharmacy.rating || 3)
                        ? "#FFD700"
                        : "#bbb"
                    }
                  />
                ))}
              </View>
              <Text
                style={[
                  styles.dutyStatus,
                  pharmacy.isOnDuty ? styles.dutyOn : styles.dutyOff,
                ]}
              >
                {pharmacy.isOnDuty ? "On Duty" : "Not On Duty"}
              </Text>
              <Text style={styles.location}>{pharmacy.detailedAddress}</Text>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => showDetails(pharmacy)}
              >
                <Text style={styles.detailsButtonText}>See Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: "#2E8B57",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  dateButton: {
    backgroundColor: "white",
    padding: 15,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
    elevation: 2,
  },
  toggleButton: {
    backgroundColor: "#1E90FF",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  map: {
    flex: 1,
  },
  pharmacyList: {
    flex: 1,
  },
  pharmacyCard: {
    flexDirection: "row",
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
    elevation: 2,
    padding: 10,
  },
  pharmacyImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  pharmacyInfo: {
    flex: 1,
    marginLeft: 10,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  pharmacyAddress: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  dutyStatus: {
    marginTop: 5,
    fontWeight: "bold",
  },
  onDuty: {
    color: "#2E8B57",
  },
  offDuty: {
    color: "#dc3545",
  },
  distance: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  closeButton: {
    padding: 15,
    alignSelf: "flex-end",
  },
  detailsContainer: {
    padding: 20,
  },
  detailsImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 15,
  },
  infoSection: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  miniMap: {
    height: 200,
    marginVertical: 15,
    borderRadius: 10,
  },
});
