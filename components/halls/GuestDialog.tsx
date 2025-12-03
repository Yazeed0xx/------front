import React from 'react';
import { View } from 'react-native';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type GuestDialogProps = {
  open: boolean;
  guestCount: number;
  min: number;
  max: number;
  onClose: () => void;
  onConfirm: (value: number) => void;
};

export default function GuestDialog({ open, guestCount, min, max, onClose, onConfirm }: GuestDialogProps) {
  const [value, setValue] = React.useState(String(guestCount));

  React.useEffect(() => {
    if (open) {
      setValue(String(guestCount));
    }
  }, [open, guestCount]);

  const clampValue = (input: number) => {
    return Math.min(Math.max(input, min), max);
  };

  const handleConfirm = () => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      return;
    }
    onConfirm(clampValue(parsed));
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-4">
        <DialogHeader>
          <DialogTitle>Set guest count</DialogTitle>
          <Text className="text-muted-foreground text-sm">
            Enter a number between {min} and {max} guests.
          </Text>
        </DialogHeader>

        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium">Guests</Text>
            <Text className="text-xs text-muted-foreground">
              {min}-{max}
            </Text>
          </View>
          <Input
            keyboardType="number-pad"
            value={value}
            onChangeText={setValue}
            placeholder="Enter guests"
            autoFocus
          />
        </View>

        <DialogFooter className="mt-2">
          <Button variant="outline" onPress={onClose}>
            <Text>Cancel</Text>
          </Button>
          <Button onPress={handleConfirm}>
            <Text>Apply</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}