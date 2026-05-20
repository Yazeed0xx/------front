import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

type HallFilterPanelProps = {
  typeFilters: string[];
  priceFilters: string[];
  selectedType: string;
  selectedPrice: string;
  onChangeType: (value: string) => void;
  onChangePrice: (value: string) => void;
  onClear: () => void;
  showClear: boolean;
};

export function HallFilterPanel({
  typeFilters,
  priceFilters,
  selectedType,
  selectedPrice,
  onChangeType,
  onChangePrice,
  onClear,
  showClear,
}: HallFilterPanelProps) {
  const { t } = useTranslation();

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'All': t('all'),
      'Ballroom': t('ballroom'),
      'Garden': t('garden'),
      'Beach': t('beach'),
      'Rooftop': t('rooftop'),
      'Indoor': t('indoor'),
      'Outdoor': t('outdoor'),
    };
    return labels[type] || type;
  };

  const getPriceLabel = (price: string) => {
    const labels: Record<string, string> = {
      'All': t('all'),
      'Under $3k': t('under3k'),
      '$3k-$5k': t('3kTo5k'),
      '$5k-$7k': t('5kTo7k'),
      '$7k+': t('above7k'),
    };
    return labels[price] || price;
  };

  return (
    <View className="px-5 mb-4">
      <Card className="bg-secondary/30 border-0 rounded-2xl overflow-hidden">
        <CardContent className="py-4">
          <Text className="font-medium text-sm text-foreground mb-2.5">{t('venueType')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 -mx-1">
            <View className="flex-row gap-2 px-1">
              {typeFilters.map((type) => (
                <Pressable key={type} onPress={() => onChangeType(type)}>
                  <Badge
                    variant={selectedType === type ? 'default' : 'secondary'}
                    className={`px-3 py-1.5 ${selectedType === type ? '' : 'bg-background/60'}`}
                  >
                    <Text className={`text-xs font-medium ${selectedType === type ? 'text-primary-foreground' : 'text-foreground'}`}>
                      {getTypeLabel(type)}
                    </Text>
                  </Badge>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <Text className="font-medium text-sm text-foreground mb-2.5">{t('priceRange')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
            <View className="flex-row gap-2 px-1">
              {priceFilters.map((price) => (
                <Pressable key={price} onPress={() => onChangePrice(price)}>
                  <Badge
                    variant={selectedPrice === price ? 'default' : 'secondary'}
                    className={`px-3 py-1.5 ${selectedPrice === price ? '' : 'bg-background/60'}`}
                  >
                    <Text className={`text-xs font-medium ${selectedPrice === price ? 'text-primary-foreground' : 'text-foreground'}`}>
                      {getPriceLabel(price)}
                    </Text>
                  </Badge>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {showClear && (
            <Button variant="ghost" size="sm" className="mt-4 self-start" onPress={onClear}>
              <Text className="text-destructive text-sm font-medium">{t('clearFilters')}</Text>
            </Button>
          )}
        </CardContent>
      </Card>
    </View>
  );
}
