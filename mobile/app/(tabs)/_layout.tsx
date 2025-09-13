import { Tabs, usePathname } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useAuth } from "@/hooks/useAuth";
import CustomTabBar from "@/components/ui/CustomTabBar";

export default function TabLayout() {
  const { isAuth, loading } = useAuth();
  const pathname = usePathname();

  if (loading) return null;

  const showTabBar = !["/login", "/signup",].includes(pathname);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
      }}
      tabBar={showTabBar ? (props) => <CustomTabBar {...props} /> : undefined}
    >
      <Tabs.Protected guard={isAuth}>
        <Tabs.Screen name="home" options={{ href: null }} />
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="records" options={{ href: null }} />
      </Tabs.Protected>

      <Tabs.Screen name="login" options={{ tabBarStyle: { display: "none" }, href: null }} />
      <Tabs.Screen name="signup" options={{ tabBarStyle: { display: "none" }, href: null }} />
    </Tabs>
  );
}
