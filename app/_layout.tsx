import { width } from "@/constants/GlobalStyles";
import { AIProvider } from "@/context/AIContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import ToastManager from "toastify-react-native";
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    FiraCode:require("../assets/fonts/FiraCode-Regular.ttf")
  });

  if (!loaded) {
    return null;
  }

  return (
    <SQLiteProvider
      databaseName="base.db"
      assetSource={{
        assetId: require("@/assets/db/base.db"),
        forceOverwrite: false,
      }}
    >
      <AIProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen name="auth" /> */}
            <Stack.Screen name="home" />
            <Stack.Screen name="paywall" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="+not-found" options={{ headerShown: true }} />
          </Stack>
          <StatusBar style="auto" />
          <ToastManager
            // useModal={false}
            duration={3500}
            height={50}
            width={width * 0.8}
            style={{ fontSize: 11 }}
            textStyle={{ fontSize: 11 }}
          />
        </ThemeProvider>
      </AIProvider>
    </SQLiteProvider>
  );
}
