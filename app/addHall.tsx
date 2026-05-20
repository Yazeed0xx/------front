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
import { useCreateHall } from '@/hooks/api/useHalls';

const addHallSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3).optional(),
  capacity: z.number().min(1),
  location: z.string().min(3),
  pricing: z.number().min(0),
  address: z.string().min(3),
  city: z.string().min(2),
  services: z.array(z.string()).optional(),
});

type AddHallForm = z.infer<typeof addHallSchema>;

export default function AddHallScreen() {
  const { mutate: addHall, isPending } = useCreateHall();
  const { colorScheme } = useColorScheme();
  const placeholderColor = React.useMemo(() => {
    const isDark = (colorScheme ?? 'light') === 'dark';
    const hsl = isDark ? THEME.dark.mutedForeground : THEME.light.mutedForeground;
    const [h, s, l] = hsl.match(/\d+/g)?.map(Number) || [0, 0, 60];
    return `hsla(${h}, ${s}%, ${l}%, 0.8)`;
  }, [colorScheme]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddHallForm>({
    resolver: zodResolver(addHallSchema),
    defaultValues: {
      name: '',
      description: '',
      capacity: 0,
      location: '',
      pricing: 0,
      address: '',
      city: '',
      services: [],
    },
  });

  const onSubmit = (data: AddHallForm) => {
    addHall({ ...data, isAvailable: true }, { onSuccess: () => router.back() });
  };

  const renderError = (message?: string) => (
    <View className="mt-1 min-h-[16px]">
      <Text className={`text-xs ${message ? 'text-destructive' : 'text-transparent'}`}>
        {message || 'placeholder'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled">
          <View className="flex-1 gap-4 px-5 pb-6 pt-4">
            <View>
              <Text className="text-2xl font-semibold text-foreground">Add hall</Text>
              <Text className="text-sm text-muted-foreground">Create a new venue listing</Text>
            </View>

            <Card className="rounded-2xl border border-border/60 bg-red-800">
              <CardContent className="py-4">
                <View className="mb-4">
                  <Text className="mb-2 text-sm text-foreground">Name</Text>
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
                        className="h-11 rounded-xl border border-border bg-card px-4 text-foreground"
                      />
                    )}
                  />
                  {renderError(errors.name?.message)}
                </View>

                <View className="mb-4">
                  <Text className="mb-2 text-sm text-foreground">Description</Text>
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
                        className="min-h-20 rounded-xl border border-border bg-card px-4 py-3 text-foreground"
                        multiline
                      />
                    )}
                  />
                  {renderError(errors.description?.message)}
                </View>

                <View className="mb-4 flex-row gap-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-sm text-foreground">Capacity</Text>
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
                          className="h-11 rounded-xl border border-border bg-card px-4 text-foreground"
                        />
                      )}
                    />
                    {renderError(errors.capacity?.message)}
                  </View>
                  <View className="flex-1">
                    <Text className="mb-2 text-sm text-foreground">Pricing (SAR)</Text>
                    <Controller
                      control={control}
                      name="pricing"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value?.toString() ?? ''}
                          onChangeText={(txt) => onChange(Number(txt) || 0)}
                          placeholder="0"
                          keyboardType="numeric"
                          placeholderTextColor={placeholderColor}
                          className="h-11 rounded-xl border border-border bg-card px-4 text-foreground"
                        />
                      )}
                    />
                    {renderError(errors.pricing?.message)}
                  </View>
                </View>

                <View className="mb-4">
                  <Text className="mb-2 text-sm text-foreground">Location</Text>
                  <Controller
                    control={control}
                    name="location"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="e.g. Downtown"
                        placeholderTextColor={placeholderColor}
                        className="h-11 rounded-xl border border-border bg-card px-4 text-foreground"
                      />
                    )}
                  />
                  {renderError(errors.location?.message)}
                </View>

                <View className="mb-4 flex-row gap-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-sm text-foreground">Address</Text>
                    <Controller
                      control={control}
                      name="address"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          placeholder="Street address"
                          placeholderTextColor={placeholderColor}
                          className="h-11 rounded-xl border border-border bg-card px-4 text-foreground"
                        />
                      )}
                    />
                    {renderError(errors.address?.message)}
                  </View>
                  <View className="flex-1">
                    <Text className="mb-2 text-sm text-foreground">City</Text>
                    <Controller
                      control={control}
                      name="city"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          placeholder="City"
                          placeholderTextColor={placeholderColor}
                          className="h-11 rounded-xl border border-border bg-card px-4 text-foreground"
                        />
                      )}
                    />
                    {renderError(errors.city?.message)}
                  </View>
                </View>

                <View className="mb-4">
                  <Text className="mb-2 text-sm text-foreground">Services (comma separated)</Text>
                  <Controller
                    control={control}
                    name="services"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={(value ?? []).join(', ')}
                        onChangeText={(txt) =>
                          onChange(
                            txt
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean)
                          )
                        }
                        placeholder="e.g. free coffee, valet parking"
                        placeholderTextColor={placeholderColor}
                        className="h-11 rounded-xl border border-border bg-card px-4 text-foreground"
                      />
                    )}
                  />
                  {renderError(errors.services?.message)}
                </View>

                <Button
                  className="w-full rounded-xl"
                  onPress={handleSubmit(onSubmit)}
                  disabled={isPending}>
                  <Text className="font-medium text-primary-foreground">
                    {isPending ? 'Saving...' : 'Save hall'}
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
