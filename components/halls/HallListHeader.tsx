import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';

type HallListHeaderProps = {
  total: number;
};

export function HallListHeader({ total }: HallListHeaderProps) {
  const { t } = useTranslation();
  return (
    <View className="px-5 pt-4 pb-4">
      <Text variant="h3">{t('browseVenues')}</Text>
      <Text className="text-muted-foreground">{t('venuesAvailable', { count: total })}</Text>
    </View>
  );
}
