import React, { useMemo } from 'react';
import { useState } from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { AlertCircle } from 'lucide-react-native';
import { THEME } from '@/lib/theme';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@/lib/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'invalid credentials'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

//   const [remember, setRemember] = React.useState(true);
//   const handleForgotPassword = () => {
//     // TODO: link to forgot password flow when available
//     router.back();
//   };

  const placeholderColor = useMemo(() => {
    const isDark = (colorScheme ?? 'light') === 'dark';
    const primaryForegroundHsl = isDark ? THEME.dark.primaryForeground : THEME.light.primaryForeground;
    const [h, s, l] = primaryForegroundHsl.match(/\d+/g)?.map(Number) || [0, 0, 0];
    return `hsla(${h}, ${s}%, ${l}%, 0.65)`;
  }, [colorScheme]);

  const renderError = (message?: string) => (
    <View className="min-h-[18px] mt-1">
      <Text className={`text-xs ${message ? 'text-destructive' : 'text-transparent'}`}>
        {message || 'placeholder'}
      </Text>
    </View>
  );

  const [serverError, setServerError] = useState<string | null>(null);

  const handleLogin = async (data: LoginForm) => {
   const {  error } = await authClient.signIn.email({ email: data.email, password: data.password });
   if (error) {
    setServerError(error.message || t('loginErrorDescription'));
   } else {
    router.replace('/(tabs)');
   }  
  };
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <View className="flex-1 px-5 pt-4 pb-6">
          <View className="mb-6">
            <Text className="text-xl font-semibold text-foreground">{t('login')}</Text>
          </View>

          <View className="mb-4">
            {/* <Text className="text-foreground text-2xl font-bold">{t('welcome')}</Text> */}
            <Text className="text-muted-foreground mt-1 text-sm">{t('loginDescription')}</Text>
          </View>

          <Card className="border border-border/60 rounded-2xl">
            <CardContent className="py-4">
              {serverError && (
                <View className="mb-3">
                  <Alert variant="destructive" icon={AlertCircle}>
                    <AlertTitle>{t('loginError')}</AlertTitle>
                    <AlertDescription>{serverError}</AlertDescription>
                  </Alert>
                </View>
              )}
              <View className="mb-4">
                <Text className="text-sm text-foreground mb-2">{t('email')}</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder={t('emailPlaceholder')}
                      placeholderTextColor={placeholderColor}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="h-11 px-4 rounded-xl bg-card text-foreground border border-border"
                      cursorColor="currentColor"
                    />
                  )}
                />
                {/* {errors.email ? renderError(errors.email.message) : renderError()} */}
              </View>

              <View className="mb-4">
                <Text className="text-sm text-foreground mb-2">{t('password')}</Text>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder={t('passwordPlaceholder')}
                      placeholderTextColor={placeholderColor}
                      secureTextEntry
                      className="h-11 px-4 rounded-xl bg-card text-foreground border border-border"
                      cursorColor="currentColor"
                    />
                  )}
                />
                {errors.password ? renderError(errors.password.message) : renderError()}
                
              </View>
              <View className="items-center">
                <Text className="text-sm text-muted-foreground">
                  {t('dontHaveAccount')}{' '}
                  <Link href="/register" replace>
                    <Text className="text-primary font-medium">{t('register')}</Text>
                  </Link>
                </Text>
              </View>

             

              <Button className="w-full rounded-xl mb-3" onPress={handleSubmit(handleLogin)}>
                <Text className="text-primary-foreground font-medium">{t('signIn')}</Text>
              </Button>

              {/* <Button variant="outline" className="w-full rounded-xl" onPress={() => router.replace('/(tabs)')}>
                <Text className="text-foreground font-medium">{t('continueAsGuest')}</Text>
              </Button> */}
            </CardContent>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

