import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Icon library
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/Login";
import RegisterScreen from "./src/screens/Register";

const Stack = createStackNavigator();

function CustomHeader({ navigation, isLoggedIn, onLogout }) {
  return (
    <View style={styles.header}>
      {/* Adding pharmacy-related icon */}
      <TouchableWithoutFeedback onPress={() => navigation.navigate("Home")}>
        <View style={styles.logoContainer}>
          <Ionicons
            name="medkit" // Medkit icon is used here for pharmacy-related visuals
            size={30}
            color="#2E8B57" // Pharmacy green color
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
          <TouchableWithoutFeedback onPress={onLogout}>
            <Ionicons
              name="log-out"
              size={24}
              color="black"
              style={styles.icon}
            />
          </TouchableWithoutFeedback>
        )}
      </View>
    </View>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Here you can add the logout logic, like clearing tokens
  };

  return (
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
        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
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
    color: "#2E8B57", // Pharmacy green color
  },
  iconsContainer: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 20,
  },
});
