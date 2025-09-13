import { useRouter } from "expo-router";
import React from "react";
import { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const handleLogin = () => {
    router.replace("/login");
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ff1a1aff" }}>
      <Button title="Login" onPress={handleLogin} />
    </SafeAreaView>
  );
}
