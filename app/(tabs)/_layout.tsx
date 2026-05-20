import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Tabs, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth-context';
import { useTranslation } from 'react-i18next';

export default function TabsLayout() {
  const { company, isLoading, isAuthenticated } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (company?.status === 'pending') {
        router.replace('/status/pending');
      } else if (company?.status === 'rejected') {
        router.replace('/status/rejected');
      } else if (company?.status === 'suspended') {
        router.replace('/status/suspended');
      }
      // 'approved' companies proceed to render tabs
    }
  }, [isLoading, isAuthenticated, company?.status]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Don't render tabs if not authenticated or not approved
  if (!isAuthenticated || company?.status !== 'approved') {
    return null;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('dashboard'),
          tabBarIcon: ({ color, size }) => <Ionicons name="grid" color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="halls"
        options={{
          title: t('myHalls'),
          tabBarIcon: ({ color, size }) => <Ionicons name="business" color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="myBooking"
        options={{
          title: t('bookings'),
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile'),
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
