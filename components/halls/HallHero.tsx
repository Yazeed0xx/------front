import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';

type HallHeroProps = {
  imagesCount: number;
  onBack: () => void;
};

export function HallHero({ imagesCount, onBack }: HallHeroProps) {
  return (
    <View className="h-52 bg-secondary relative">
      <View className="flex-1 items-center justify-center">
        <Text className="text-5xl">🏛️</Text>
      </View>

      <SafeAreaView className="absolute top-0 left-0 right-0" edges={['top']}>
        <View className="px-4 pt-2 flex-row justify-between">
          <Pressable
            onPress={onBack}
            className="bg-background/80 rounded-full w-9 h-9 items-center justify-center"
          >
            <Text>←</Text>
          </Pressable>
          <View className="bg-background/80 rounded-full px-2 py-1">
            <Text className="text-xs">1/{imagesCount}</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

