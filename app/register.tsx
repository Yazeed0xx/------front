import React, { useMemo, useState } from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { CheckCircle2 } from 'lucide-react-native';
import { THEME } from '@/lib/theme';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@/lib/auth';
import { VerifyEmailForm } from '@/components/verify-email-form';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(4),
  cr_pdf_url: z.string().optional(),
  city: z.string().min(2),
  neighborhood: z.string().min(2),
});

type RegisterForm = z.infer<typeof registerSchema>;
export default function RegisterScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();
  const tr = (key: string, fallback: string) => t(key as any, { defaultValue: fallback });
  const [step, setStep] = useState<'register' | 'pending'>('register');

  const { control, getValues, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', phone: '', address: '', cr_pdf_url: 'test.pdf', city: '', neighborhood: '' },
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
      const res = await axios
        .post('http://localhost:8000/api/company/auth/register', data);
      if (res.status === 200) {
        setStep('pending');
      } else {
        console.error(res.data);
      }
    } catch (error) {
      console.error(error);
    }
    
  };
  const pickCrDocument = async (onChange: (uri: string) => void) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (asset?.uri) {
        onChange(asset.uri);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // const handleOtp = async () => {
  //   try {
  //     const email = getValues('email');
  //     if (!email || !otp) {
  //       return;
  //     }
  //     const { error } = await authClient.emailOtp.checkVerificationOtp({
  //       email,
  //       otp,
  //       type: 'email-verification',
  //     });
  //     if (!error) {
  //       router.replace('/(tabs)');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const handleResendOtp = async () => {
  //   const email = getValues('email');
  //   if (!email) return;
  //   try {
  //     await authClient.emailOtp.sendVerificationOtp({
  //       email,
  //       type: 'email-verification',
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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
            <View className="mb-6">
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

                  <View className="mb-4">
                    <Text className="text-sm text-foreground mb-2">{tr('phone', 'Phone')}</Text>
                    <Controller
                      control={control}
                      name="phone"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder={tr('phonePlaceholder', 'Enter phone number')}
                          placeholderTextColor={placeholderColor}
                          keyboardType="phone-pad"
                          className="h-11 px-4 rounded-xl bg-card text-foreground border border-border"
                          cursorColor="currentColor"
                        />
                      )}
                    />
                    {errors.phone ? renderError(errors.phone.message) : renderError()}
                  </View>

                  <View className="mb-4">
                    <Text className="text-sm text-foreground mb-2">{tr('address', 'Address')}</Text>
                    <Controller
                      control={control}
                      name="address"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder={tr('addressPlaceholder', 'Full address')}
                          placeholderTextColor={placeholderColor}
                          multiline
                          className="min-h-12 px-4 py-2 rounded-xl bg-card text-foreground border border-border"
                          cursorColor="currentColor"
                        />
                      )}
                    />
                    {errors.address ? renderError(errors.address.message) : renderError()}
                  </View>

                  <View className="mb-4">
                    <Text className="text-sm text-foreground mb-2">{tr('city', 'City')}</Text>
                    <Controller
                      control={control}
                      name="city"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder={tr('cityPlaceholder', 'City')}
                          placeholderTextColor={placeholderColor}
                          className="h-11 px-4 rounded-xl bg-card text-foreground border border-border"
                          cursorColor="currentColor"
                        />
                      )}
                    />
                    {errors.city ? renderError(errors.city.message) : renderError()}
                  </View>

                  <View className="mb-4">
                    <Text className="text-sm text-foreground mb-2">{tr('neighborhood', 'Neighborhood')}</Text>
                    <Controller
                      control={control}
                      name="neighborhood"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder={tr('neighborhoodPlaceholder', 'Neighborhood')}
                          placeholderTextColor={placeholderColor}
                          className="h-11 px-4 rounded-xl bg-card text-foreground border border-border"
                          cursorColor="currentColor"
                        />
                      )}
                    />
                    {errors.neighborhood ? renderError(errors.neighborhood.message) : renderError()}
                  </View>

                  <View className="mb-5">
                    <Text className="text-sm text-foreground mb-2">{tr('crDocument', 'Commercial registration (PDF)')}</Text>
                    <Controller
                      control={control}
                      name="cr_pdf_url"
                      render={({ field: { value, onChange } }) => {
                        const fileName = value ? value.split('/').pop() : '';
                        return (
                          <View className="gap-2">
                            <Button
                              variant="outline"
                              className="w-full rounded-xl"
                              onPress={() => pickCrDocument(onChange)}
                            >
                              <Text className="text-foreground font-medium">
                                {value ? tr('changeFile', 'Change file') : tr('uploadFile', 'Upload PDF')}
                              </Text>
                            </Button>
                            <Text className="text-xs text-muted-foreground">
                              {fileName ? `${tr('selectedFile', 'Selected')}: ${fileName}` : tr('pdfOnly', 'PDF only')}
                            </Text>
                          </View>
                        );
                      }}
                    />
                    {errors.cr_pdf_url ? renderError(errors.cr_pdf_url.message) : renderError()}
                  </View>

                  <Button className="w-full rounded-xl mb-3" onPress={handleSubmit(handleRegister)}>
                    <Text className="text-primary-foreground font-medium">{t('signUp')}</Text>
                  </Button>

                  {/* <Button variant="outline" className="w-full rounded-xl mb-3" onPress={() => router.replace('/(tabs)')}>
                    <Text className="text-foreground font-medium">{t('continueAsGuest')}</Text>
                  </Button> */}

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
            {step === 'pending' && (
              <Card className="border border-border/60 rounded-2xl items-center">
                <CardContent className="py-6 w-full items-center">
                  <Icon as={CheckCircle2} size={56} className="text-primary mb-3" />
                  <Text className="text-xl font-semibold text-foreground mb-2">
                    {tr('registrationSubmitted', 'Registration submitted')}
                  </Text>
                  <Text className="text-center text-muted-foreground mb-6">
                    {tr('registrationPendingReview', 'Your company registration is pending review by support. We will notify you once approved.')}
                  </Text>
                  <Button className="w-full rounded-xl" onPress={() => router.replace('/login')}>
                    <Text className="text-primary-foreground font-medium">{tr('backToLogin', 'Back to login')}</Text>
                  </Button>
                </CardContent>
              </Card>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

