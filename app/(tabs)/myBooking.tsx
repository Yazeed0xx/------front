import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Icon } from '@/components/ui/icon';
import { Calendar, Users, MapPin, Clock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

const upcomingBookings = [
  {
    id: 1,
    venueKey: 'roseGardenEstate' as const,
    date: 'Dec 22, 2024',
    time: '6:00 PM',
    guests: 180,
    locationKey: 'countryside' as const,
    serviceKeys: ['catering', 'dj', 'photography'] as const,
    status: 'confirmed' as const,
    total: 4850,
  },
  {
    id: 2,
    venueKey: 'theGrandBallroom' as const,
    date: 'Jan 15, 2025',
    time: '7:00 PM',
    guests: 250,
    locationKey: 'downtown' as const,
    serviceKeys: ['catering', 'decoration'] as const,
    status: 'pending' as const,
    total: 6200,
  },
];

const previousBookings = [
  {
    id: 3,
    venueKey: 'sunsetTerrace' as const,
    date: 'Nov 10, 2024',
    time: '5:00 PM',
    guests: 120,
    locationKey: 'beachside' as const,
    serviceKeys: ['catering', 'dj'] as const,
    status: 'completed' as const,
    total: 3500,
  },
  {
    id: 4,
    venueKey: 'crystalPalace' as const,
    date: 'Oct 5, 2024',
    time: '6:30 PM',
    guests: 200,
    locationKey: 'cityCenter' as const,
    serviceKeys: ['fullPackage'] as const,
    status: 'completed' as const,
    total: 5800,
  },
];

type VenueKey = 'roseGardenEstate' | 'theGrandBallroom' | 'sunsetTerrace' | 'crystalPalace';
type LocationKey = 'countryside' | 'downtown' | 'beachside' | 'cityCenter';
type ServiceKey = 'catering' | 'dj' | 'photography' | 'decoration' | 'fullPackage';
type StatusKey = 'confirmed' | 'pending' | 'completed';

type Booking = {
  id: number;
  venueKey: VenueKey;
  date: string;
  time: string;
  guests: number;
  locationKey: LocationKey;
  serviceKeys: readonly ServiceKey[];
  status: StatusKey;
  total: number;
};

function BookingCard({ booking, isUpcoming }: { booking: Booking; isUpcoming: boolean }) {
  const { t } = useTranslation();
  
  const statusColors = {
    confirmed: 'bg-green-500/10 text-green-600',
    pending: 'bg-yellow-500/10 text-yellow-600',
    completed: 'bg-muted text-muted-foreground',
  };

  return (
    <Card className="mb-3 border border-border/60">
      <CardContent className="py-4">
        {/* Header */}
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1">
            <Text className="font-semibold text-base text-foreground">{t(booking.venueKey)}</Text>
            <View className="flex-row items-center gap-1 mt-1">
              <Icon as={MapPin} size={12} className="text-muted-foreground" />
              <Text className="text-xs text-muted-foreground">{t(booking.locationKey)}</Text>
            </View>
          </View>
          <Badge variant="outline" className={statusColors[booking.status]}>
            <Text className="text-xs capitalize">{t(booking.status)}</Text>
          </Badge>
        </View>

        {/* Details Grid */}
        <View className="flex-row gap-4 mb-3">
          <View className="flex-row items-center gap-2">
            <Icon as={Calendar} size={14} className="text-primary" />
            <Text className="text-sm text-foreground">{booking.date}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Icon as={Clock} size={14} className="text-primary" />
            <Text className="text-sm text-foreground">{booking.time}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Icon as={Users} size={14} className="text-primary" />
            <Text className="text-sm text-foreground">{booking.guests}</Text>
          </View>
        </View>

        {/* Services */}
        <View className="flex-row flex-wrap gap-1.5 mb-3">
          {booking.serviceKeys.map((serviceKey) => (
            <Badge key={serviceKey} variant="secondary" className="px-2 py-0.5">
              <Text className="text-[11px]">{t(serviceKey)}</Text>
            </Badge>
          ))}
        </View>

        {/* Footer */}
        <View className="flex-row items-center justify-between pt-2 border-t border-border/40">
          <View>
            <Text className="text-xs text-muted-foreground">{t('total')}</Text>
            <Text className="font-bold text-primary text-lg">{booking.total.toLocaleString()} sr</Text>
          </View>
          {isUpcoming ? (
            <View className="flex-row gap-2">
              <Button variant="outline" size="sm">
                <Text className="text-foreground text-sm">{t('modify')}</Text>
              </Button>
              <Button size="sm">
                <Text className="text-primary-foreground text-sm">{t('viewDetails')}</Text>
              </Button>
            </View>
          ) : (
            <Button variant="outline" size="sm">
              <Text className="text-foreground text-sm">{t('bookAgain')}</Text>
            </Button>
          )}
        </View>
      </CardContent>
    </Card>
  );
}

function EmptyState({ type }: { type: 'upcoming' | 'previous' }) {
  const { t } = useTranslation();
  return (
    <View className="items-center justify-center py-12">
      <Text className="text-4xl mb-3">📅</Text>
      <Text className="text-muted-foreground text-center">
        {type === 'upcoming' ? t('noUpcomingBookings') : t('noPreviousBookings')}
      </Text>
      {type === 'upcoming' && (
        <Button className="mt-4">
          <Text className="text-primary-foreground">{t('browseHalls')}</Text>
        </Button>
      )}
    </View>
  );
}

export default function MyBookingScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <Text className="text-2xl font-bold text-foreground">{t('myBookings')}</Text>
      </View>

      {/* Tabs */}
      <View className="px-5">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="upcoming" className="flex-1">
              <Text>{t('upcoming')}</Text>
            </TabsTrigger>
            <TabsTrigger value="previous" className="flex-1">
              <Text>{t('previous')}</Text>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <ScrollView className="pt-4" showsVerticalScrollIndicator={false}>
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} isUpcoming={true} />
                ))
              ) : (
                <EmptyState type="upcoming" />
              )}
              <View className="h-20" />
            </ScrollView>
          </TabsContent>

          <TabsContent value="previous">
            <ScrollView className="pt-4" showsVerticalScrollIndicator={false}>
              {previousBookings.length > 0 ? (
                previousBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} isUpcoming={false} />
                ))
              ) : (
                <EmptyState type="previous" />
              )}
              <View className="h-20" />
            </ScrollView>
          </TabsContent>
        </Tabs>
      </View>
    </SafeAreaView>
  );
}
