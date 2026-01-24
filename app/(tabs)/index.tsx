import React, { useMemo } from 'react';
import { useColorScheme } from 'nativewind';
import { View, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';
import { authClient } from '@/lib/auth';
import { THEME } from '@/lib/theme';

export default function HomeScreen() {
  const { data: session } = authClient.useSession();
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

  const placeholderColor = useMemo(() => {
    const isDark = (colorScheme ?? 'light') === 'dark';
    const primaryForegroundHsl = isDark ? THEME.dark.primaryForeground : THEME.light.primaryForeground;
    const [h, s, l] = primaryForegroundHsl.match(/\d+/g)?.map(Number) || [0, 0, 0];
    return `hsla(${h}, ${s}%, ${l}%, 0.65)`;
  }, [colorScheme]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-6">
          <View className="bg-primary rounded-3xl p-5 border border-primary/40">
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-1 pr-3">
                <Text className="text-primary-foreground/90 text-xs">{t('welcome', { name: session?.user?.name ?? '' })}</Text>
                <Text className="text-primary-foreground text-2xl font-semibold mt-1">
                  {t('heroTitle')}
                </Text>
              </View>
              <Avatar alt="User profile" className="w-12 h-12 bg-primary-foreground/20">
                <AvatarFallback>
                  <Text className="text-primary-foreground text-sm">{session?.user?.name?.charAt(0)}</Text>
                </AvatarFallback>
              </Avatar>
            </View>
            <View className="rounded-2xl p-3 flex-row items-center gap-3 bg-card border border-card-foreground/10">
              <TextInput
                placeholder={t('searchPlaceholder')}
                placeholderTextColor={placeholderColor}
                className="flex-1 border-transparent bg-transparent text-foreground"
                cursorColor="currentColor"
              />
              <Button size="sm" variant="secondary" className="rounded-full">
                <Text className="text-secondary-foreground font-medium">{t('go')}</Text>
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
