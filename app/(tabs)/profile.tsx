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
import { Settings, KeyRound, Globe, Moon, HelpCircle, Phone, LogOut, ChevronRight, LogIn } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/lib/i18n';
import { useNavigation } from '@react-navigation/native';
import { authClient } from '@/lib/auth';
import { router } from 'expo-router';
import { useTheme } from '@/lib/theme-context';

export default function ProfileScreen() {
  const {data:session} = authClient.useSession() 
  const { t } = useTranslation();
  const { theme, setTheme, isDark } = useTheme();
  const [language, setLanguage] = useState<'en' | 'ar'>(i18n.language as 'en' | 'ar');
  const navigation = useNavigation();
  const changeLanguage = async () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    await i18n.changeLanguage(newLang);
    await AsyncStorage.setItem('language', newLang);
  }; 
  const handleLogout = async () => {
    await authClient.signOut();
    navigation.navigate('login' as never);
  };
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <Text className="text-2xl font-bold text-foreground">{t('profile')}</Text>
        </View>

        {/* User Card */}
        <View className="px-5 mb-4">
          <Card className="border border-border/60">
            <CardContent className="py-4">
              <View className="flex-row items-center gap-4">
                <Avatar alt="User avatar" className="w-16 h-16 bg-primary">
                  <AvatarFallback>
                    <Text className="text-primary-foreground text-xl font-semibold">{session?.user?.name?.charAt(0)}</Text>
                  </AvatarFallback>
                </Avatar>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground">{session?.user?.name ?? ''}</Text>
                  <Text className="text-sm text-muted-foreground">{session?.user?.email ?? ''}</Text>
                  <Text className="text-xs text-muted-foreground mt-1">{t('memberSince', { date: session?.user?.createdAt ? new Date(session?.user?.createdAt).toLocaleDateString() : '' })}</Text>
                </View>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Text className="text-foreground">{t('edit')}</Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Settings */}
        <View className="px-5 mb-4">
          <Text className="text-sm font-medium text-muted-foreground mb-2 ml-1">{t('settings')}</Text>
          <Card className="border border-border/60">
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
              <Pressable 
                className="flex-row items-center justify-between py-4"
                onPress={changeLanguage}
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-full bg-secondary items-center justify-center">
                    <Icon as={Globe} size={18} className="text-foreground" />
                  </View>
                  <Text className="text-foreground">{t('language')}</Text>
                </View>
                <Text className="text-muted-foreground">{language === 'en' ? 'English' : 'العربية'}</Text>
              </Pressable>


              <Separator />
              {/*login button && logout button*/}
              {session?.user ? (
                <Pressable className="flex-row items-center justify-between py-4" onPress={handleLogout}>
                  <View className="flex-row items-center gap-3">
                    <View className="w-9 h-9 rounded-full bg-secondary items-center justify-center">
                      <Icon as={LogOut} size={18} className="text-foreground" />
                    </View>
                    <Text className="text-foreground">{t('logOut')}</Text>
                  </View>
                  <Icon as={ChevronRight} size={18} className="text-muted-foreground" />
                  </Pressable>
              ) : (
                <Pressable 
                className="flex-row items-center justify-between py-4"
                  onPress={() => navigation.navigate('login' as never)}
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-full bg-secondary items-center justify-center">
                    <Icon as={LogIn} size={18} className="text-foreground" />
                  </View>
                  <Text className="text-foreground">{t('login')}</Text>
                </View>
                <Icon as={ChevronRight} size={18} className="text-muted-foreground" />
              </Pressable>
              )}

              {/* Dark Mode */}
              <View className="flex-row items-center justify-between py-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-full bg-secondary items-center justify-center">
                    <Icon as={Moon} size={18} className="text-foreground" />
                  </View>
                  <Text className="text-foreground">{t('darkMode')}</Text>
                </View>
                <Switch 
                  checked={isDark} 
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
                />
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Support */}
        <View className="px-5 mb-4">
          <Text className="text-sm font-medium text-muted-foreground mb-2 ml-1">{t('support')}</Text>
          <Card className="border border-border/60">
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

        {/* Logout */}
        
      </ScrollView>
    </SafeAreaView>
  );
}
