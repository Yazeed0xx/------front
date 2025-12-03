import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';

type BookingSummaryBarProps = {
  totalPrice: number;
  guestCount: number;
  servicesCount: number;
  dateLabel?: string;
  timeLabel?: string;
  canBook: boolean;
  onBook: () => void;
};

export function BookingSummaryBar({
  totalPrice,
  guestCount,
  servicesCount,
  dateLabel,
  timeLabel,
  canBook,
  onBook,
}: BookingSummaryBarProps) {
  return (
    <View className="absolute bottom-0 left-0 right-0 bg-card border-t border-border px-4 pt-3 pb-6">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-xs text-muted-foreground">Total</Text>
          <Text className="text-xl font-bold text-primary">${totalPrice.toLocaleString()}</Text>
          <Text className="text-[10px] text-muted-foreground">
            {guestCount} guests{servicesCount > 0 && ` · ${servicesCount} services`}
          </Text>
        </View>
        <View className="items-end gap-1">
          {dateLabel && <Text className="text-xs font-medium">{dateLabel}</Text>}
          {timeLabel && <Text className="text-[11px] text-muted-foreground">{timeLabel}</Text>}
          <Button className={`px-6 mt-1 ${!canBook ? 'opacity-50' : ''}`} disabled={!canBook} onPress={onBook}>
            <Text>{canBook ? 'Book Now' : 'Select date & time'}</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

