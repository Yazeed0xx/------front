import React from 'react';
import { View, ScrollView, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Building2, Calendar, Clock, Bell, Plus, ChevronRight, Users } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth-context';
import { useCompanyHalls } from '@/hooks/api/useHalls';
import { useBookingStats, usePendingBookings } from '@/hooks/api/useBookings';
import { useUnreadCount } from '@/hooks/api/useNotifications';
import { router } from 'expo-router';
import { BOOKING_STATUS_COLORS } from '@/types/booking';

function StatCard({
  icon: IconComponent,
  label,
  value,
  iconColor = 'text-primary',
}: {
  icon: typeof Building2;
  label: string;
  value: string | number;
  iconColor?: string;
}) {
  return (
    <Card className="flex-1 rounded-xl border border-border/60">
      <CardContent className="px-3 py-3">
        <View className="mb-1 flex-row items-center gap-2">
          <Icon as={IconComponent} size={16} className={iconColor} />
          <Text className="text-xs text-muted-foreground">{label}</Text>
        </View>
        <Text className="text-xl font-bold text-foreground">{value}</Text>
      </CardContent>
    </Card>
  );
}

export default function DashboardScreen() {
  const { company } = useAuth();
  const { t } = useTranslation();

  const { data: hallsData, isLoading: hallsLoading, refetch: refetchHalls } = useCompanyHalls(1, 5);
  const { data: bookingStats, isLoading: statsLoading, refetch: refetchStats } = useBookingStats();
  const {
    data: pendingData,
    isLoading: pendingLoading,
    refetch: refetchPending,
  } = usePendingBookings(1, 3);
  const { data: unreadCount } = useUnreadCount();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchHalls(), refetchStats(), refetchPending()]);
    setRefreshing(false);
  };

  const isLoading = hallsLoading || statsLoading || pendingLoading;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className="px-5 pb-6 pt-4">
          {/* Header */}
          <View className="mb-6 flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-muted-foreground">{t('welcomeBack')}</Text>
              <Text className="text-xl font-bold text-foreground">
                {company?.companyProfile?.companyName || company?.companyName || t('company')}
              </Text>
            </View>
            <Pressable className="relative" onPress={() => router.push('/notifications')}>
              <View className="h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <Icon as={Bell} size={20} className="text-foreground" />
              </View>
              {unreadCount != null && unreadCount > 0 && (
                <View className="absolute -right-1 -top-1 h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1">
                  <Text className="text-[10px] font-bold text-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Stats Row */}
          <View className="mb-6 flex-row gap-3">
            <StatCard
              icon={Building2}
              label={t('totalHalls')}
              value={hallsData?.meta?.total ?? 0}
              iconColor="text-primary"
            />
            <StatCard
              icon={Calendar}
              label={t('totalBookings')}
              value={bookingStats?.totalCount ?? 0}
              iconColor="text-green-600"
            />
            <StatCard
              icon={Clock}
              label={t('pending')}
              value={bookingStats?.pendingCount ?? 0}
              iconColor="text-amber-600"
            />
          </View>

          {/* Quick Actions */}
          <View className="mb-6 flex-row gap-3">
            <Button className="h-12 flex-1 rounded-xl" onPress={() => router.push('/halls/add')}>
              <View className="flex-row items-center gap-2">
                <Icon as={Plus} size={18} className="text-primary-foreground" />
                <Text className="font-medium text-primary-foreground">{t('addHall')}</Text>
              </View>
            </Button>
            <Button
              variant="outline"
              className="h-12 flex-1 rounded-xl"
              onPress={() => router.push('/(tabs)/myBooking')}>
              <View className="flex-row items-center gap-2">
                <Icon as={Calendar} size={18} className="text-foreground" />
                <Text className="font-medium text-foreground">{t('viewBookings')}</Text>
              </View>
            </Button>
          </View>

          {/* Pending Bookings */}
          <View className="mb-6">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-base font-semibold text-foreground">
                {t('pendingRequests')}
              </Text>
              {(pendingData?.meta?.total ?? 0) > 0 && (
                <Pressable
                  className="flex-row items-center gap-1"
                  onPress={() => router.push('/(tabs)/myBooking')}>
                  <Text className="text-sm text-primary">{t('viewAll')}</Text>
                  <Icon as={ChevronRight} size={14} className="text-primary" />
                </Pressable>
              )}
            </View>

            {pendingData?.data && pendingData.data.length > 0 ? (
              <View className="gap-2">
                {pendingData.data.map((booking) => (
                  <Card key={booking.id} className="rounded-xl border border-border/60">
                    <CardContent className="py-3">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className="font-medium text-foreground" numberOfLines={1}>
                            {booking.hall?.name ?? ''}
                          </Text>
                          <View className="mt-1 flex-row items-center gap-3">
                            <View className="flex-row items-center gap-1">
                              <Icon as={Calendar} size={12} className="text-muted-foreground" />
                              <Text className="text-xs text-muted-foreground">
                                {booking.bookingDate}
                              </Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                              <Icon as={Users} size={12} className="text-muted-foreground" />
                              <Text className="text-xs text-muted-foreground">
                                {booking.user?.userName ?? ''}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <Badge
                          variant="outline"
                          className={`${BOOKING_STATUS_COLORS[booking.status]?.bg ?? ''} ${BOOKING_STATUS_COLORS[booking.status]?.text ?? ''}`}>
                          <Text className="text-xs">{t(booking.status)}</Text>
                        </Badge>
                      </View>
                    </CardContent>
                  </Card>
                ))}
              </View>
            ) : (
              <Card className="rounded-xl border border-border/60">
                <CardContent className="items-center py-8">
                  <Icon as={Calendar} size={32} className="mb-2 text-muted-foreground" />
                  <Text className="text-sm text-muted-foreground">{t('noPendingBookings')}</Text>
                </CardContent>
              </Card>
            )}
          </View>

          {/* My Halls Preview */}
          <View>
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-base font-semibold text-foreground">{t('myHalls')}</Text>
              {(hallsData?.meta?.total ?? 0) > 0 && (
                <Pressable
                  className="flex-row items-center gap-1"
                  onPress={() => router.push('/(tabs)/halls')}>
                  <Text className="text-sm text-primary">{t('viewAll')}</Text>
                  <Icon as={ChevronRight} size={14} className="text-primary" />
                </Pressable>
              )}
            </View>

            {hallsData?.data && hallsData.data.length > 0 ? (
              <View className="gap-2">
                {hallsData.data.slice(0, 3).map((hall) => (
                  <Pressable key={hall.id} onPress={() => router.push(`/halls/${hall.id}`)}>
                    <Card className="rounded-xl border border-border/60">
                      <CardContent className="py-3">
                        <View className="flex-row items-center justify-between">
                          <View className="flex-1">
                            <Text className="font-medium text-foreground" numberOfLines={1}>
                              {hall.name}
                            </Text>
                            <Text className="mt-0.5 text-xs text-muted-foreground">
                              {hall.location}, {hall.city}
                            </Text>
                          </View>
                          <View className="items-end">
                            <Text className="font-semibold text-primary">
                              {Number(hall.pricing ?? 0).toLocaleString()} SR/{t('perHour')}
                            </Text>
                            <Badge
                              variant={hall.isAvailable ? 'default' : 'secondary'}
                              className="mt-1">
                              <Text className="text-[10px]">
                                {hall.isAvailable ? t('available') : t('unavailable')}
                              </Text>
                            </Badge>
                          </View>
                        </View>
                      </CardContent>
                    </Card>
                  </Pressable>
                ))}
              </View>
            ) : (
              <Card className="rounded-xl border border-border/60">
                <CardContent className="items-center py-8">
                  <Icon as={Building2} size={32} className="mb-2 text-muted-foreground" />
                  <Text className="mb-3 text-sm text-muted-foreground">{t('noHallsYet')}</Text>
                  <Button size="sm" onPress={() => router.push('/halls/add')}>
                    <Text className="text-primary-foreground">{t('addFirstHall')}</Text>
                  </Button>
                </CardContent>
              </Card>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
