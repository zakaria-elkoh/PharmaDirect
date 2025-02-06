import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
  Linking,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function MapScreen({ route, navigation }) {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const pharmacy = route.params?.pharmacy;

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation && pharmacy) {
      fitMapToMarkers();
    }
  }, [userLocation, pharmacy]);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission refusée", "Accès à la localisation nécessaire");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error("Erreur de localisation:", error);
      Alert.alert("Erreur", "Impossible d'obtenir votre position");
    }
  };

  const fitMapToMarkers = () => {
    if (!mapRef.current || !userLocation || !pharmacy) return;

    const pharmacyCoordinates = pharmacy.location?.coordinates;
    if (!pharmacyCoordinates || pharmacyCoordinates.length !== 2) return;

    // MongoDB stocke les coordonnées au format [longitude, latitude]
    const pharmacyLat = pharmacyCoordinates[1];
    const pharmacyLng = pharmacyCoordinates[0];

    mapRef.current.fitToCoordinates(
      [
        userLocation,
        {
          latitude: pharmacyLat,
          longitude: pharmacyLng,
        },
      ],
      {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      }
    );
  };

  const openDirections = () => {
    if (!userLocation || !pharmacy) {
      Alert.alert("Erreur", "Impossible d'obtenir l'itinéraire");
      return;
    }

    // Les coordonnées sont dans pharmacy.location.coordinates [longitude, latitude]
    const coordinates = pharmacy.location?.coordinates;

    if (!coordinates || coordinates.length !== 2) {
      Alert.alert("Erreur", "Coordonnées de la pharmacie invalides");
      return;
    }

    // MongoDB stocke les coordonnées au format [longitude, latitude]
    const pharmacyLng = coordinates[0];
    const pharmacyLat = coordinates[1];

    if (isNaN(pharmacyLat) || isNaN(pharmacyLng)) {
      Alert.alert("Erreur", "Coordonnées de la pharmacie invalides");
      return;
    }

    // Utiliser OpenStreetMap pour la navigation avec les coordonnées parsées
    const url = `https://www.openstreetmap.org/directions?from=${userLocation.latitude},${userLocation.longitude}&to=${pharmacyLat},${pharmacyLng}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback vers une URL qui fonctionne sur la plupart des appareils
        const fallbackUrl = Platform.select({
          ios: `maps://?saddr=${userLocation.latitude},${userLocation.longitude}&daddr=${pharmacyLat},${pharmacyLng}`,
          android: `geo:${pharmacyLat},${pharmacyLng}?q=${pharmacyLat},${pharmacyLng}(${encodeURIComponent(
            pharmacy.name
          )})`,
        });
        Linking.openURL(fallbackUrl).catch(() => {
          Alert.alert(
            "Erreur",
            "Impossible d'ouvrir l'application de navigation"
          );
        });
      }
    });
  };

  if (!pharmacy) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Aucune pharmacie sélectionnée</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: pharmacy.location?.coordinates[1] || 0,
          longitude: pharmacy.location?.coordinates[0] || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Votre position"
            pinColor="blue"
          />
        )}
        <Marker
          coordinate={{
            latitude: pharmacy.location?.coordinates[1] || 0,
            longitude: pharmacy.location?.coordinates[0] || 0,
          }}
          title={pharmacy.name}
          description={pharmacy.detailedAddress}
          pinColor="#22C55E"
        />
      </MapView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.bottomCard}>
        <View style={styles.pharmacyInfo}>
          <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
          <Text style={styles.pharmacyAddress}>{pharmacy.detailedAddress}</Text>
        </View>
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={openDirections}
        >
          <MaterialIcons name="directions" size={24} color="#fff" />
          <Text style={styles.directionsText}>Itinéraire</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomCard: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pharmacyInfo: {
    flex: 1,
    marginRight: 16,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  pharmacyAddress: {
    fontSize: 14,
    color: "#666",
  },
  directionsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22C55E",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  directionsText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});
