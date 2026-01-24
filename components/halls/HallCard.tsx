import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export type Hall = {
  id: number;
  name: string;
  location: string;
  city: string;
  price: number;
  originalPrice?: number;
  capacity: number;
  rating: number;
  amenities: string[];
  type: string;
  featured?: boolean;
  reviews?: number;
};

type HallCardProps = {
  hall: Hall;
  onBook: (id: number) => void;
  onDetails: (id: number) => void;
};

export function HallCard({ hall, onBook, onDetails }: HallCardProps) {
  const { t } = useTranslation();

  return (
    <Pressable>
      <Card className="mx-4 mb-2 rounded-xl border border-border/60 shadow-none">
        <View className="h-28 bg-secondary rounded-t-xl items-center justify-center relative">
          <Text className="text-3xl">🏛️</Text>
          {hall.featured && (
            <Badge className="absolute top-3 left-3 bg-accent">
              <Text className="text-accent-foreground text-xs">{t('featured')}</Text>
            </Badge>
          )}
          {hall.originalPrice && (
            <Badge variant="destructive" className="absolute top-3 right-3">
              <Text className="text-xs">
                {Math.round(((hall.originalPrice - hall.price) / hall.originalPrice) * 100)}% {t('off')}
              </Text>
            </Badge>
          )}
        </View>

        <CardContent className="px-4 py-3">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="font-semibold text-sm">{hall.name}</Text>
                <Badge variant="secondary" className="px-2 py-0.5">
                  <Text className="text-[10px] uppercase">{hall.type}</Text>
                </Badge>
              </View>
              <Text className="text-muted-foreground text-[11px]">{hall.location}</Text>
            </View>
            <View className="items-end">
              <View className="flex-row items-center gap-1">
                <Text className="text-[11px]">⭐</Text>
                <Text className="text-[11px] font-semibold text-primary">{hall.rating.toFixed(1)}</Text>
              </View>
            </View>
          </View>

          <View className="flex-row justify-between items-center mt-1">
            <View className="flex-row gap-2">
              <Badge variant="outline" className="px-2 py-0.5">
                <Text className="text-[10px]">{hall.capacity} {t('guests')}</Text>
              </Badge>
              <Badge variant="outline" className="px-2 py-0.5">
                <Text className="text-[10px]">{hall.city}</Text>
              </Badge>
            </View>
            <Text className="text-muted-foreground text-[11px]">
              {hall.amenities.slice(0, 2).join(' • ')}
              {hall.amenities.length > 2 ? ' +' : ''}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-3">
            <View className="flex-row items-baseline gap-1">
                  <Text className="text-primary font-semibold text-lg">{hall.price.toLocaleString()} sr</Text>
              {hall.originalPrice && (
                <Text className="text-muted-foreground line-through text-[11px]">
                  {hall.originalPrice.toLocaleString()} sr
                </Text>
              )}
            </View>
            {hall.originalPrice && (
              <Badge variant="destructive" className="px-2 py-0">
                <Text className="text-[10px]">
                  -{Math.round(((hall.originalPrice - hall.price) / hall.originalPrice) * 100)}%
                </Text>
              </Badge>
            )}
          </View>

        </CardContent>

        <CardFooter className="pt-0 px-4 pb-3 gap-2">
          <Button onPress={() => onBook(hall.id)} className="flex-1 h-9">
            <Text className="text-sm font-medium">{t('book')}</Text>
          </Button>
          <Button onPress={() => onDetails(hall.id)} variant="outline" className="h-9 px-3">
            <Text className="text-sm font-medium">{t('details')}</Text>
          </Button>
        </CardFooter>
      </Card>
    </Pressable>
  );
}
