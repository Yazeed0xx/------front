import React from 'react';
import { View } from 'react-native';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

type HallSearchBarProps = {
  value: string;
  onChange: (text: string) => void;
};

export function HallSearchBar({ value, onChange }: HallSearchBarProps) {
  const { t } = useTranslation();
  return (
    <View className="px-5 mb-4">
      <Input
        placeholder={t('searchByNameLocation')}
        value={value}
        onChangeText={onChange}
        className="h-12"
      />
    </View>
  );
}
