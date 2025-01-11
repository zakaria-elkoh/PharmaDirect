import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      Alert.alert("Login successful!");
      navigation.replace("Home");
    } else {
      Alert.alert("Please enter both email and password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Pharmacy</Text>

      <View style={styles.card}>
        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#aaa"
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#aaa"
        />

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Go to Register Button */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f1f1", // Soft background color for a pharmacy feel
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#2E8B57", // Pharmacy-inspired color
    textAlign: "center",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    backgroundColor: "#f7f7f7",
  },
  loginButton: {
    backgroundColor: "#2E8B57", // Pharmacy green
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    fontSize: 16,
    color: "#555",
  },
  registerLink: {
    fontSize: 16,
    color: "#2E8B57", 
    fontWeight: "600",
  },
});
