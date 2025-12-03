import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

type HallEmptyStateProps = {
  onReset: () => void;
};

export function HallEmptyState({ onReset }: HallEmptyStateProps) {
  const { t } = useTranslation();
  return (
    <View className="flex-1 items-center justify-center px-5">
      <Text className="text-4xl mb-4">🔍</Text>
      <Text variant="h4" className="text-center mb-2">
        {t('noVenuesFound')}
      </Text>
      <Text className="text-muted-foreground text-center mb-4">
        {t('tryAdjustingFilters')}
      </Text>
      <Button variant="outline" onPress={onReset}>
        <Text>{t('resetAll')}</Text>
      </Button>
    </View>
  );
}
