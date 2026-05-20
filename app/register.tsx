import React, { useMemo, useState } from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useColorScheme } from 'nativewind';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ArrowLeft, AlertCircle } from 'lucide-react-native';
import { THEME } from '@/lib/theme';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/auth-context';
import { companyRegisterSchema, type RegisterFormData } from '@/types/auth';
import { getErrorMessage } from '@/utils/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function RegisterScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(companyRegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      companyName: '',
      city: '',
      registrationNumber: '',
      registrationNumberPdf: '',
      businessAddress: '',
      contactPerson: '',
    },
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

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      await register(data);
      // After registration, user goes to pending screen (handled by tabs layout)
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
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="flex-1 px-5 pb-6 pt-4">
            <View className="mb-6 flex-row items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 rounded-full"
                onPress={() => router.back()}>
                <Icon as={ArrowLeft} size={18} className="text-foreground" />
              </Button>
              <Text className="text-xl font-semibold text-foreground">{t('companyRegister')}</Text>
            </View>

            <View className="mb-4">
              <Text className="mt-1 text-sm text-muted-foreground">
                {t('companyRegisterDescription')}
              </Text>
            </View>

            <Card className="rounded-2xl border border-border/60">
              <CardContent className="py-4">
                {serverError && (
                  <View className="mb-3">
                    <Alert variant="destructive" icon={AlertCircle}>
                      <AlertTitle>{t('registerError')}</AlertTitle>
                      <AlertDescription>{serverError}</AlertDescription>
                    </Alert>
                  </View>
                )}

                {/* Company Name */}
                <View className="mb-3">
                  <Text className="mb-2 text-sm text-foreground">{t('companyName')} *</Text>
                  <Controller
                    control={control}
                    name="companyName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={t('companyNamePlaceholder')}
                        placeholderTextColor={placeholderColor}
                        editable={!isLoading}
                        className="h-11 rounded-xl border border-border bg-card px-4 text-foreground"
                        cursorColor="currentColor"
                      />
                    )}
                  />
                  {errors.companyName && renderError(errors.companyName.message)}
                </View>

                {/* Email */}
                <View className="mb-3">
                  <Text className="mb-2 text-sm text-foreground">{t('email')} *</Text>
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
                  {errors.email && renderError(errors.email.message)}
                </View>

                {/* Password */}
                <View className="mb-3">
                  <Text className="mb-2 text-sm text-foreground">{t('password')} *</Text>
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
                  {errors.password && renderError(errors.password.message)}
                </View>

                {/* City */}
                <View className="mb-3">
                  <Text className="mb-2 text-sm text-foreground">{t('city')} *</Text>
                  <Controller
                    control={control}
                    name="city"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={t('cityPlaceholder')}
                        placeholderTextColor={placeholderColor}
                        editable={!isLoading}
                        className="h-11 rounded-xl border border-border bg-card px-4 text-foreground"
                        cursorColor="currentColor"
                      />
                    )}
                  />
                  {errors.city && renderError(errors.city.message)}
                </View>

                {/* Registration Number (CR) */}
                <View className="mb-3">
                  <Text className="mb-2 text-sm text-foreground">{t('registrationNumber')} *</Text>
                  <Controller
                    control={control}
                    name="registrationNumber"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={t('registrationNumberPlaceholder')}
                        placeholderTextColor={placeholderColor}
                        editable={!isLoading}
                        className="h-11 rounded-xl border border-border bg-card px-4 text-foreground"
                        cursorColor="currentColor"
                      />
                    )}
                  />
                  {errors.registrationNumber && renderError(errors.registrationNumber.message)}
                </View>

                {/* Registration Number PDF */}
                <View className="mb-3">
                  <Text className="mb-2 text-sm text-foreground">
                    {t('registrationNumberPdf')} *
                  </Text>
                  <Controller
                    control={control}
                    name="registrationNumberPdf"
                    render={({ field: { onChange, value } }) => (
                      <View>
                        <Button
                          variant="outline"
                          className="h-11 rounded-xl border-border"
                          onPress={async () => {
                            try {
                              const result = await DocumentPicker.getDocumentAsync({
                                type: ['application/pdf'],
                                copyToCacheDirectory: true,
                              });
                              if (!result.canceled && result.assets?.[0]) {
                                onChange(result.assets[0].uri);
                              }
                            } catch {
                              // User cancelled or error
                            }
                          }}
                          disabled={isLoading}>
                          <Text className={value ? 'text-foreground' : 'text-muted-foreground'}>
                            {value
                              ? `${t('fileSelected')}: ${value.split('/').pop()}`
                              : t('selectFile')}
                          </Text>
                        </Button>
                      </View>
                    )}
                  />
                  {errors.registrationNumberPdf &&
                    renderError(errors.registrationNumberPdf.message)}
                </View>

                {/* Business Address */}
                <View className="mb-3">
                  <Text className="mb-2 text-sm text-foreground">{t('businessAddress')} *</Text>
                  <Controller
                    control={control}
                    name="businessAddress"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={t('businessAddressPlaceholder')}
                        placeholderTextColor={placeholderColor}
                        editable={!isLoading}
                        className="h-11 rounded-xl border border-border bg-card px-4 text-foreground"
                        cursorColor="currentColor"
                      />
                    )}
                  />
                  {errors.businessAddress && renderError(errors.businessAddress.message)}
                </View>

                {/* Contact Person (Optional) */}
                <View className="mb-3">
                  <Text className="mb-2 text-sm text-foreground">{t('contactPerson')}</Text>
                  <Controller
                    control={control}
                    name="contactPerson"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={t('contactPersonPlaceholder')}
                        placeholderTextColor={placeholderColor}
                        editable={!isLoading}
                        className="h-11 rounded-xl border border-border bg-card px-4 text-foreground"
                        cursorColor="currentColor"
                      />
                    )}
                  />
                </View>

                <Button
                  className="mb-3 w-full rounded-xl"
                  onPress={handleSubmit(handleRegister)}
                  disabled={isLoading}>
                  <Text className="font-medium text-primary-foreground">
                    {isLoading ? t('registering') : t('createAccount')}
                  </Text>
                </Button>

                <View className="items-center">
                  <Text className="text-sm text-muted-foreground">
                    {t('haveAccount')}{' '}
                    <Link href="/login" replace>
                      <Text className="font-medium text-primary">{t('login')}</Text>
                    </Link>
                  </Text>
                </View>
              </CardContent>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
