import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next';
export default function _layout() {
  const {t} = useTranslation();
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: t('home'), tabBarIcon: ({ color, size }) => (
        <Ionicons name="home" color={color} size={size} />
      ) }} />
     
      <Tabs.Screen name="halls" options={{ title: t('halls'), tabBarIcon: ({ color, size }) => (
        <Ionicons name="list" color={color} size={size} />
      ) }} />
      <Tabs.Screen name="myBooking" options={{ title: t('myBooking'), tabBarIcon: ({ color, size }) => (
        <Ionicons name="book" color={color} size={size} />
      ) }} />
      <Tabs.Screen name="profile" options={{ title: t('profile'), tabBarIcon: ({ color, size }) => (
        <Ionicons name="person" color={color} size={size} />
      ) }} />
    </Tabs>
  )
}