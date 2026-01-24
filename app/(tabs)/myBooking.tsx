import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Calendar, Users, MapPin, Clock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

type Booking = {
  id: number;
  venueKey: string;
  locationKey: string;
  date: string;
  time: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'completed';
  serviceKeys: string[];
  total: number;
};

const statusColors: Record<Booking['status'], string> = {
  confirmed: 'bg-green-500/10 text-green-700',
  pending: 'bg-amber-500/10 text-amber-700',
  completed: 'bg-blue-500/10 text-blue-700',
};

const upcomingBookings: Booking[] = [
  {
    id: 1,
    venueKey: 'theGrandBallroom',
    locationKey: 'downtown',
    date: 'Jan 12, 2025',
    time: '7:00 PM',
    guests: 180,
    status: 'confirmed',
    serviceKeys: ['catering', 'dj'],
    total: 5200,
  },
];

const previousBookings: Booking[] = [
  {
    id: 2,
    venueKey: 'roseGardenEstate',
    locationKey: 'countryside',
    date: 'Dec 20, 2024',
    time: '6:30 PM',
    guests: 140,
    status: 'completed',
    serviceKeys: ['catering', 'photography'],
    total: 3600,
  },
];

function BookingCard({ booking, isUpcoming }: { booking: Booking; isUpcoming: boolean }) {
  const { t } = useTranslation();
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
  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous'>('upcoming');

  const bookings = activeTab === 'upcoming' ? upcomingBookings : previousBookings;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-6">
          <Text className="text-2xl font-bold text-foreground mb-1">{t('myBookings')}</Text>
          
          {/* Tabs */}
          <View className="flex-row gap-2 mb-4">
            <Button
              variant={activeTab === 'upcoming' ? 'default' : 'outline'}
              size="sm"
              className="flex-1 rounded-full"
              onPress={() => setActiveTab('upcoming')}
            >
              <Text className={activeTab === 'upcoming' ? 'text-primary-foreground' : 'text-foreground'}>
                {t('upcoming')}
              </Text>
            </Button>
            <Button
              variant={activeTab === 'previous' ? 'default' : 'outline'}
              size="sm"
              className="flex-1 rounded-full"
              onPress={() => setActiveTab('previous')}
            >
              <Text className={activeTab === 'previous' ? 'text-primary-foreground' : 'text-foreground'}>
                {t('previous')}
              </Text>
            </Button>
          </View>

          {/* Bookings List */}
          {bookings.length === 0 ? (
            <EmptyState type={activeTab} />
          ) : (
            <View>
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} isUpcoming={activeTab === 'upcoming'} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
