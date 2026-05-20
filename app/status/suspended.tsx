import React from 'react';
import { View, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth-context';
import { Ban } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function SuspendedScreen() {
  const { t } = useTranslation();
  const { company, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@qaat.app');
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className="flex-1 px-5 justify-center">
        <Card className="border border-border/60 rounded-2xl">
          <CardContent className="py-8 items-center">
            <View className="w-20 h-20 rounded-full bg-gray-500/10 items-center justify-center mb-6">
              <Icon as={Ban} size={40} className="text-gray-600" />
            </View>

            <Text className="text-2xl font-bold text-foreground text-center mb-2">
              {t('accountSuspended')}
            </Text>

            <Text className="text-muted-foreground text-center mb-6 px-4">
              {t('accountSuspendedDescription')}
            </Text>

            <View className="bg-gray-500/10 rounded-xl px-4 py-3 w-full mb-6">
              <Text className="text-gray-700 text-sm text-center">
                {t('accountSuspendedNote')}
              </Text>
            </View>

            <View className="w-full gap-3">
              <Button onPress={handleContactSupport} className="w-full rounded-xl">
                <Text className="text-primary-foreground font-medium">{t('contactSupport')}</Text>
              </Button>

              <Button variant="outline" onPress={handleLogout} className="w-full rounded-xl">
                <Text className="text-foreground">{t('logOut')}</Text>
              </Button>
            </View>
          </CardContent>
        </Card>
      </View>
    </SafeAreaView>
  );
}
