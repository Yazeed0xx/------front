import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/ui/icon';
import {
  Settings,
  KeyRound,
  Globe,
  Moon,
  HelpCircle,
  Phone,
  LogOut,
  ChevronRight,
  Building2,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import { router } from 'expo-router';
import { useTheme } from '@/lib/theme-context';

export default function ProfileScreen() {
  const { company, user, logout } = useAuth();
  const { t } = useTranslation();
  const { setTheme, isDark } = useTheme();
  const [language, setLanguage] = useState<'en' | 'ar'>(i18n.language as 'en' | 'ar');

  const changeLanguage = async () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    await i18n.changeLanguage(newLang);
    await AsyncStorage.setItem('language', newLang);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <Text className="text-2xl font-bold text-foreground">{t('profile')}</Text>
        </View>

        {/* Company Card */}
        <View className="px-5 mb-4">
          <Card className="border border-border/60 rounded-2xl overflow-hidden">
            <CardContent className="py-4">
              <View className="flex-row items-center gap-3">
                <Avatar alt="Company logo" className="w-14 h-14 bg-primary">
                  <AvatarFallback>
                    <Text className="text-primary-foreground text-lg font-semibold">
                      {(
                        company?.companyProfile?.companyName ||
                        company?.companyName ||
                        'C'
                      )
                        .charAt(0)
                        ?.toUpperCase()}
                    </Text>
                  </AvatarFallback>
                </Avatar>
                <View className="flex-1 min-w-0">
                  <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
                    {company?.companyProfile?.companyName || company?.companyName || t('company')}
                  </Text>
                  <Text className="text-sm text-muted-foreground" numberOfLines={1}>
                    {user?.email || ''}
                  </Text>
                  <View className="flex-row items-center gap-1 mt-0.5">
                    <Icon as={Building2} size={12} className="text-muted-foreground" />
                    <Text className="text-xs text-muted-foreground">{company?.city || ''}</Text>
                  </View>
                </View>
                <Button variant="outline" size="sm" className="rounded-lg px-3 ml-1">
                  <Text className="text-foreground text-sm">{t('edit')}</Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Settings */}
        <View className="px-5 mb-4">
          <Text className="text-xs font-medium text-muted-foreground mb-2 ml-1 uppercase tracking-wide">
            {t('settings')}
          </Text>
          <Card className="border border-border/60 rounded-2xl overflow-hidden">
            <CardContent className="py-0">
              {/* Account Settings */}
              <Pressable className="flex-row items-center justify-between py-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-full bg-secondary items-center justify-center">
                    <Icon as={Settings} size={18} className="text-foreground" />
                  </View>
                  <Text className="text-foreground">{t('accountSettings')}</Text>
                </View>
                <Icon as={ChevronRight} size={18} className="text-muted-foreground" />
              </Pressable>

              <Separator />

              {/* Reset Password */}
              <Pressable className="flex-row items-center justify-between py-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-full bg-secondary items-center justify-center">
                    <Icon as={KeyRound} size={18} className="text-foreground" />
                  </View>
                  <Text className="text-foreground">{t('resetPassword')}</Text>
                </View>
                <Icon as={ChevronRight} size={18} className="text-muted-foreground" />
              </Pressable>

              <Separator />

              {/* Language */}
              <Pressable className="flex-row items-center justify-between py-4" onPress={changeLanguage}>
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-full bg-secondary items-center justify-center">
                    <Icon as={Globe} size={18} className="text-foreground" />
                  </View>
                  <Text className="text-foreground">{t('language')}</Text>
                </View>
                <Text className="text-muted-foreground">{language === 'en' ? 'English' : 'العربية'}</Text>
              </Pressable>

              <Separator />

              {/* Dark Mode */}
              <View className="flex-row items-center justify-between py-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-full bg-secondary items-center justify-center">
                    <Icon as={Moon} size={18} className="text-foreground" />
                  </View>
                  <Text className="text-foreground">{t('darkMode')}</Text>
                </View>
                <Switch checked={isDark} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} />
              </View>

              <Separator />

              {/* Logout */}
              <Pressable className="flex-row items-center justify-between py-4" onPress={handleLogout}>
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-full bg-secondary items-center justify-center">
                    <Icon as={LogOut} size={18} className="text-destructive" />
                  </View>
                  <Text className="text-destructive">{t('logOut')}</Text>
                </View>
                <Icon as={ChevronRight} size={18} className="text-muted-foreground" />
              </Pressable>
            </CardContent>
          </Card>
        </View>

        {/* Support */}
        <View className="px-5 mb-4">
          <Text className="text-xs font-medium text-muted-foreground mb-2 ml-1 uppercase tracking-wide">
            {t('support')}
          </Text>
          <Card className="border border-border/60 rounded-2xl overflow-hidden">
            <CardContent className="py-0">
              <Pressable className="flex-row items-center justify-between py-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-full bg-secondary items-center justify-center">
                    <Icon as={HelpCircle} size={18} className="text-foreground" />
                  </View>
                  <Text className="text-foreground">{t('helpFaq')}</Text>
                </View>
                <Icon as={ChevronRight} size={18} className="text-muted-foreground" />
              </Pressable>

              <Separator />

              <Pressable className="flex-row items-center justify-between py-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-full bg-secondary items-center justify-center">
                    <Icon as={Phone} size={18} className="text-foreground" />
                  </View>
                  <Text className="text-foreground">{t('contactUs')}</Text>
                </View>
                <Icon as={ChevronRight} size={18} className="text-muted-foreground" />
              </Pressable>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
