import { useAuth } from "@/hooks/useAuth";
import { theme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TabItem {
  name?: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  isLogout?: boolean;
}

const tabs: TabItem[] = [
  { name: "home", label: "Minhas plantas", icon: "eco" },
  { name: "records", label: "Registros", icon: "history" },
  { label: "Sair", icon: "logout", isLogout: true },
];

export default function CustomTabBar({ state }: BottomTabBarProps) {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const isFocused =
            tab.name === "home"
              ? state.routes[state.index].name === "home" ||
                state.routes[state.index].name === "index"
              : state.routes[state.index].name === tab.name;

          const onPress = () => {
            if (tab.isLogout) {
              logout();
              return;
            }
            if (!tab.name) return;

            if (tab.name === "home") {
              router.replace("/home");
            }
            if (tab.name === "records") {
              router.replace("/records");
            }
          };

          return (
            <TouchableOpacity
              key={tab.label}
              onPress={onPress}
              style={styles.tabButton}
            >
              <MaterialIcons
                name={tab.icon}
                size={24}
                color={
                  isFocused
                    ? theme.lightColors?.primary
                    : theme.lightColors?.grey3
                }
              />
              <Text
                style={[
                  styles.label,
                  {
                    color: isFocused
                      ? theme.lightColors?.primary
                      : theme.lightColors?.grey3,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  container: {
    flexDirection: "row",
    height: 70,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
