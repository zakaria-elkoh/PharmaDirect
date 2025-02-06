import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const PharmacyCard = ({ pharmacy }) => {
  // Fonction pour formater l'adresse
  const formatAddress = (address) => {
    if (typeof address === "string") return address;

    if (typeof address === "object") {
      const { street, city, postalCode, country } = address;
      return `${street || ""}, ${postalCode || ""} ${city || ""} ${
        country || ""
      }`.trim();
    }

    return "Adresse non disponible";
  };

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{pharmacy.name}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: pharmacy.isOnGard ? "#e7f7ef" : "#fef2f2" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: pharmacy.isOnGard ? "#166534" : "#991b1b" },
              ]}
            >
              {pharmacy.isOnGard ? "De Garde" : "Fermée"}
            </Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={16} color="#666" />
            <Text style={styles.infoText}>
              {formatAddress(pharmacy.address)}
            </Text>
          </View>

          {pharmacy.phone && (
            <View style={styles.infoRow}>
              <MaterialIcons name="phone" size={16} color="#666" />
              <Text style={styles.infoText}>{pharmacy.phone}</Text>
            </View>
          )}

          {pharmacy.distance && (
            <View style={styles.infoRow}>
              <MaterialIcons name="directions" size={16} color="#666" />
              <Text style={styles.infoText}>
                {(pharmacy.distance / 1000).toFixed(1)} km
              </Text>
            </View>
          )}

          {pharmacy.openingHours && pharmacy.openingHours.length > 0 && (
            <View style={styles.infoRow}>
              <MaterialIcons name="access-time" size={16} color="#666" />
              <Text style={styles.infoText}>
                {pharmacy.openingHours[0].open} -{" "}
                {pharmacy.openingHours[0].close}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  infoContainer: {
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
});

export default PharmacyCard;
