import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
export default function _layout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => (
        <Ionicons name="home" color={color} size={size} />
      ) }} />
     
      <Tabs.Screen name="halls" options={{ title: 'Halls', tabBarIcon: ({ color, size }) => (
        <Ionicons name="list" color={color} size={size} />
      ) }} />
      <Tabs.Screen name="myBooking" options={{ title: 'My Booking', tabBarIcon: ({ color, size }) => (
        <Ionicons name="book" color={color} size={size} />
      ) }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => (
        <Ionicons name="person" color={color} size={size} />
      ) }} />
    </Tabs>
  )
}