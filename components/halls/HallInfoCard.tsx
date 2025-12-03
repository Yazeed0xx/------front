import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type InfoTile = {
  icon: string;
  label: string;
  value: string;
};

type HallInfoCardProps = {
  name: string;
  address: string;
  rating: number;
  infoTiles: InfoTile[];
  onCall?: () => void;
  onDirections?: () => void;
};

export function HallInfoCard({
  name,
  address,
  rating,
  infoTiles,
  onCall,
  onDirections,
}: HallInfoCardProps) {
  return (
    <Card className="mb-3">
      <CardContent className="p-4 gap-3">
        <View className="flex-row justify-between gap-3">
          <View className="flex-1">
            <Text className="font-semibold text-base">{name}</Text>
            <Text className="text-muted-foreground text-xs mt-0.5" numberOfLines={1}>
              {address}
            </Text>
          </View>
          <View className="bg-primary/10 rounded-lg px-2 py-1 flex-row items-center justify-center gap-1 min-w-[60px]">
            <Text className="text-[8px]">⭐</Text>
            <Text className="text-[9px] font-semibold text-primary">{rating}</Text>
          </View>
        </View>

        <View className="flex-row gap-2">
          <Button variant="outline" size="sm" className="flex-1" onPress={onCall}>
            <Text className="text-xs">📞 Call</Text>
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onPress={onDirections}>
            <Text className="text-xs">🗺️ Directions</Text>
          </Button>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {infoTiles.map((tile) => (
            <View key={tile.label} className="bg-secondary/60 rounded-lg px-3 py-2 basis-[48%]">
              <Text className="text-[10px] text-muted-foreground uppercase">
                {tile.icon} {tile.label}
              </Text>
              <Text className="text-sm font-semibold mt-1" numberOfLines={1}>
                {tile.value}
              </Text>
            </View>
          ))}
        </View>
      </CardContent>
    </Card>
  );
}

