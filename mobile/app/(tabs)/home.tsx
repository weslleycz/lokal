import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { logout } = useAuth();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ff1a1aff" }}>
      <Button title="Logout" onPress={()=>logout()} />
    </SafeAreaView>
  );
}
