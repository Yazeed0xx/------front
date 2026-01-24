import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { router } from 'expo-router';
import { Calendar, Users, MapPin, Clock } from 'lucide-react-native';

type BookingRequest = {
  id: number;
  hall: string;
  requester: string;
  date: string;
  time: string;
  guests: number;
  location: string;
  status: 'pending' | 'accepted' | 'declined';
  notes?: string;
};

const bookingRequests: BookingRequest[] = [
  { id: 1, hall: 'Grand Ballroom', requester: 'Sara Ahmed', date: 'Jan 12, 2025', time: '7:00 PM', guests: 180, location: 'Riyadh', status: 'pending', notes: 'Needs stage and projector' },
  { id: 2, hall: 'Rose Garden Estate', requester: 'Mohammed Ali', date: 'Jan 20, 2025', time: '6:30 PM', guests: 140, location: 'Jeddah', status: 'accepted' },
  { id: 3, hall: 'Skyline Lounge', requester: 'Lina Omar', date: 'Feb 2, 2025', time: '8:00 PM', guests: 90, location: 'Riyadh', status: 'declined', notes: 'Price negotiation failed' },
];

const statusColors: Record<BookingRequest['status'], string> = {
  pending: 'bg-amber-500/10 text-amber-700',
  accepted: 'bg-green-500/10 text-green-700',
  declined: 'bg-rose-500/10 text-rose-700',
};

export default function BookingRequestsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-3">
          <Text className="text-2xl font-bold text-foreground">Booking requests</Text>
          <Text className="text-muted-foreground mt-1 text-sm">Manage user booking requests for your halls</Text>
        </View>

        <View className="px-5">
          {bookingRequests.map((req) => (
            <Card key={req.id} className="mb-3 border border-border/60">
              <CardContent className="py-4">
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1 pr-3">
                    <Text className="font-semibold text-base text-foreground">{req.hall}</Text>
                    <Text className="text-muted-foreground text-sm">by {req.requester}</Text>
                    <View className="flex-row items-center gap-1 mt-1">
                      <Icon as={MapPin} size={12} className="text-muted-foreground" />
                      <Text className="text-xs text-muted-foreground">{req.location}</Text>
                    </View>
                  </View>
                  <Badge variant="outline" className={statusColors[req.status]}>
                    <Text className="text-xs capitalize">{req.status}</Text>
                  </Badge>
                </View>

                <View className="flex-row gap-4 mb-3">
                  <View className="flex-row items-center gap-2">
                    <Icon as={Calendar} size={14} className="text-primary" />
                    <Text className="text-sm text-foreground">{req.date}</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Icon as={Clock} size={14} className="text-primary" />
                    <Text className="text-sm text-foreground">{req.time}</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Icon as={Users} size={14} className="text-primary" />
                    <Text className="text-sm text-foreground">{req.guests} guests</Text>
                  </View>
                </View>

                {req.notes ? (
                  <View className="mb-3">
                    <Text className="text-xs text-muted-foreground">Notes: {req.notes}</Text>
                  </View>
                ) : null}

                <View className="flex-row gap-2 pt-2 border-t border-border/40">
                  <Button variant="outline" size="sm" className="flex-1 rounded-full" onPress={() => router.push(`/booking/${req.id}`)}>
                    <Text className="text-foreground text-sm">View</Text>
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1 rounded-full">
                    <Text className="text-secondary-foreground text-sm">Decline</Text>
                  </Button>
                  <Button size="sm" className="flex-1 rounded-full">
                    <Text className="text-primary-foreground text-sm">Approve</Text>
                  </Button>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
