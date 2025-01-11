import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (username && email && password) {
      Alert.alert("Registration successful!");
      navigation.replace("Home");
    } else {
      Alert.alert("Please fill in all fields.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      <View style={styles.card}>
        {/* Username Input */}
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#aaa"
        />

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

        {/* Register Button */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        {/* Go to Login Button */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Login</Text>
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
    backgroundColor: "#f1f1f1", // Soft background color
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
  registerButton: {
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: "#555",
  },
  loginLink: {
    fontSize: 16,
    color: "#2E8B57",
    fontWeight: "600",
  },
});
