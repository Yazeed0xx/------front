import React from 'react';
import { Platform, Pressable, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type DateTimePickerCardProps = {
  selectedDate: Date | null;
  selectedTime: Date | null;
  onChangeDate: (date: Date) => void;
  onChangeTime: (date: Date) => void;
  formatDate: (date?: Date | null) => string;
  formatTime: (date?: Date | null) => string;
};

export function DateTimePickerCard({
  selectedDate,
  selectedTime,
  onChangeDate,
  onChangeTime,
  formatDate,
  formatTime,
}: DateTimePickerCardProps) {
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);

  const handleDate = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'dismissed') {
      if (Platform.OS !== 'ios') setShowDatePicker(false);
      return;
    }
    if (date) onChangeDate(date);
    if (Platform.OS !== 'ios') setShowDatePicker(false);
  };

  const handleTime = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'dismissed') {
      if (Platform.OS !== 'ios') setShowTimePicker(false);
      return;
    }
    if (date) onChangeTime(date);
    if (Platform.OS !== 'ios') setShowTimePicker(false);
  };

  return (
    <Card className="mb-3">
      <CardContent className="p-3 gap-3">
        <Text className="font-semibold text-sm">Date & Time</Text>
        <View className="flex-row gap-2">
          <Pressable
            className="flex-1 rounded-lg border border-border bg-card px-3 py-2"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-[10px] text-muted-foreground uppercase">📅 Date</Text>
            <Text className="text-sm font-semibold mt-1">{formatDate(selectedDate)}</Text>
          </Pressable>
          <Pressable
            className="flex-1 rounded-lg border border-border bg-card px-3 py-2"
            onPress={() => setShowTimePicker(true)}
          >
            <Text className="text-[10px] text-muted-foreground uppercase">⏰ Time</Text>
            <Text className="text-sm font-semibold mt-1">{formatTime(selectedTime)}</Text>
          </Pressable>
        </View>

        {selectedDate && selectedTime && (
          <Badge variant="secondary" className="self-start mt-1">
            <Text className="text-[11px]">
              {formatDate(selectedDate)} · {formatTime(selectedTime)}
            </Text>
          </Badge>
        )}

        {showDatePicker && (
          <View className="rounded-lg bg-secondary/60 p-2">
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              minimumDate={new Date()}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDate}
            />
            {Platform.OS === 'ios' && (
              <View className="flex-row justify-end">
                <Button size="sm" variant="ghost" onPress={() => setShowDatePicker(false)}>
                  <Text>Done</Text>
                </Button>
              </View>
            )}
          </View>
        )}

        {showTimePicker && (
          <View className="rounded-lg bg-secondary/60 p-2">
            <DateTimePicker
              value={selectedTime || new Date()}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTime}
            />
            {Platform.OS === 'ios' && (
              <View className="flex-row justify-end">
                <Button size="sm" variant="ghost" onPress={() => setShowTimePicker(false)}>
                  <Text>Done</Text>
                </Button>
              </View>
            )}
          </View>
        )}
      </CardContent>
    </Card>
  );
}

