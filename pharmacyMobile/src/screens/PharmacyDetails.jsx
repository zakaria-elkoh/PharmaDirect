import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const PharmacyDetails = ({ route, navigation }) => {
  const pharmacy = route.params?.pharmacy;
  // console.log("Received pharmacy data:", pharmacy);

  const callPharmacy = () => {
    if (!pharmacy?.phone) return;
    Linking.openURL(`tel:${pharmacy.phone}`);
  };

  const goBack = () => {
    navigation.goBack();
  };

  // Vérification des données
  if (!pharmacy || !pharmacy.name) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Impossible de charger les détails de la pharmacie
        </Text>
        <TouchableOpacity 
          style={[styles.backButton, styles.errorBackButton]} 
          onPress={goBack}
        >
          <MaterialIcons name="arrow-back" size={24} color="#0066CC" />
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <MaterialIcons name="arrow-back" size={24} color="#0066CC" />
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <View style={[styles.image, styles.placeholderImage]}>
            <MaterialIcons name="local-pharmacy" size={80} color="#ccc" />
          </View>
          <View style={styles.statusBadgeContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: pharmacy.isOnGard ? "#22C55E" : "#EF4444" },
              ]}
            >
              <Text style={styles.statusText}>
                {pharmacy.isOnGard ? "De Garde" : "Fermée"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{pharmacy.name}</Text>

          <View style={styles.infoSection}>
            {pharmacy.detailedAddress && (
              <View style={styles.infoRow}>
                <MaterialIcons name="location-on" size={24} color="#0066CC" />
                <Text style={styles.infoText}>{pharmacy.detailedAddress}</Text>
              </View>
            )}

            {pharmacy.phone && (
              <TouchableOpacity style={styles.infoRow} onPress={callPharmacy}>
                <MaterialIcons name="phone" size={24} color="#0066CC" />
                <Text style={styles.infoText}>{pharmacy.phone}</Text>
              </TouchableOpacity>
            )}

            {pharmacy.email && (
              <View style={styles.infoRow}>
                <MaterialIcons name="email" size={24} color="#0066CC" />
                <Text style={styles.infoText}>{pharmacy.email}</Text>
              </View>
            )}
          </View>

          {pharmacy.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>À propos</Text>
              <Text style={styles.descriptionText}>{pharmacy.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.mapButton]}
          onPress={() => navigation.navigate("Map", { pharmacy: pharmacy })}
        >
          <MaterialIcons name="map" size={24} color="white" />
          <Text style={styles.actionButtonText}>Voir sur la carte</Text>
        </TouchableOpacity>

        {pharmacy.phone && (
          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={callPharmacy}
          >
            <MaterialIcons name="phone" size={24} color="white" />
            <Text style={styles.actionButtonText}>Appeler</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 100,
    paddingTop: 100,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    marginTop: 30,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#0066CC",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 250,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadgeContainer: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#4B5563",
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  descriptionContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  descriptionText: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 24,
  },
  bottomButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  mapButton: {
    backgroundColor: "#22C55E",
  },
  callButton: {
    backgroundColor: "#0066CC",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default PharmacyDetails;
