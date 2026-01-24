import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const stats = {
  totalRevenue: 428000,
  monthlyRevenue: 52000,
  totalBookings: 312,
  pendingRequests: 14,
  approvalRate: 0.87,
  occupancy: 0.76,
};

const topHalls = [
  { name: 'Grand Ballroom', revenue: 125000, bookings: 92 },
  { name: 'Rose Garden Estate', revenue: 98000, bookings: 74 },
  { name: 'Skyline Lounge', revenue: 81000, bookings: 58 },
];

const recentActivity = [
  { type: 'booking', label: 'New booking approved - Grand Ballroom', time: '5m ago' },
  { type: 'request', label: 'New request - Skyline Lounge', time: '22m ago' },
  { type: 'booking', label: 'Booking completed - Rose Garden Estate', time: '1h ago' },
];

export default function StatsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-3">
          <Text className="text-2xl font-bold text-foreground">Company stats</Text>
          <Text className="text-muted-foreground mt-1 text-sm">Performance overview</Text>
        </View>

        <View className="px-5 gap-3">
          <Card className="border border-border/60 rounded-2xl">
            <CardContent className="py-4">
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-muted-foreground text-xs">Total revenue</Text>
                  <Text className="text-2xl font-semibold text-foreground">{stats.totalRevenue.toLocaleString()} SAR</Text>
                </View>
                <View>
                  <Text className="text-muted-foreground text-xs">This month</Text>
                  <Text className="text-xl font-semibold text-foreground">{stats.monthlyRevenue.toLocaleString()} SAR</Text>
                </View>
              </View>
              <View className="flex-row gap-4 mt-4">
                <Badge variant="secondary" className="px-3 py-1">
                  <Text className="text-xs text-secondary-foreground">{stats.totalBookings} bookings</Text>
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  <Text className="text-xs">{stats.pendingRequests} pending</Text>
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  <Text className="text-xs">{Math.round(stats.approvalRate * 100)}% approval</Text>
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  <Text className="text-xs">{Math.round(stats.occupancy * 100)}% occupancy</Text>
                </Badge>
              </View>
            </CardContent>
          </Card>

          <Card className="border border-border/60 rounded-2xl">
            <CardContent className="py-4">
              <Text className="text-base font-semibold text-foreground mb-3">Top halls by revenue</Text>
              <View className="gap-3">
                {topHalls.map((hall) => (
                  <View key={hall.name} className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-foreground font-medium">{hall.name}</Text>
                      <Text className="text-muted-foreground text-xs">{hall.bookings} bookings</Text>
                    </View>
                    <Text className="text-foreground font-semibold">{hall.revenue.toLocaleString()} SAR</Text>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>

          <Card className="border border-border/60 rounded-2xl">
            <CardContent className="py-4">
              <Text className="text-base font-semibold text-foreground mb-3">Recent activity</Text>
              <View className="gap-3">
                {recentActivity.map((item, idx) => (
                  <View key={idx} className="flex-row items-center justify-between">
                    <View className="flex-1 pr-3">
                      <Text className="text-foreground">{item.label}</Text>
                      <Text className="text-muted-foreground text-xs">{item.time}</Text>
                    </View>
                    <Badge variant={item.type === 'booking' ? 'secondary' : 'outline'} className="px-2 py-0.5">
                      <Text className="text-[11px] capitalize">{item.type}</Text>
                    </Badge>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
