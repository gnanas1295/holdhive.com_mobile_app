import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { ThemeProvider } from "./contexts/ThemeContext";

// Use a default URL for development if not set
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL || "https://happy-hamster-123.convex.cloud";

const convex = new ConvexReactClient(convexUrl, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ConvexProvider client={convex}>
        <Stack screenOptions={{ headerShown: false }} />
      </ConvexProvider>
    </ThemeProvider>
  );
}