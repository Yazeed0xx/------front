import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

type HallSortBarProps = {
  showFilters: boolean;
  onToggleFilters: () => void;
  sortOptions: string[];
  selectedSort: string;
  onChangeSort: (value: string) => void;
};

export function HallSortBar({ showFilters, onToggleFilters, sortOptions, selectedSort, onChangeSort }: HallSortBarProps) {
  const { t } = useTranslation();

  const getSortLabel = (sort: string) => {
    const labels: Record<string, string> = {
      'Recommended': t('recommended'),
      'Price: Low': t('priceLow'),
      'Price: High': t('priceHigh'),
      'Rating': t('rating'),
      'Capacity': t('capacity'),
    };
    return labels[sort] || sort;
  };

  return (
    <View className="px-5 mb-3 flex-row gap-2">
      <Button variant={showFilters ? 'default' : 'outline'} size="sm" onPress={onToggleFilters}>
        <Text>{t('filters')} {showFilters ? '▲' : '▼'}</Text>
      </Button>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
        <View className="flex-row gap-2">
          {sortOptions.map((sort) => (
            <Pressable key={sort} onPress={() => onChangeSort(sort)}>
              <Badge variant={selectedSort === sort ? 'default' : 'outline'} className="px-3 py-1.5">
                <Text className="text-xs">{getSortLabel(sort)}</Text>
              </Badge>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
