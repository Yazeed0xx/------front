import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import GuestDialog from './GuestDialog';

type GuestSelectorCardProps = {
  guestCount: number;
  min: number;
  max: number;
  venuePrice: number;
  onChange: (value: number) => void;
};

export function GuestSelectorCard({
  guestCount,
  min,
  max,
  venuePrice,
  onChange,
}: GuestSelectorCardProps) {
  const [showInsertGuestModal, setShowInsertGuestModal] = useState(false);

  const adjust = (delta: number) => {
    const next = guestCount + delta;
    if (next >= min && next <= max) {
      onChange(next);
    }
  };

  const handleInsertGuest = () => {
    setShowInsertGuestModal(true);
  };

  const handleCloseInsertGuestModal = () => {
    setShowInsertGuestModal(false);
  };

  const handleConfirmGuest = (value: number) => {
    onChange(value);
    setShowInsertGuestModal(false);
  };

  return (
    <>
      <Card className="mb-3">
        <CardContent className="p-3">
          <Text className="font-semibold text-sm mb-2">Number of Guests</Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={() => adjust(-1)}
                className="bg-secondary rounded-full w-8 h-8 items-center justify-center"
              >
                <Text className="font-bold">−</Text>
              </Pressable>
              <Pressable
                onPress={handleInsertGuest}
                className="bg-secondary rounded-full w-16 h-8 items-center justify-center"
              >
                <Text className="text-2xl font-bold text-primary w-16 text-center">{guestCount}</Text>
              </Pressable>
              <Pressable
                onPress={() => adjust(1)}
                className="bg-secondary rounded-full w-8 h-8 items-center justify-center"
              >
                <Text className="font-bold">+</Text>
              </Pressable>
            </View>
            <View className="items-end">
              <Text className="text-xs text-muted-foreground">Venue price</Text>
              <Text className="font-bold text-primary">${venuePrice.toLocaleString()}</Text>
            </View>
          </View>
        </CardContent>
      </Card>
      <GuestDialog
        open={showInsertGuestModal}
        onClose={handleCloseInsertGuestModal}
        guestCount={guestCount}
        min={min}
        max={max}
        onConfirm={handleConfirmGuest}
      />
    </>
  );
}

