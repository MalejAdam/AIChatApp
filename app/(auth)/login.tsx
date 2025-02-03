import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { Href, useRouter } from "expo-router";
import { useAuth } from "@/src/contexts/AuthContext";
import { colors, styles as root_styles } from "@/src/styles";
import { urls } from "@/src/consts";

export default function Login() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const success = await login(email, password);
      if (success) {
        router.replace(urls.chat as Href);
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <View style={[styles.container, root_styles.container]}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={root_styles.input}
        outlineColor={colors.primary}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={root_styles.input}
        outlineColor={colors.primary}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button mode="contained" onPress={handleLogin} style={root_styles.button}>
        Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: "center",
  },
  error: {
    color: colors.error.text,
    marginBottom: 12,
  },
});
