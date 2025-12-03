import React from 'react';
import { useColorScheme } from 'nativewind';
import { View, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';

const halls = [
  {
    id: 1,
    nameKey: 'theGrandBallroom' as const,
    locationKey: 'downtown' as const,
    price: 5000,
    originalPrice: 6500,
    capacity: 300,
    rating: 4.9,
    reviews: 128,
    spotsLeft: 3,
    nextAvailable: 'Dec 15',
  },
  {
    id: 2,
    nameKey: 'roseGardenEstate' as const,
    locationKey: 'countryside' as const,
    price: 3500,
    capacity: 150,
    rating: 4.8,
    reviews: 89,
    spotsLeft: 7,
    nextAvailable: 'Dec 22',
  },
];

const upcomingBooking = {
  venueKey: 'roseGardenEstate' as const,
  date: 'Dec 22, 2024',
  guests: 180,
  serviceKeys: ['catering', 'dj'] as const,
  depositDays: 5,
};

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const placeholderColor = React.useMemo(() => {
    const isDark = (colorScheme ?? 'light') === 'dark';
    return isDark ? 'hsla(270, 20%, 96%, 0.65)' : 'hsla(270, 20%, 15%, 0.5)';
  }, [colorScheme]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-6">
          <View className="bg-primary rounded-3xl p-5 border border-primary/40">
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-1 pr-3">
                <Text className="text-primary-foreground/90 text-xs">{t('welcome')}</Text>
                <Text className="text-primary-foreground text-2xl font-semibold mt-1">
                  {t('heroTitle')}
                </Text>
              </View>
              <Avatar alt="User profile" className="w-12 h-12 bg-primary-foreground/20">
                <AvatarFallback>
                  <Text className="text-primary-foreground text-sm">YA</Text>
                </AvatarFallback>
              </Avatar>
            </View>
            <View className="rounded-2xl p-3 flex-row items-center gap-3 bg-card border border-card-foreground/10">
              <TextInput
                placeholder={t('searchPlaceholder')}
                placeholderTextColor={placeholderColor}
                className="flex-1 border-transparent bg-transparent text-foreground"
                cursorColor="currentColor"
              />
              <Button size="sm" variant="secondary" className="rounded-full">
                <Text className="text-secondary-foreground font-medium">{t('go')}</Text>
              </Button>
            </View>
          </View>
        </View>

        <View className="px-5 mb-6">
          <Card className="border border-border/60 rounded-2xl">
            <CardContent className="py-4">
              <View className="flex-row items-center justify-between mb-3">
                <View>
                  <Text className="text-muted-foreground text-xs">{t('upcomingBooking')}</Text>
                  <Text className="text-foreground font-semibold text-base">{t(upcomingBooking.venueKey)}</Text>
                  <Text className="text-muted-foreground text-xs">
                    {upcomingBooking.date} · {upcomingBooking.guests} {t('guests')}
                  </Text>
                </View>
                <Badge variant="secondary">{t('depositDueIn', { days: upcomingBooking.depositDays })}</Badge>
              </View>
              <View className="flex-row gap-2 mb-3">
                {upcomingBooking.serviceKeys.map((serviceKey) => (
                  <Badge key={serviceKey} variant="outline" className="px-2 py-0.5">
                    <Text className="text-[11px]">{t(serviceKey)}</Text>
                  </Badge>
                ))}
              </View>
              <View className="flex-row gap-2">
                <Button variant="secondary" className="flex-1 rounded-xl">
                  <Text className="text-secondary-foreground font-medium">{t('bookAnotherHall')}</Text>
                </Button>
                <Button variant="outline" className="rounded-xl">
                  <Text className="text-foreground font-medium">{t('manage')}</Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        </View>

        <View className="px-5 pb-8">
          <Text className="text-lg font-semibold mb-3">{t('exploreHalls')}</Text>
          <View className="gap-3">
            {halls.map((hall) => (
              <Card key={hall.id} className="rounded-xl border border-border/70">
                <CardContent className="py-4">
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1 pr-4">
                      <Text className="text-base font-semibold">{t(hall.nameKey)}</Text>
                      <Text className="text-muted-foreground text-sm">
                        {t(hall.locationKey)} · {hall.capacity} {t('guests')}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-[11px] text-muted-foreground">{t('rating')}</Text>
                      <Text className="text-lg font-semibold">⭐ {hall.rating.toFixed(1)}</Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center mb-2">
                    <View className="flex-row items-baseline gap-2">
                      <Text className="text-primary font-bold text-xl">${hall.price.toLocaleString()}</Text>
                      {hall.originalPrice && (
                        <Text className="text-muted-foreground line-through text-sm">
                          ${hall.originalPrice.toLocaleString()}
                        </Text>
                      )}
                    </View>
                    <Badge variant="secondary" className="py-0.5">
                      <Text className="text-xs">{t('next')} {hall.nextAvailable}</Text>
                    </Badge>
                  </View>

                  <View className="flex-row gap-2 mb-3">
                    <Badge variant="outline" className="px-2 py-0.5">
                      <Text className="text-[10px]">{t('fullService')}</Text>
                    </Badge>
                    <Badge variant="outline" className="px-2 py-0.5">
                      <Text className="text-[10px]">{t('decorReady')}</Text>
                    </Badge>
                  </View>

                  <View className="flex-row gap-2">
                    <Button className="flex-1 rounded-full">
                      <Text className="text-primary-foreground font-medium">{t('bookNow')}</Text>
                    </Button>
                    <Button className="flex-1 rounded-full" variant="outline">
                      <Text className="text-foreground font-medium">{t('details')}</Text>
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
