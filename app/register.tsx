import React, { useMemo, useState } from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ArrowLeft } from 'lucide-react-native';
import { THEME } from '@/lib/theme';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@/lib/auth';
import { VerifyEmailForm } from '@/components/verify-email-form';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;
export default function RegisterScreen() {
  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();

  const { control, getValues, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

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

  const handleRegister = async (data: RegisterForm) => {
    try {
      await authClient.signUp.email({ email: data.email, password: data.password, name: data.name });
      setStep('otp');
    } catch (error) {
      console.error(error);
    }
  };

  const handleOtp = async () => {
    try {
      const email = getValues('email');
      if (!email || !otp) {
        return;
      }
      const { error } = await authClient.emailOtp.checkVerificationOtp({
        email,
        otp,
        type: 'email-verification',
      });
      if (!error) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleResendOtp = async () => {
    const email = getValues('email');
    if (!email) return;
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'email-verification',
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-5 pt-4 pb-6">
            <View className="flex-row items-center mb-6">
              <Button variant="ghost" size="icon" className="rounded-full mr-2" onPress={() => router.back()}>
                <Icon as={ArrowLeft} size={18} className="text-foreground" />
              </Button>
              <Text className="text-xl font-semibold text-foreground">{t('register')}</Text>
            </View>

            <View className="mb-4">
              <Text className="text-muted-foreground mt-1 text-sm">{t('createAccountDescription')}</Text>
            </View>

            {step === 'register' && (
              <Card className="border border-border/60 rounded-2xl">
                <CardContent className="py-4">
                  <View className="mb-4">
                    <Text className="text-sm text-foreground mb-2">{t('name')}</Text>
                    <Controller
                      control={control}
                      name="name"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder={t('namePlaceholder')}
                          placeholderTextColor={placeholderColor}
                          className="h-11 px-4 rounded-xl bg-card text-foreground border border-border"
                          cursorColor="currentColor"
                        />
                      )}
                    />
                    {errors.name && (
                      renderError(errors.name.message)
                    )}
                    {!errors.name && renderError()}
                  </View>

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
                    {errors.email ? renderError(errors.email.message) : renderError()}
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

                  <Button className="w-full rounded-xl mb-3" onPress={handleSubmit(handleRegister)}>
                    <Text className="text-primary-foreground font-medium">{t('signUp')}</Text>
                  </Button>

                  <Button variant="outline" className="w-full rounded-xl mb-3" onPress={() => router.replace('/(tabs)')}>
                    <Text className="text-foreground font-medium">{t('continueAsGuest')}</Text>
                  </Button>

                  <View className="items-center">
                    <Text className="text-sm text-muted-foreground">
                      {t('haveAccount')}{' '}
                      <Link href="/login">
                        <Text className="text-primary font-medium">{t('login')}</Text>
                      </Link>
                    </Text>
                  </View>
                </CardContent>
              </Card>
            )}
            {step === 'otp' && (
              <VerifyEmailForm
                email={getValues('email')}
                otp={otp}
                onChangeOtp={setOtp}
                onSubmit={handleOtp}
                onResend={handleResendOtp}
                onCancel={() => setStep('register')}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

