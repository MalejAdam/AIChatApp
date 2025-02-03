import { Href, Slot, useRouter, useSegments } from "expo-router";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import { AuthProvider, useAuth } from "@/src/contexts/AuthContext";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { ChatProvider } from "@/src/contexts/ChatContext";
import { useEffect } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { UserProvider } from "@/src/contexts/UserContsxt";
import { urls } from "@/src/consts";

const queryClient = new QueryClient();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
  },
};

function AuthCheck() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated and not already in auth group
      router.replace(urls.login as Href);
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to chat if authenticated but still in auth group
      router.replace(urls.chat as Href);
    }
  }, [isAuthenticated, segments]);

  return <Slot />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <StatusBar
          style={"dark"}
          backgroundColor="transparent"
          translucent={true}
        />
        <AuthProvider>
          <UserProvider>
            <ChatProvider>
              <AuthCheck />
            </ChatProvider>
          </UserProvider>
        </AuthProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}
