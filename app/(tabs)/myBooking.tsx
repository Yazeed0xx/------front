import React, { useState } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Calendar, Users, MapPin, Check, X, Clock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useCompanyBookings, useAcceptBooking, useRejectBooking } from '@/hooks/api/useBookings';
import type { Booking } from '@/types/booking';
import { BOOKING_STATUS_COLORS } from '@/types/booking';

type TabType = 'pending' | 'accepted' | 'rejected';

function BookingCard({
  booking,
  onAccept,
  onReject,
  isAccepting,
  isRejecting,
}: {
  booking: Booking;
  onAccept: () => void;
  onReject: () => void;
  isAccepting: boolean;
  isRejecting: boolean;
}) {
  const { t } = useTranslation();
  const isPending = booking.status === 'pending';
  const statusColor = BOOKING_STATUS_COLORS[booking.status];

  return (
    <Card className="mx-4 mb-3 overflow-hidden rounded-2xl border border-border/60">
      <CardContent className="py-4">
        {/* Header */}
        <View className="mb-3 flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
              {booking.hall?.name ?? ''}
            </Text>
            <View className="mt-1 flex-row items-center gap-1">
              <Icon as={MapPin} size={12} className="text-muted-foreground" />
              <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                {booking.hall?.location ?? ''}, {booking.hall?.city ?? ''}
              </Text>
            </View>
          </View>
          <Badge
            variant="outline"
            className={`${statusColor?.bg ?? ''} ${statusColor?.text ?? ''} px-2.5 py-1`}>
            <Text className="text-[11px] font-medium">{t(booking.status)}</Text>
          </Badge>
        </View>

        {/* Customer Info */}
        <View className="mb-3 rounded-lg bg-secondary/40 px-3 py-2">
          <View className="flex-row items-center gap-2">
            <Icon as={Users} size={14} className="text-muted-foreground" />
            <Text className="text-sm font-medium text-foreground">
              {booking.user?.userName ?? ''}
            </Text>
          </View>
          <Text className="ml-5 mt-0.5 text-xs text-muted-foreground">
            {booking.user?.email ?? ''}
          </Text>
        </View>

        {/* Booking Details */}
        <View className="mb-3 flex-row flex-wrap gap-x-4 gap-y-2">
          <View className="flex-row items-center gap-1.5">
            <Icon as={Calendar} size={14} className="text-primary" />
            <Text className="text-sm text-foreground">{booking.bookingDate}</Text>
          </View>
          {booking.startTime && booking.endTime && (
            <View className="flex-row items-center gap-1.5">
              <Icon as={Clock} size={14} className="text-primary" />
              <Text className="text-sm text-foreground">
                {booking.startTime.slice(0, 5)} - {booking.endTime.slice(0, 5)}
              </Text>
            </View>
          )}
        </View>

        {/* Special Requests */}
        {booking.specialRequests && (
          <View className="mb-3 rounded-lg bg-muted/30 px-3 py-2">
            <Text className="text-xs text-muted-foreground">{booking.specialRequests}</Text>
          </View>
        )}

        {/* Footer */}
        <View className="gap-3 border-t border-border/40 pt-3">
          <View>
            <Text className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {t('total')}
            </Text>
            <View className="flex-row items-baseline gap-1">
              <Text className="text-lg font-bold text-primary">
                {Number(booking.totalPrice ?? 0).toLocaleString()}
              </Text>
              <Text className="text-sm font-medium text-primary">SR</Text>
            </View>
          </View>
          {isPending && (
            <View className="flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-lg border-destructive"
                onPress={onReject}
                disabled={isAccepting || isRejecting}>
                <View className="flex-row items-center gap-1.5">
                  <Icon as={X} size={14} className="text-destructive" />
                  <Text className="text-sm text-destructive">
                    {isRejecting ? '...' : t('reject')}
                  </Text>
                </View>
              </Button>
              <Button
                size="sm"
                className="flex-1 rounded-lg"
                onPress={onAccept}
                disabled={isAccepting || isRejecting}>
                <View className="flex-row items-center gap-1.5">
                  <Icon as={Check} size={14} className="text-primary-foreground" />
                  <Text className="text-sm font-medium text-primary-foreground">
                    {isAccepting ? '...' : t('accept')}
                  </Text>
                </View>
              </Button>
            </View>
          )}
        </View>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  const { t } = useTranslation();
  return (
    <View className="flex-1 items-center justify-center py-20">
      <Icon as={Calendar} size={48} className="mb-4 text-muted-foreground" />
      <Text className="mb-1 text-lg font-semibold text-foreground">{t('noBookingsYet')}</Text>
      <Text className="px-8 text-center text-muted-foreground">{t('noBookingsDescription')}</Text>
    </View>
  );
}

export default function MyBookingScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useCompanyBookings(1, 50, activeTab);
  const acceptMutation = useAcceptBooking();
  const rejectMutation = useRejectBooking();

  const [processingId, setProcessingId] = useState<number | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleAccept = async (bookingId: number) => {
    setProcessingId(bookingId);
    try {
      await acceptMutation.mutateAsync(bookingId);
    } catch (error) {
      Alert.alert('Error', 'Failed to accept booking');
    } finally {
      setProcessingId(null);
    }
  };

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectBookingId, setRejectBookingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleReject = (bookingId: number) => {
    setRejectBookingId(bookingId);
    setRejectReason('');
    setRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!rejectBookingId) return;
    if (rejectReason.length < 10) {
      Alert.alert(t('error'), t('reasonMinLength'));
      return;
    }
    setRejectDialogOpen(false);
    setProcessingId(rejectBookingId);
    try {
      await rejectMutation.mutateAsync({ id: rejectBookingId, reason: rejectReason });
    } catch (error) {
      Alert.alert(t('error'), t('rejectFailed'));
    } finally {
      setProcessingId(null);
      setRejectBookingId(null);
    }
  };

  const renderBooking = ({ item }: { item: Booking }) => (
    <BookingCard
      booking={item}
      onAccept={() => handleAccept(item.id)}
      onReject={() => handleReject(item.id)}
      isAccepting={processingId === item.id && acceptMutation.isPending}
      isRejecting={processingId === item.id && rejectMutation.isPending}
    />
  );

  const tabs: { key: TabType; label: string }[] = [
    { key: 'pending', label: t('pending') },
    { key: 'accepted', label: t('accepted') },
    { key: 'rejected', label: t('rejected') },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="px-5 pb-3 pt-4">
        <Text className="text-2xl font-bold text-foreground">{t('incomingBookings')}</Text>
        <Text className="mt-0.5 text-sm text-muted-foreground">
          {data?.meta?.total ?? 0} {t('bookings').toLowerCase()}
        </Text>
      </View>

      {/* Tabs */}
      <View className="mb-3 px-5">
        <View className="flex-row gap-2 rounded-xl bg-secondary/50 p-1">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'ghost'}
              size="sm"
              className={`h-9 flex-1 rounded-lg ${activeTab === tab.key ? '' : 'bg-transparent'}`}
              onPress={() => setActiveTab(tab.key)}>
              <Text
                className={`text-sm font-medium ${activeTab === tab.key ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                {tab.label}
              </Text>
            </Button>
          ))}
        </View>
      </View>

      {isLoading && !data ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={data?.data ?? []}
          renderItem={renderBooking}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 32, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyState}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      {/* Reject Reason Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('reject')}</DialogTitle>
            <DialogDescription>{t('rejectReasonPrompt')}</DialogDescription>
          </DialogHeader>
          <TextInput
            className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground"
            placeholder={t('rejectReasonPlaceholder')}
            value={rejectReason}
            onChangeText={setRejectReason}
            multiline
            numberOfLines={3}
            style={{ minHeight: 80, textAlignVertical: 'top' }}
          />
          <DialogFooter>
            <Button variant="outline" onPress={() => setRejectDialogOpen(false)}>
              <Text className="text-foreground">{t('cancel')}</Text>
            </Button>
            <Button
              variant="destructive"
              onPress={confirmReject}
              disabled={rejectReason.length < 10}>
              <Text className="text-destructive-foreground">{t('reject')}</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SafeAreaView>
  );
}
