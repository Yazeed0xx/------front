import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth-context';
import { Clock } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function PendingScreen() {
  const { t } = useTranslation();
  const { company, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className="flex-1 px-5 justify-center">
        <Card className="border border-border/60 rounded-2xl">
          <CardContent className="py-8 items-center">
            <View className="w-20 h-20 rounded-full bg-amber-500/10 items-center justify-center mb-6">
              <Icon as={Clock} size={40} className="text-amber-600" />
            </View>

            <Text className="text-2xl font-bold text-foreground text-center mb-2">
              {t('pendingApproval')}
            </Text>

            <Text className="text-muted-foreground text-center mb-6 px-4">
              {t('pendingApprovalDescription')}
            </Text>

            {(company?.companyProfile?.companyName || company?.companyName) && (
              <View className="bg-secondary/50 rounded-xl px-4 py-3 mb-6 w-full">
                <Text className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  {t('companyName')}
                </Text>
                <Text className="text-foreground font-medium">
                  {company?.companyProfile?.companyName || company?.companyName}
                </Text>
              </View>
            )}

            <View className="bg-amber-500/10 rounded-xl px-4 py-3 w-full mb-6">
              <Text className="text-amber-700 text-sm text-center">
                {t('pendingApprovalNote')}
              </Text>
            </View>

            <Button variant="outline" onPress={handleLogout} className="w-full rounded-xl">
              <Text className="text-foreground">{t('logOut')}</Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    </SafeAreaView>
  );
}
