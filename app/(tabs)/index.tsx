import React from 'react';
import { useColorScheme } from 'nativewind';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

type CompanyHall = {
  id: number;
  name: string;
  location: string;
  capacity: number;
  price: number;
  status: 'active' | 'pending' | 'draft';
  bookings: number;
  rating?: number;
  featured?: boolean;
};

const companyHalls: CompanyHall[] = [
  { id: 1, name: 'Grand Ballroom', location: 'Downtown', capacity: 320, price: 5200, status: 'active', bookings: 24, rating: 4.8, featured: true },
  { id: 2, name: 'Rose Garden Estate', location: 'Countryside', capacity: 180, price: 3600, status: 'active', bookings: 11, rating: 4.7 },
  { id: 3, name: 'Skyline Lounge', location: 'City Center', capacity: 140, price: 4100, status: 'pending', bookings: 3 },
  { id: 4, name: 'Meadow Hall', location: 'Suburbs', capacity: 110, price: 2600, status: 'draft', bookings: 0 },
];

const statusColors: Record<CompanyHall['status'], string> = {
  active: 'bg-green-500/10 text-green-700',
  pending: 'bg-amber-500/10 text-amber-700',
  draft: 'bg-muted text-muted-foreground',
};

export default function CompanyHallsScreen() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

  const summary = React.useMemo(() => {
    const total = companyHalls.length;
    const active = companyHalls.filter((h) => h.status === 'active').length;
    const pending = companyHalls.filter((h) => h.status === 'pending').length;
    const draft = companyHalls.filter((h) => h.status === 'draft').length;
    return { total, active, pending, draft };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-2xl font-semibold text-foreground">Company Halls</Text>
              <Text className="text-muted-foreground text-sm">Manage and publish your venues</Text>
            </View>
            <Button className="rounded-full" onPress={() => router.push('/addHall')}>
              <Text className="text-primary-foreground font-medium">Add hall</Text>
            </Button>
          </View>

          <Card className="border border-border/60 rounded-2xl mb-4">
            <CardContent className="py-4">
              <View className="flex-row justify-between mb-2">
                <View>
                  <Text className="text-muted-foreground text-xs">Total halls</Text>
                  <Text className="text-xl font-semibold text-foreground">{summary.total}</Text>
                </View>
                <View>
                  <Text className="text-muted-foreground text-xs">Active</Text>
                  <Text className="text-xl font-semibold text-foreground">{summary.active}</Text>
                </View>
                <View>
                  <Text className="text-muted-foreground text-xs">Pending</Text>
                  <Text className="text-xl font-semibold text-foreground">{summary.pending}</Text>
                </View>
                <View>
                  <Text className="text-muted-foreground text-xs">Draft</Text>
                  <Text className="text-xl font-semibold text-foreground">{summary.draft}</Text>
                </View>
              </View>
            </CardContent>
          </Card>

          <View className="gap-3">
            {companyHalls.map((hall) => (
              <Card key={hall.id} className="rounded-xl border border-border/70">
                <CardContent className="py-4">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 pr-3">
                      <View className="flex-row items-center gap-2 mb-1">
                        <Text className="text-base font-semibold">{hall.name}</Text>
                        {hall.featured && (
                          <Badge variant="secondary" className="px-2 py-0.5">
                            <Text className="text-[11px]">Featured</Text>
                          </Badge>
                        )}
                      </View>
                      <Text className="text-muted-foreground text-sm">
                        {hall.location} · {hall.capacity} guests
                      </Text>
                    </View>
                    <Badge variant="outline" className={statusColors[hall.status]}>
                      <Text className="text-[11px] capitalize">{hall.status}</Text>
                    </Badge>
                  </View>

                  <View className="flex-row justify-between items-center mb-3">
                    <View className="flex-row items-baseline gap-2">
                      <Text className="text-primary font-bold text-xl">{hall.price.toLocaleString()} sr</Text>
                      {hall.rating ? (
                        <Text className="text-muted-foreground text-sm">⭐ {hall.rating.toFixed(1)}</Text>
                      ) : (
                        <Text className="text-muted-foreground text-sm">No rating yet</Text>
                      )}
                    </View>
                    <Badge variant="secondary" className="py-0.5">
                      <Text className="text-xs">{hall.bookings} bookings</Text>
                    </Badge>
                  </View>

                  <View className="flex-row gap-2">
                    <Button variant="outline" className="flex-1 rounded-full" onPress={() => router.push(`/halls/${hall.id}`)}>
                      <Text className="text-foreground font-medium">View</Text>
                    </Button>
                    <Button className="flex-1 rounded-full" onPress={() => router.push(`/halls/${hall.id}/edit`)}>
                      <Text className="text-primary-foreground font-medium">Edit</Text>
                    </Button>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
