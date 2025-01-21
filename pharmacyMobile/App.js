import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/Login";
import RegisterScreen from "./src/screens/Register";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import { FavoritesProvider } from "./src/contexte/FavoritesContext";

const Stack = createStackNavigator();

function CustomHeader({ navigation, isLoggedIn, onLogout }) {
  return (
    <View style={styles.header}>
      <TouchableWithoutFeedback onPress={() => navigation.navigate("Home")}>
        <View style={styles.logoContainer}>
          <Ionicons
            name="medkit"
            size={30}
            color="#2E8B57"
            style={styles.logo}
          />
          <Text style={styles.headerText}>Future Pharmacy</Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.iconsContainer}>
        {!isLoggedIn ? (
          <>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate("Login")}
            >
              <Ionicons
                name="log-in"
                size={24}
                color="black"
                style={styles.icon}
              />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate("Register")}
            >
              <Ionicons
                name="person-add"
                size={24}
                color="black"
                style={styles.icon}
              />
            </TouchableWithoutFeedback>
          </>
        ) : (
          <>
          <TouchableWithoutFeedback onPress={() => navigation.navigate("Favorites")}>
            <Ionicons
              name="heart"
              size={24}
              color="red"
              style={styles.icon}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              onLogout();
              Alert.alert("Logged out successfully!");
            }}
          >
            <Ionicons
              name="log-out"
              size={24}
              color="black"
              style={styles.icon}
            />
          </TouchableWithoutFeedback>
          </>
        )}
      </View>
    </View>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      console.log(token);

      setIsLoggedIn(!!token);
    };

    checkToken();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    setIsLoggedIn(false);
  };

  return (
    <FavoritesProvider>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          header: ({ navigation }) => (
            <CustomHeader
              navigation={navigation}
              isLoggedIn={isLoggedIn}
              onLogout={handleLogout}
            />
          ),
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </FavoritesProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    marginTop: 40,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E8B57",
  },
  iconsContainer: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 20,
  },
});
