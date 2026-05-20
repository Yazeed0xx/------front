import React, { useMemo, useState } from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react-native';
import { THEME } from '@/lib/theme';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/auth-context';
import { loginSchema, type LoginFormData } from '@/types/auth';
import { getErrorMessage } from '@/utils/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function LoginScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const placeholderColor = useMemo(() => {
    const isDark = (colorScheme ?? 'light') === 'dark';
    const hsl = isDark ? THEME.dark.mutedForeground : THEME.light.mutedForeground;
    const [h, s, l] = hsl.match(/\d+/g)?.map(Number) || [0, 0, 60];
    return `hsla(${h}, ${s}%, ${l}%, 0.8)`;
  }, [colorScheme]);

  const renderError = (message?: string) => (
    <View className="mt-1 min-h-[18px]">
      <Text className={`text-xs ${message ? 'text-destructive' : 'text-transparent'}`}>
        {message || 'placeholder'}
      </Text>
    </View>
  );

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      await login(data.email, data.password);
      // Auth context will handle routing based on company status
      router.replace('/(tabs)');
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <View className="flex-1 px-5 pb-6 pt-4">
          <View className="mb-6">
            <Text className="text-xl font-semibold text-foreground">{t('companyLogin')}</Text>
          </View>

          <View className="mb-4">
            <Text className="mt-1 text-sm text-muted-foreground">{t('loginDescription')}</Text>
          </View>

          <Card className="rounded-2xl border border-border/60">
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
                <Text className="mb-2 text-sm text-foreground">{t('email')}</Text>
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
                      autoCorrect={false}
                      editable={!isLoading}
                      className="h-11 rounded-xl border border-border bg-card px-4 text-foreground"
                      cursorColor="currentColor"
                    />
                  )}
                />
                {errors.email ? renderError(errors.email.message) : renderError()}
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm text-foreground">{t('password')}</Text>
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
                      editable={!isLoading}
                      className="h-11 rounded-xl border border-border bg-card px-4 text-foreground"
                      cursorColor="currentColor"
                    />
                  )}
                />
                {errors.password ? renderError(errors.password.message) : renderError()}
              </View>

              <Button
                className="mb-3 w-full rounded-xl"
                onPress={handleSubmit(handleLogin)}
                disabled={isLoading}>
                <Text className="font-medium text-primary-foreground">
                  {isLoading ? t('signingIn') : t('signIn')}
                </Text>
              </Button>

              <View className="items-center">
                <Text className="text-sm text-muted-foreground">
                  {t('dontHaveAccount')}{' '}
                  <Link href="/register" replace>
                    <Text className="font-medium text-primary">{t('register')}</Text>
                  </Link>
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
