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
  rating?: number | null;
  amenities?: string[] | null;
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
  const discountPercent = hall.originalPrice
    ? Math.round(((hall.originalPrice - hall.price) / hall.originalPrice) * 100)
    : 0;

  return (
    <Pressable onPress={() => onDetails(hall.id)}>
      <Card className="mx-4 mb-3 overflow-hidden rounded-2xl border border-border/60 shadow-none">
        <View className="relative h-28 items-center justify-center bg-secondary">
          <Text className="text-3xl">🏛️</Text>
          {hall.featured && (
            <Badge className="absolute left-2.5 top-2.5 bg-accent px-2.5 py-1">
              <Text className="text-[11px] font-medium text-accent-foreground">
                {t('featured')}
              </Text>
            </Badge>
          )}
          {hall.originalPrice && (
            <Badge variant="destructive" className="absolute right-2.5 top-2.5 px-2 py-1">
              <Text className="text-[11px] font-medium">-{discountPercent}%</Text>
            </Badge>
          )}
        </View>

        <CardContent className="px-3.5 py-3">
          {/* Header: Name + Rating */}
          <View className="mb-1.5 flex-row items-start justify-between">
            <View className="flex-1 pr-2">
              <Text className="text-[15px] font-semibold text-foreground" numberOfLines={1}>
                {hall.name}
              </Text>
              <Text className="mt-0.5 text-xs text-muted-foreground">
                {hall.location}, {hall.city}
              </Text>
            </View>
            <View className="flex-row items-center gap-1 rounded-lg bg-secondary/50 px-2 py-1">
              <Text className="text-xs">⭐</Text>
              <Text className="text-xs font-semibold text-foreground">
                {(hall.rating ?? 0).toFixed(1)}
              </Text>
            </View>
          </View>

          {/* Tags Row */}
          <View className="mt-2 flex-row flex-wrap gap-1.5">
            <Badge variant="secondary" className="px-2 py-0.5">
              <Text className="text-[11px] text-secondary-foreground">{hall.type}</Text>
            </Badge>
            <Badge variant="outline" className="px-2 py-0.5">
              <Text className="text-[11px]">
                {hall.capacity} {t('guests')}
              </Text>
            </Badge>
            {(hall.amenities ?? []).slice(0, 2).map((amenity) => (
              <Badge key={amenity} variant="outline" className="px-2 py-0.5">
                <Text className="text-[11px]">{amenity}</Text>
              </Badge>
            ))}
            {(hall.amenities ?? []).length > 2 && (
              <Badge variant="outline" className="px-2 py-0.5">
                <Text className="text-[11px]">+{(hall.amenities ?? []).length - 2}</Text>
              </Badge>
            )}
          </View>

          {/* Price Row */}
          <View className="mt-3 flex-row items-baseline gap-1.5">
            <Text className="text-lg font-bold text-primary">
              {(hall.price ?? 0).toLocaleString()}
            </Text>
            <Text className="text-sm font-medium text-primary">SR</Text>
            {hall.originalPrice && (
              <Text className="ml-1 text-xs text-muted-foreground line-through">
                {hall.originalPrice.toLocaleString()} SR
              </Text>
            )}
          </View>
        </CardContent>

        <CardFooter className="gap-2 px-3.5 pb-3 pt-0">
          <Button onPress={() => onBook(hall.id)} className="h-10 flex-1 rounded-xl">
            <Text className="text-sm font-semibold text-primary-foreground">{t('book')}</Text>
          </Button>
          <Button
            onPress={() => onDetails(hall.id)}
            variant="outline"
            className="h-10 rounded-xl px-4">
            <Text className="text-sm font-medium text-foreground">{t('details')}</Text>
          </Button>
        </CardFooter>
      </Card>
    </Pressable>
  );
}
