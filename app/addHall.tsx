import React from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';
import { useAddHalls } from '@/hooks/api/useAddHalls';
const addHallSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  price_per_day: z.number().min(0),
  price_per_hour: z.number().min(0).optional(),
  capacity: z.number().min(0),
  address: z.string().min(3),
  city: z.string().min(2),
  original_price: z.number().min(0).optional(),
  services: z.array(z.string()),
  rules: z.array(z.string()),
  amenities: z.array(z.string()),
  images: z.array(z.string()),
});

type AddHallForm = z.infer<typeof addHallSchema>;

export default function AddHallScreen() {
  const { addHall } = useAddHalls();
  const { colorScheme } = useColorScheme();
  const placeholderColor = React.useMemo(() => {
    const isDark = (colorScheme ?? 'light') === 'dark';
    const hsl = isDark ? THEME.dark.mutedForeground : THEME.light.mutedForeground;
    const [h, s, l] = hsl.match(/\d+/g)?.map(Number) || [0, 0, 60];
    return `hsla(${h}, ${s}%, ${l}%, 0.8)`;
  }, [colorScheme]);

  const { control, handleSubmit, formState: { errors } } = useForm<AddHallForm>({
    resolver: zodResolver(addHallSchema),
    defaultValues: {
      name: '',
      description: '',
      price_per_day: 0,
      price_per_hour: undefined,
      capacity: 0,
      address: '',
      city: '',
      original_price: undefined,
      services: [],
      rules: [],
      amenities: [],
      images: [],
    },
  });

  const onSubmit: (data: AddHallForm) => void = (data) => {
    addHall(data);
    router.back();
  };

  const renderError = (message?: string) => (
    <View className="min-h-[16px] mt-1">
      <Text className={`text-xs ${message ? 'text-destructive' : 'text-transparent'}`}>
        {message || 'placeholder'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-5 pt-4 pb-6 gap-4">
            <View>
              <Text className="text-2xl font-semibold text-foreground">Add hall</Text>
              <Text className="text-muted-foreground text-sm">Create a new venue listing</Text>
            </View>

            <Card className="border border-border/60 rounded-2xl">
              <CardContent className="py-4">
                <View className="mb-4">
                  <Text className="text-sm text-foreground mb-2">Name</Text>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Hall name"
                        placeholderTextColor={placeholderColor}
                        className="h-11 px-4 rounded-xl bg-card text-foreground border border-border"
                      />
                    )}
                  />
                  {renderError(errors.name?.message)}
                </View>

                <View className="mb-4">
                  <Text className="text-sm text-foreground mb-2">Description</Text>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Describe the hall"
                        placeholderTextColor={placeholderColor}
                        className="min-h-20 px-4 py-3 rounded-xl bg-card text-foreground border border-border"
                        multiline
                      />
                    )}
                  />
                  {renderError(errors.description?.message)}
                </View>

                <View className="mb-4 flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-sm text-foreground mb-2">Capacity</Text>
                    <Controller
                      control={control}
                      name="capacity"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value?.toString() ?? ''}
                          onChangeText={(txt) => onChange(Number(txt) || 0)}
                          placeholder="0"
                          keyboardType="numeric"
                          placeholderTextColor={placeholderColor}
                          className="h-11 px-4 rounded-xl bg-card text-foreground border border-border"
                        />
                      )}
                    />
                    {renderError(errors.capacity?.message)}
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-foreground mb-2">Price per day (SAR)</Text>
                    <Controller
                      control={control}
                      name="price_per_day"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value?.toString() ?? ''}
                          onChangeText={(txt) => onChange(Number(txt) || 0)}
                          placeholder="0"
                          keyboardType="numeric"
                          placeholderTextColor={placeholderColor}
                          className="h-11 px-4 rounded-xl bg-card text-foreground border border-border"
                        />
                      )}
                    />
                    {renderError(errors.price_per_day?.message)}
                  </View>
                </View>

                <View className="mb-4 flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-sm text-foreground mb-2">Price per hour (SAR)</Text>
                    <Controller
                      control={control}
                      name="price_per_hour"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value?.toString() ?? ''}
                          onChangeText={(txt) => onChange(txt ? Number(txt) : undefined)}
                          placeholder="Optional"
                          keyboardType="numeric"
                          placeholderTextColor={placeholderColor}
                          className="h-11 px-4 rounded-xl bg-card text-foreground border border-border"
                        />
                      )}
                    />
                    {renderError(errors.price_per_hour?.message)}
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-foreground mb-2">Original price (SAR)</Text>
                    <Controller
                      control={control}
                      name="original_price"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value?.toString() ?? ''}
                          onChangeText={(txt) => onChange(txt ? Number(txt) : undefined)}
                          placeholder="Optional"
                          keyboardType="numeric"
                          placeholderTextColor={placeholderColor}
                          className="h-11 px-4 rounded-xl bg-card text-foreground border border-border"
                        />
                      )}
                    />
                    {renderError(errors.original_price?.message)}
                  </View>
                </View>

                <View className="mb-4 flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-sm text-foreground mb-2">Address</Text>
                    <Controller
                      control={control}
                      name="address"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          placeholder="Street address"
                          placeholderTextColor={placeholderColor}
                          className="h-11 px-4 rounded-xl bg-card text-foreground border border-border"
                        />
                      )}
                    />
                    {renderError(errors.address?.message)}
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-foreground mb-2">City</Text>
                    <Controller
                      control={control}
                      name="city"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          placeholder="City"
                          placeholderTextColor={placeholderColor}
                          className="h-11 px-4 rounded-xl bg-card text-foreground border border-border"
                        />
                      )}
                    />
                    {renderError(errors.city?.message)}
                  </View>
                </View>

           

                <View className="mb-4">
                  <Text className="text-sm text-foreground mb-2">Services (comma separated)</Text>
                  <Controller
                    control={control}
                    name="services"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value.join(', ')}
                        onChangeText={(txt) =>
                          onChange(
                            txt
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean)
                          )
                        }
                        placeholder="Catering, DJ, Photography"
                        placeholderTextColor={placeholderColor}
                        className="h-11 px-4 rounded-xl bg-card text-foreground border border-border"
                      />
                    )}
                  />
                  {renderError(errors.services?.message)}
                </View>

                <View className="mb-4">
                  <Text className="text-sm text-foreground mb-2">Amenities (comma separated)</Text>
                  <Controller
                    control={control}
                    name="amenities"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value.join(', ')}
                        onChangeText={(txt) =>
                          onChange(
                            txt
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean)
                          )
                        }
                        placeholder="Parking, AV, Stage"
                        placeholderTextColor={placeholderColor}
                        className="h-11 px-4 rounded-xl bg-card text-foreground border border-border"
                      />
                    )}
                  />
                  {renderError(errors.amenities?.message)}
                </View>

                <View className="mb-4">
                  <Text className="text-sm text-foreground mb-2">Rules (comma separated)</Text>
                  <Controller
                    control={control}
                    name="rules"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value.join(', ')}
                        onChangeText={(txt) =>
                          onChange(
                            txt
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean)
                          )
                        }
                        placeholder="No smoking, No pets"
                        placeholderTextColor={placeholderColor}
                        className="h-11 px-4 rounded-xl bg-card text-foreground border border-border"
                      />
                    )}
                  />
                  {renderError(errors.rules?.message)}
                </View>

                <Button className="w-full rounded-xl" onPress={handleSubmit(onSubmit)}>
                  <Text className="text-primary-foreground font-medium">Save hall</Text>
                </Button>
              </CardContent>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}