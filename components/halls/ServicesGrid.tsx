import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';

export type HallService = {
  id: number;
  name: string;
  icon: string;
  price?: number;
  pricePerPerson?: number;
  perPerson?: boolean;
  popular?: boolean;
};

type ServicesGridProps = {
  services: HallService[];
  selectedServices: number[];
  guestCount: number;
  onToggle: (id: number) => void;
};

export function ServicesGrid({ services, selectedServices, guestCount, onToggle }: ServicesGridProps) {
  return (
    <Card className="mb-3">
      <CardContent className="p-3">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="font-semibold text-sm">Add Services</Text>
          <Text className="text-xs text-muted-foreground">Optional</Text>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {services.map((service) => {
            const isSelected = selectedServices.includes(service.id);
            const price = service.perPerson ? (service.pricePerPerson || 0) * guestCount : service.price;
            return (
              <Pressable key={service.id} onPress={() => onToggle(service.id)} className="w-[48%]">
                <View
                  className={`p-2.5 rounded-lg border flex-row items-center gap-2 ${
                    isSelected ? 'bg-primary/5 border-primary' : 'bg-card border-border'
                  }`}
                >
                  <Text>{service.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-xs font-medium">{service.name}</Text>
                    <Text className="text-[10px] text-primary font-medium">
                      +${price?.toLocaleString()}
                      {service.perPerson && <Text className="text-muted-foreground"> /all</Text>}
                    </Text>
                  </View>
                  <View
                    className={`w-4 h-4 rounded border items-center justify-center ${
                      isSelected ? 'bg-primary border-primary' : 'border-border'
                    }`}
                  >
                    {isSelected && <Text className="text-primary-foreground text-[8px]">✓</Text>}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </CardContent>
    </Card>
  );
}

