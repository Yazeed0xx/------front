import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Tabs, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authClient } from '@/lib/auth';
import { useTranslation } from 'react-i18next';

export default function _layout() {
  const { data: session, isPending } = authClient.useSession();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace('/register');
    }
  }, [isPending, session]);

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="halls"
        options={{
          title: t('halls'),
          tabBarIcon: ({ color, size }) => <Ionicons name="list" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="myBooking"
        options={{
          title: t('myBooking'),
          tabBarIcon: ({ color, size }) => <Ionicons name="book" color={color} size={size} />,
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