import React, { useMemo, useState } from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, AlertCircle } from 'lucide-react-native';
import { THEME } from '@/lib/theme';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateHall } from '@/hooks/api/useHalls';
import { getErrorMessage } from '@/utils/api';
import { Alert as AlertComponent, AlertDescription, AlertTitle } from '@/components/ui/alert';

const hallSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  location: z.string().min(2, 'Location is required'),
  city: z.string().min(2, 'City is required'),
  address: z.string().min(3, 'Address is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  pricing: z.number().min(0, 'Pricing must be a positive number'),
  description: z.string().optional(),
  isAvailable: z.boolean(),
});

type HallFormData = z.infer<typeof hallSchema>;

export default function AddHallScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();
  const createHallMutation = useCreateHall();
  const [serverError, setServerError] = useState<string | null>(null);
  const [servicesText, setServicesText] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<HallFormData>({
    resolver: zodResolver(hallSchema),
    defaultValues: {
      name: '',
      location: '',
      city: '',
      capacity: 100,
      pricing: 0,
      description: '',
      address: '',
      isAvailable: true,
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

  const handleCreate = async (data: HallFormData) => {
    setServerError(null);

    const services = servicesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      await createHallMutation.mutateAsync({
        ...data,
        services: services.length > 0 ? services : undefined,
      });
      router.back();
    } catch (error) {
      setServerError(getErrorMessage(error));
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
            {/* Header */}
            <View className="mb-6 flex-row items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 rounded-full"
                onPress={() => router.back()}>
                <Icon as={ArrowLeft} size={18} className="text-foreground" />
              </Button>
              <Text className="text-xl font-semibold text-foreground">{t('addHall')}</Text>
            </View>

            <Card className="rounded-2xl border border-border/60">
              <CardContent className="py-4">
                {serverError && (
                  <View className="mb-3">
                    <AlertComponent variant="destructive" icon={AlertCircle}>
                      <AlertTitle>{t('error')}</AlertTitle>
                      <AlertDescription>{serverError}</AlertDescription>
                    </AlertComponent>
                  </View>
                )}

                {/* Hall Name */}
                <View className="mb-3">
                  <Text className="mb-2 text-sm text-foreground">{t('hallName')} *</Text>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={t('hallNamePlaceholder')}
                        placeholderTextColor={placeholderColor}
                        editable={!createHallMutation.isPending}
                        className="h-11 rounded-xl border border-border bg-card px-4 text-foreground"
                        cursorColor="currentColor"
                      />
                    )}
                  />
                  {errors.name && renderError(errors.name.message)}
                </View>

                {/* Location */}
                <View className="mb-3">
                  <Text className="mb-2 text-sm text-foreground">{t('location')} *</Text>
                  <Controller
                    control={control}
                    name="location"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={t('locationPlaceholder')}
                        placeholderTextColor={placeholderColor}
                        editable={!createHallMutation.isPending}
                        className="h-11 rounded-xl border border-border bg-card px-4 text-foreground"
                        cursorColor="currentColor"
                      />
                    )}
                  />
                  {errors.location && renderError(errors.location.message)}
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
                        editable={!createHallMutation.isPending}
                        className="h-11 rounded-xl border border-border bg-card px-4 text-foreground"
                        cursorColor="currentColor"
                      />
                    )}
                  />
                  {errors.city && renderError(errors.city.message)}
                </View>

                {/* Capacity & Pricing Row */}
                <View className="mb-3 flex-row gap-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-sm text-foreground">{t('capacity')} *</Text>
                    <Controller
                      control={control}
                      name="capacity"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          value={value?.toString() ?? ''}
                          onChangeText={(text) => onChange(parseInt(text) || 0)}
                          onBlur={onBlur}
                          placeholder="100"
                          placeholderTextColor={placeholderColor}
                          keyboardType="number-pad"
                          editable={!createHallMutation.isPending}
                          className="h-11 rounded-xl border border-border bg-card px-4 text-foreground"
                          cursorColor="currentColor"
                        />
                      )}
                    />
                    {errors.capacity && renderError(errors.capacity.message)}
                  </View>
                  <View className="flex-1">
                    <Text className="mb-2 text-sm text-foreground">{t('priceSR')} *</Text>
                    <Controller
                      control={control}
                      name="pricing"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          value={value?.toString() ?? ''}
                          onChangeText={(text) => onChange(parseInt(text) || 0)}
                          onBlur={onBlur}
                          placeholder="5000"
                          placeholderTextColor={placeholderColor}
                          keyboardType="number-pad"
                          editable={!createHallMutation.isPending}
                          className="h-11 rounded-xl border border-border bg-card px-4 text-foreground"
                          cursorColor="currentColor"
                        />
                      )}
                    />
                    {errors.pricing && renderError(errors.pricing.message)}
                  </View>
                </View>

                {/* Description */}
                <View className="mb-3">
                  <Text className="mb-2 text-sm text-foreground">{t('details')}</Text>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={t('descriptionPlaceholder')}
                        placeholderTextColor={placeholderColor}
                        multiline
                        numberOfLines={4}
                        editable={!createHallMutation.isPending}
                        className="h-24 rounded-xl border border-border bg-card px-4 py-3 text-foreground"
                        textAlignVertical="top"
                        cursorColor="currentColor"
                      />
                    )}
                  />
                </View>

                {/* Address */}
                <View className="mb-3">
                  <Text className="mb-2 text-sm text-foreground">{t('address')} *</Text>
                  <Controller
                    control={control}
                    name="address"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={t('addressPlaceholder')}
                        placeholderTextColor={placeholderColor}
                        editable={!createHallMutation.isPending}
                        className="h-11 rounded-xl border border-border bg-card px-4 text-foreground"
                        cursorColor="currentColor"
                      />
                    )}
                  />
                  {errors.address && renderError(errors.address.message)}
                </View>

                {/* Services */}
                <View className="mb-3">
                  <Text className="mb-2 text-sm text-foreground">{t('services')}</Text>
                  <TextInput
                    value={servicesText}
                    onChangeText={setServicesText}
                    placeholder={t('servicesPlaceholder')}
                    placeholderTextColor={placeholderColor}
                    editable={!createHallMutation.isPending}
                    className="h-11 rounded-xl border border-border bg-card px-4 text-foreground"
                    cursorColor="currentColor"
                  />
                  <View className="mt-1 min-h-[18px]">
                    <Text className="text-xs text-muted-foreground">{t('servicesHint')}</Text>
                  </View>
                </View>

                {/* Availability Toggle */}
                <View className="mb-4 flex-row items-center justify-between py-3">
                  <View>
                    <Text className="font-medium text-foreground">{t('available')}</Text>
                    <Text className="text-xs text-muted-foreground">{t('availableToggle')}</Text>
                  </View>
                  <Controller
                    control={control}
                    name="isAvailable"
                    render={({ field: { onChange, value } }) => (
                      <Switch
                        checked={value}
                        onCheckedChange={onChange}
                        disabled={createHallMutation.isPending}
                      />
                    )}
                  />
                </View>

                <Button
                  className="w-full rounded-xl"
                  onPress={handleSubmit(handleCreate)}
                  disabled={createHallMutation.isPending}>
                  <Text className="font-medium text-primary-foreground">
                    {createHallMutation.isPending ? t('creating') : t('addHall')}
                  </Text>
                </Button>
              </CardContent>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
