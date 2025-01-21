import React, { useContext } from "react";
import { View, Image, Text, StyleSheet, FlatList } from "react-native";
import { FavoritesContext } from "../contexte/FavoritesContext";

export default function FavoritesScreen() {
  const { favorites } = useContext(FavoritesContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pharmacies Favorites</Text>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Image
                source={{ uri: item.imageMobile }}
                style={styles.image}
              />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.address}>{item.address}</Text>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.message}>Vous n'avez pas encore de favoris.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  address: {
    fontSize: 14,
    color: "#555",
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});
