import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";


// const pharmacies = [
//   {
//     id: 1,
//     name: "Pharmacy 1",
//     email: "pharmacy1@example.com",
//     phone: "+123456789",
//     image: "https://via.placeholder.com/150",
//     isOnDuty: true,
//     location: "123 Main St, City, Country",
//     rating: 4.5,
//   },
//   {
//     id: 2,
//     name: "Pharmacy 2",
//     email: "pharmacy2@example.com",
//     phone: "+987654321",
//     image: "https://via.placeholder.com/150",
//     isOnDuty: false,
//     location: "456 Park Ave, City, Country",
//     rating: 3.0,
//   },
//   {
//     id: 3,
//     name: "Pharmacy 3",
//     email: "pharmacy3@example.com",
//     phone: "+123987654",
//     image: "https://via.placeholder.com/150",
//     isOnDuty: true,
//     location: "789 Maple Rd, City, Country",
//     rating: 4.8,
//   },
//   {
//     id: 4,
//     name: "Pharmacy 4",
//     email: "pharmacy4@example.com",
//     phone: "+456123987",
//     image: "https://via.placeholder.com/150",
//     isOnDuty: false,
//     location: "321 Oak Ln, City, Country",
//     rating: 3.5,
//   },
//   {
//     id: 5,
//     name: "Pharmacy 5",
//     email: "pharmacy5@example.com",
//     phone: "+654987123",
//     image: "https://via.placeholder.com/150",
//     isOnDuty: true,
//     location: "654 Pine Blvd, City, Country",
//     rating: 5.0,
//   },
// ];

export default function HomeScreen({ navigation }) {
  const [pharmacies, setPharmacies] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const response = await fetch("http://10.0.2.2:3000/pharmacies");
        if (!response.ok) {
          throw new Error("Failed to fetch pharmacies");
        }
        const data = await response.json();
        setPharmacies(data.data); 
      } catch (error) {
        console.error("Error fetching pharmacies:", error);
      }
    };

    fetchPharmacies(); 
  }, []); 

  const toggleFavorite = async (pharmacyId) => {
    const token = await AsyncStorage.getItem("userToken");
  
    
    console.log("Token:", token);
    console.log("Pharmacy ID:", pharmacyId);
    const isFav = favorites.includes(pharmacyId);
    const url = `http://10.0.2.2:3000/favorites/${
      isFav ? "removefavorit" : "addfavort"
    }/${pharmacyId}`;
    
  
    try {
      const response = await fetch(url, {
        method: isFav ? "DELETE" : "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const responseText = await response.text();
      console.log("API Response:", responseText);
  
      if (!response.ok) {
        throw new Error(`Failed to update favorites: ${response.status}`);
      }
  
      setFavorites((prevFavorites) =>
        isFav
          ? prevFavorites.filter((id) => id !== pharmacyId)
          : [...prevFavorites, pharmacyId]
      );
  
      console.log("Updated Favorites:", favorites);
    } catch (error) {
      console.error("Error updating favorites:", error.message);
    }
  };
  

  const isFavorite = (pharmacyId) => favorites.includes(pharmacyId);
  const showDetails = (pharmacy) => {
    Alert.alert(
      "Pharmacy Details",
      `Name: ${pharmacy.name}\nEmail: ${pharmacy.email}\nPhone: ${
        pharmacy.phone
      }\nLocation: ${pharmacy.location}\nDuty: ${
        pharmacy.isOnDuty ? "On Duty" : "Not On Duty"
      }`,
      [{ text: "OK" }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Image
          source={require("../asset/hero.webp")}
          style={styles.heroImage}
        />
        <Text style={styles.heroTitle}>
          Welcome to the Pharmacy Duty Tracker
        </Text>
        <Text style={styles.heroDescription}>
          Discover which pharmacy is on duty and ready to assist you anytime,
          day or night.
        </Text>
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Explore Pharmacies</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity style={styles.ctaButton}>
          <MaterialIcons
            name="local-pharmacy"
            size={24}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={styles.ctaButtonText}>Explore Pharmacies</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate("Search")}
        >
          <MaterialIcons
            name="search"
            size={24}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={styles.searchButtonText}>
            Rechercher une pharmacie de garde
          </Text>
        </TouchableOpacity>
      </View>

      {pharmacies.length > 0 &&
        pharmacies?.map((pharmacy) => (
          <View key={pharmacy._id} style={styles.card}>
            <Image
              source={{ uri: pharmacy.imageMobile }}
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
              <TouchableOpacity onPress={() => toggleFavorite(pharmacy._id)}>
                <FontAwesome
                  name={isFavorite(pharmacy._id) ? "heart" : "heart-o"}
                  size={24}
                  color={isFavorite(pharmacy._id) ? "#e74c3c" : "#555"}
                  style={styles.favoriteIcon}
                />
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
    padding: 20,
    backgroundColor: "#f0f0f0",
    paddingBottom: 40,
    marginBottom: 20,
  },
  heroSection: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: "center",
  },
  heroImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  heroDescription: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
  },
  ctaButton: {
    flex: 1,
    backgroundColor: "#1E90FF",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  ctaButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 20,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  pharmacyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#555",
    marginVertical: 5,
  },
  phone: {
    fontSize: 14,
    color: "#555",
    marginVertical: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    marginVertical: 5,
  },
  dutyStatus: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 5,
  },
  dutyOn: {
    color: "#2E8B57",
  },
  dutyOff: {
    color: "#dc3545",
  },
  location: {
    fontSize: 12,
    color: "#777",
  },
  detailsButton: {
    marginTop: 10,
    backgroundColor: "#2E8B57",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  detailsButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#FF6347",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
  },
  favoriteIcon: {
    marginLeft: 15,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  mapButton: {
    flex: 1,
    backgroundColor: "#2E8B57",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  mapButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  searchButton: {
    flex: 1,
    backgroundColor: "#2E8B57",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
