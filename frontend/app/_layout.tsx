import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "@/i18n";

import { useColorScheme } from "@/hooks/use-color-scheme";
import AuthProvider from "@/shared/context/AuthProvider";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(home)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(chat)" />
          <Stack.Screen name="(health)" />
          <Stack.Screen name="(help)" />
          <Stack.Screen name="(notifications)" />
          <Stack.Screen name="(profile)" />
          <Stack.Screen name="(reminder)" />
          <Stack.Screen name="(settings)" />
        </Stack>

        <StatusBar style="auto" />
        <Toast />
      </ThemeProvider>
    </AuthProvider>
  );
}