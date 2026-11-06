import "@/global.css";
import "react-native-reanimated";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AppState } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { ThemeProvider } from "@/lib/theme-provider";
import { useAppStore } from "@/lib/store";

export default function RootLayout() {
  useEffect(() => {
    const sync = () => useAppStore.getState().syncDay();
    const listener = AppState.addEventListener("change", estado => { if (estado === "active") sync(); });
    const timer = setInterval(sync, 30000);
    return () => { listener.remove(); clearInterval(timer); };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="light" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
