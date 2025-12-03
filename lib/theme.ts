import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

/**
 * Wedding Hall Booking App - Lavender Theme
 * 
 * A dreamy, romantic lavender palette:
 * 
 * Light Theme:
 * - Background: Soft lavender-tinted white
 * - Primary: Beautiful lavender (#8B6DB5)
 * - Accent: Wisteria purple (#B382D4)
 * - Secondary: Light lavender tint
 * 
 * Dark Theme:
 * - Background: Deep purple-black
 * - Primary: Bright lavender (#A98FD4)
 * - Accent: Bright wisteria (#C49AE0)
 * - Secondary: Dark purple surfaces
 */

export const THEME = {
  light: {
    // Base
    background: 'hsl(270 30% 99%)',
    foreground: 'hsl(270 20% 15%)',
    
    // Card
    card: 'hsl(270 40% 99%)',
    cardForeground: 'hsl(270 20% 15%)',
    
    // Popover
    popover: 'hsl(270 40% 99%)',
    popoverForeground: 'hsl(270 20% 15%)',
    
    // Primary - Beautiful Lavender
    primary: 'hsl(262 60% 58%)',
    primaryForeground: 'hsl(0 0% 100%)',
    
    // Secondary - Light Lavender Tint
    secondary: 'hsl(270 35% 95%)',
    secondaryForeground: 'hsl(262 40% 30%)',
    
    // Muted
    muted: 'hsl(270 20% 94%)',
    mutedForeground: 'hsl(270 10% 45%)',
    
    // Accent - Wisteria Purple
    accent: 'hsl(280 65% 65%)',
    accentForeground: 'hsl(0 0% 100%)',
    
    // Destructive
    destructive: 'hsl(0 84% 60%)',
    
    // Borders & Input
    border: 'hsl(270 25% 90%)',
    input: 'hsl(270 25% 90%)',
    ring: 'hsl(262 60% 58%)',
    radius: '0.75rem',
    
    // Charts
    chart1: 'hsl(262 60% 58%)',
    chart2: 'hsl(280 65% 65%)',
    chart3: 'hsl(320 55% 65%)',
    chart4: 'hsl(220 60% 65%)',
    chart5: 'hsl(45 70% 60%)',
  },
  dark: {
    // Base
    background: 'hsl(270 25% 6%)',
    foreground: 'hsl(270 20% 96%)',
    
    // Card
    card: 'hsl(270 20% 10%)',
    cardForeground: 'hsl(270 20% 96%)',
    
    // Popover
    popover: 'hsl(270 20% 10%)',
    popoverForeground: 'hsl(270 20% 96%)',
    
    // Primary - Bright Lavender
    primary: 'hsl(262 55% 68%)',
    primaryForeground: 'hsl(270 25% 6%)',
    
    // Secondary
    secondary: 'hsl(270 20% 16%)',
    secondaryForeground: 'hsl(270 20% 90%)',
    
    // Muted
    muted: 'hsl(270 15% 14%)',
    mutedForeground: 'hsl(270 15% 55%)',
    
    // Accent - Bright Wisteria
    accent: 'hsl(280 60% 70%)',
    accentForeground: 'hsl(270 25% 6%)',
    
    // Destructive
    destructive: 'hsl(0 72% 55%)',
    
    // Borders & Input
    border: 'hsl(270 15% 20%)',
    input: 'hsl(270 15% 20%)',
    ring: 'hsl(262 55% 68%)',
    radius: '0.75rem',
    
    // Charts
    chart1: 'hsl(262 55% 65%)',
    chart2: 'hsl(280 60% 68%)',
    chart3: 'hsl(320 50% 62%)',
    chart4: 'hsl(220 55% 62%)',
    chart5: 'hsl(45 65% 55%)',
  },
};

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
