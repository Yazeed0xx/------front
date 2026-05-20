import React, { useState } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  Bell,
  ArrowLeft,
  Calendar,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { useNotifications, useMarkAsRead } from '@/hooks/api/useNotifications';
import type { Notification } from '@/types/notification';

const notificationIcons: Record<string, typeof Bell> = {
  new_booking_request: Calendar,
  booking_created: Calendar,
  company_approved: CheckCircle,
  company_rejected: XCircle,
  booking_cancelled: Clock,
  default: Bell,
};

function NotificationItem({
  notification,
  onPress,
}: {
  notification: Notification;
  onPress: () => void;
}) {
  const IconComponent = notificationIcons[notification.type] || notificationIcons.default;
  const isUnread = !notification.readAt;

  return (
    <Pressable onPress={onPress}>
      <Card
        className={`mx-4 mb-2 overflow-hidden rounded-xl border ${isUnread ? 'border-primary/30 bg-primary/5' : 'border-border/60'}`}>
        <CardContent className="py-3">
          <View className="flex-row items-start gap-3">
            <View
              className={`h-10 w-10 items-center justify-center rounded-full ${isUnread ? 'bg-primary/10' : 'bg-secondary'}`}>
              <Icon
                as={IconComponent}
                size={18}
                className={isUnread ? 'text-primary' : 'text-muted-foreground'}
              />
            </View>
            <View className="flex-1">
              <View className="mb-0.5 flex-row items-center gap-2">
                <Text
                  className={`flex-1 font-medium text-foreground ${isUnread ? 'font-semibold' : ''}`}
                  numberOfLines={1}>
                  {notification.title}
                </Text>
                {isUnread && <View className="h-2 w-2 rounded-full bg-primary" />}
              </View>
              <Text className="text-sm text-muted-foreground" numberOfLines={2}>
                {notification.message}
              </Text>
              <View className="mt-1.5 flex-row items-center gap-1">
                <Icon as={Clock} size={10} className="text-muted-foreground" />
                <Text className="text-xs text-muted-foreground">
                  {formatTimeAgo(notification.createdAt)}
                </Text>
              </View>
            </View>
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function EmptyState() {
  const { t } = useTranslation();
  return (
    <View className="flex-1 items-center justify-center py-20">
      <Icon as={Bell} size={48} className="mb-4 text-muted-foreground" />
      <Text className="mb-1 text-lg font-semibold text-foreground">{t('noNotifications')}</Text>
      <Text className="px-8 text-center text-muted-foreground">
        You'll see notifications about bookings and updates here
      </Text>
    </View>
  );
}

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useNotifications();
  const markAsReadMutation = useMarkAsRead();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.readAt) {
      await markAsReadMutation.mutateAsync(notification.id);
    }

    // Navigate based on notification type and data
    if (notification.data?.bookingId) {
      router.push('/(tabs)/myBooking');
    } else if ((notification.data as any)?.hallId) {
      router.push(`/halls/${(notification.data as any).hallId}`);
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <NotificationItem notification={item} onPress={() => handleNotificationPress(item)} />
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center gap-3 px-5 pb-3 pt-4">
        <Button variant="ghost" size="icon" className="rounded-full" onPress={() => router.back()}>
          <Icon as={ArrowLeft} size={20} className="text-foreground" />
        </Button>
        <Text className="text-xl font-bold text-foreground">{t('notifications')}</Text>
      </View>

      {isLoading && !data ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={data?.data ?? []}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 32, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyState}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </SafeAreaView>
  );
}
