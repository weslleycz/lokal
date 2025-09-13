import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useAuth } from "@/hooks/useAuth";

export default function TabLayout() {
  const { iseAuth,loading } = useAuth();
  if (loading) return null;

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: { display: "none" },
        }}
      >
        <Tabs.Protected guard={iseAuth}>
          <Tabs.Screen
            name="home"
            options={{
              title: "Home",
            }}
          />
        </Tabs.Protected>

        <Tabs.Screen name="login" />
        <Tabs.Screen name="signup" />
      </Tabs>
    </>
  );
}
