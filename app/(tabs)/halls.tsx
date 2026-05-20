import React from 'react';
import { View, FlatList, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Building2, Plus, MapPin, Users, Edit, Trash2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useCompanyHalls, useDeleteHall } from '@/hooks/api/useHalls';
import { router } from 'expo-router';
import type { Hall } from '@/types/hall';

function HallCard({
  hall,
  onEdit,
  onDelete,
  onToggle,
}: {
  hall: Hall;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Card className="mx-4 mb-3 overflow-hidden rounded-2xl border border-border/60">
      <CardContent className="py-4">
        <View className="mb-2 flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
              {hall.name}
            </Text>
            <View className="mt-1 flex-row items-center gap-1">
              <Icon as={MapPin} size={12} className="text-muted-foreground" />
              <Text className="text-xs text-muted-foreground">
                {hall.location}, {hall.city}
              </Text>
            </View>
          </View>
          <Pressable onPress={onToggle}>
            <Badge variant={hall.isAvailable ? 'default' : 'secondary'} className="px-2.5 py-1">
              <Text className="text-xs font-medium">
                {hall.isAvailable ? t('available') : t('unavailable')}
              </Text>
            </Badge>
          </Pressable>
        </View>

        <View className="mb-3 flex-row items-center gap-4">
          <View className="flex-row items-center gap-1.5">
            <Icon as={Users} size={14} className="text-muted-foreground" />
            <Text className="text-sm text-muted-foreground">
              {hall.capacity} {t('guests')}
            </Text>
          </View>
          <View className="flex-row items-baseline gap-1">
            <Text className="text-lg font-bold text-primary">
              {Number(hall.pricing ?? 0).toLocaleString()}
            </Text>
            <Text className="text-sm text-primary">SR/{t('perHour')}</Text>
          </View>
        </View>

        <View className="flex-row gap-2">
          <Button variant="outline" size="sm" className="flex-1 rounded-lg" onPress={onEdit}>
            <View className="flex-row items-center gap-1.5">
              <Icon as={Edit} size={14} className="text-foreground" />
              <Text className="text-sm text-foreground">{t('edit')}</Text>
            </View>
          </Button>
          <Button variant="outline" size="sm" className="rounded-lg px-3" onPress={onDelete}>
            <Icon as={Trash2} size={14} className="text-destructive" />
          </Button>
        </View>
      </CardContent>
    </Card>
  );
}

export default function HallsScreen() {
  const { t } = useTranslation();
  const { data, isLoading, refetch } = useCompanyHalls();
  const deleteMutation = useDeleteHall();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleEdit = (hallId: number) => {
    router.push(`/halls/${hallId}`);
  };

  const handleDelete = async (hallId: number) => {
    // TODO: Add confirmation dialog
    await deleteMutation.mutateAsync(hallId);
  };

  const handleToggle = async (_hallId: number, _currentStatus: boolean) => {
    // TODO: Implement toggle availability when API supports it
  };

  const renderHall = ({ item }: { item: Hall }) => (
    <HallCard
      hall={item}
      onEdit={() => handleEdit(item.id)}
      onDelete={() => handleDelete(item.id)}
      onToggle={() => handleToggle(item.id, item.isAvailable)}
    />
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Icon as={Building2} size={48} className="mb-4 text-muted-foreground" />
      <Text className="mb-1 text-lg font-semibold text-foreground">{t('noHallsYet')}</Text>
      <Text className="mb-6 px-8 text-center text-muted-foreground">{t('noHallsDescription')}</Text>
      <Button onPress={() => router.push('/halls/add')}>
        <View className="flex-row items-center gap-2">
          <Icon as={Plus} size={18} className="text-primary-foreground" />
          <Text className="font-medium text-primary-foreground">{t('addFirstHall')}</Text>
        </View>
      </Button>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pb-3 pt-4">
        <View>
          <Text className="text-2xl font-bold text-foreground">{t('myHalls')}</Text>
          <Text className="mt-0.5 text-sm text-muted-foreground">
            {data?.meta?.total ?? 0} {t('hallsTotal')}
          </Text>
        </View>
        <Button size="sm" className="rounded-lg" onPress={() => router.push('/halls/add')}>
          <View className="flex-row items-center gap-1.5">
            <Icon as={Plus} size={16} className="text-primary-foreground" />
            <Text className="font-medium text-primary-foreground">{t('add')}</Text>
          </View>
        </Button>
      </View>

      {isLoading && !data ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={data?.data ?? []}
          renderItem={renderHall}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 32, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </SafeAreaView>
  );
}
