import React from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Separator } from '@/components/ui/separator';
import { HallHero } from '@/components/halls/HallHero';
import { HallInfoCard } from '@/components/halls/HallInfoCard';
import { GuestSelectorCard } from '@/components/halls/GuestSelectorCard';
import { DateTimePickerCard } from '@/components/halls/DateTimePickerCard';
import { ServicesGrid, HallService } from '@/components/halls/ServicesGrid';
import { BookingSummaryBar } from '@/components/halls/BookingSummaryBar';

// Hall details
const hallDetails = {
  id: 1,
  name: 'The Grand Ballroom',
  address: '123 Fifth Avenue, New York, NY 10010',
  phone: '+1 (212) 555-0123',
  pricePerPerson: 50,
  basePrice: 2000,
  capacity: 300,
  minCapacity: 50,
  rating: 4.9,
  reviews: 128,
  openHours: '9 AM - 11 PM',
  images: 5,
};

// Services
const services: HallService[] = [
  { id: 1, name: 'Photography', price: 1500, icon: '📸' },
  { id: 2, name: 'Videography', price: 2000, icon: '🎬' },
  { id: 3, name: 'Catering', pricePerPerson: 35, icon: '🍽️', popular: true, perPerson: true },
  { id: 4, name: 'Decoration', price: 2500, icon: '💐' },
  { id: 5, name: 'DJ & Music', price: 800, icon: '🎵' },
  { id: 6, name: 'Cake', price: 600, icon: '🎂' },
  { id: 7, name: 'Makeup', price: 400, icon: '💄' },
  { id: 8, name: 'Transport', price: 500, icon: '🚗' },
];

export default function HallDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<Date | null>(null);
  const [selectedServices, setSelectedServices] = React.useState<number[]>([]);
  const [guestCount, setGuestCount] = React.useState(100);

  const hall = hallDetails;

  const infoTiles = [
    { icon: '👥', label: 'Capacity', value: `${hall.minCapacity}-${hall.capacity}` },
    { icon: '💵', label: 'Per Guest', value: `${hall.pricePerPerson} sr` },
      { icon: '🏷️', label: 'Base Fee', value: `${hall.basePrice ? hall.basePrice.toLocaleString() : 0} sr` },
    { icon: '🕒', label: 'Hours', value: hall.openHours },
  ];

  const venuePrice = hall.basePrice + (guestCount * hall.pricePerPerson);
  const timeSlotExtra = 0;
  const servicesTotal = selectedServices.reduce((sum, serviceId) => {
    const service = services.find(s => s.id === serviceId);
    if (service?.perPerson) return sum + ((service.pricePerPerson || 0) * guestCount);
    return sum + (service?.price || 0);
  }, 0);
  
  const totalPrice = venuePrice + timeSlotExtra + servicesTotal;

  const toggleService = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
    );
  };

  const canBook = Boolean(selectedDate && selectedTime);

  const formatDate = (date?: Date | null) =>
    date ? date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'Pick a date';

  const formatTime = (date?: Date | null) =>
    date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pick a time';

  const handleGuestChange = (value: number) => {
    setGuestCount(value);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (date: Date) => {
    setSelectedTime(date);
  };

  const handleBookNow = () => {
    // placeholder for future action
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <HallHero imagesCount={hall.images} onBack={() => router.back()} />
        <View className="px-4 -mt-4">
          <HallInfoCard
            name={hall.name}
            address={hall.address}
            rating={hall.rating}
            infoTiles={infoTiles}
          />
          <GuestSelectorCard
            guestCount={guestCount}
            min={hall.minCapacity}
            max={hall.capacity}
            venuePrice={venuePrice}
            onChange={handleGuestChange}
          />
          <DateTimePickerCard
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onChangeDate={handleDateChange}
            onChangeTime={handleTimeChange}
            formatDate={formatDate}
            formatTime={formatTime}
          />
          <Separator className="my-3" />
          <ServicesGrid
            services={services}
            selectedServices={selectedServices}
            guestCount={guestCount}
            onToggle={toggleService}
          />
          <View className="h-28" />
        </View>
      </ScrollView>

      <BookingSummaryBar
        totalPrice={totalPrice}
        guestCount={guestCount}
        servicesCount={selectedServices.length}
        dateLabel={selectedDate ? formatDate(selectedDate) : undefined}
        timeLabel={selectedTime ? formatTime(selectedTime) : undefined}
        canBook={canBook}
        onBook={handleBookNow}
      />
    </View>
  );
}
