import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { ThemeProvider, useTheme } from '@/lib/theme-context';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import i18n from '@/lib/i18n';
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
          name="halls/[id]" 
          options={{ 
            presentation: 'card',
            animation: 'fade_from_bottom',
          }} 
        />
      </Stack>
      <PortalHost />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
