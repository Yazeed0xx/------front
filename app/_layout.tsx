import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { ThemeProvider, useTheme } from '@/lib/theme-context';
import { AuthProvider } from '@/lib/auth-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '@/lib/i18n';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

function RootLayoutContent() {
  const { theme } = useTheme();

  return (
    <NavigationThemeProvider value={NAV_THEME[theme]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="login"
          options={{
            presentation: 'card',
            animation: 'fade_from_bottom',
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            presentation: 'card',
            animation: 'fade_from_bottom',
          }}
        />
        <Stack.Screen
          name="status/pending"
          options={{
            presentation: 'card',
            animation: 'fade_from_bottom',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="status/rejected"
          options={{
            presentation: 'card',
            animation: 'fade_from_bottom',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="status/suspended"
          options={{
            presentation: 'card',
            animation: 'fade_from_bottom',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="halls/[id]"
          options={{
            presentation: 'card',
            animation: 'fade_from_bottom',
          }}
        />
        <Stack.Screen
          name="halls/add"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
      <PortalHost />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <RootLayoutContent />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
