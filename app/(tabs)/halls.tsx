import React from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { HallCard, type Hall } from '@/components/halls/HallCard';
import { HallSearchBar } from '@/components/halls/HallSearchBar';
import { HallSortBar } from '@/components/halls/HallSortBar';
import { HallFilterPanel } from '@/components/halls/HallFilterPanel';

// Sample halls data
const allHalls: Hall[] = [
  {
    id: 1,
    name: 'The Grand Ballroom',
    location: 'Downtown',
    city: 'Riyadh',
    price: 5200,
    originalPrice: 6500,
    capacity: 320,
    rating: 4.8,
    amenities: ['Catering', 'DJ', 'Photography'],
    type: 'Ballroom',
    featured: true,
    reviews: 124,
  },
  {
    id: 2,
    name: 'Rose Garden Estate',
    location: 'Countryside',
    city: 'Jeddah',
    price: 3600,
    capacity: 180,
    rating: 4.7,
    amenities: ['Catering', 'Decoration'],
    type: 'Garden',
    featured: false,
    reviews: 89,
  },
  {
    id: 3,
    name: 'Sunset Terrace',
    location: 'Beachside',
    city: 'Jeddah',
    price: 4800,
    capacity: 150,
    rating: 4.6,
    amenities: ['Catering', 'DJ'],
    type: 'Rooftop',
    featured: true,
    reviews: 67,
  },
  {
    id: 4,
    name: 'Crystal Palace',
    location: 'City Center',
    city: 'Riyadh',
    price: 6200,
    originalPrice: 7500,
    capacity: 250,
    rating: 4.9,
    amenities: ['Catering', 'DJ', 'Photography', 'Decoration'],
    type: 'Ballroom',
    featured: true,
    reviews: 156,
  },
];

// Filter options
const typeFilters = ['All', 'Ballroom', 'Garden', 'Beach', 'Rooftop', 'Indoor', 'Outdoor'];
const priceFilters = ['All', 'Under 3k', '3k-5k', '5k-7k', '7k+'];
const sortOptions = ['Recommended', 'Price: Low', 'Price: High', 'Rating', 'Capacity'];

export default function HallsScreen() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedType, setSelectedType] = React.useState('All');
  const [selectedPrice, setSelectedPrice] = React.useState('All');
  const [selectedSort, setSelectedSort] = React.useState('Recommended');
  const [showFilters, setShowFilters] = React.useState(false);

  // Filter halls
  const filteredHalls = React.useMemo(() => {
    let halls = [...allHalls];

    // Search filter
    if (searchQuery) {
      halls = halls.filter(
        (h) =>
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== 'All') {
      halls = halls.filter((h) => h.type === selectedType);
    }

    // Price filter
    if (selectedPrice !== 'All') {
      switch (selectedPrice) {
        case 'Under 3k':
          halls = halls.filter((h) => h.price < 3000);
          break;
        case '3k-5k':
          halls = halls.filter((h) => h.price >= 3000 && h.price <= 5000);
          break;
        case '5k-7k':
          halls = halls.filter((h) => h.price > 5000 && h.price <= 7000);
          break;
        case '7k+':
          halls = halls.filter((h) => h.price > 7000);
          break;
      }
    }

    // Sort
    switch (selectedSort) {
      case 'Price: Low':
        halls.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High':
        halls.sort((a, b) => b.price - a.price);
        break;
      case 'Rating':
        halls.sort((a, b) => b.rating - a.rating);
        break;
      case 'Capacity':
        halls.sort((a, b) => b.capacity - a.capacity);
        break;
      default:
        halls.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return halls;
  }, [searchQuery, selectedType, selectedPrice, selectedSort]);

  const handleNavigate = (id: number) => router.push(`/halls/${id}`);

  const renderHallCard = ({ item: hall }: { item: Hall }) => (
    <HallCard hall={hall} onBook={handleNavigate} onDetails={handleNavigate} />
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1">
        <View className="px-5 pt-4 pb-3">
          <Text className="text-2xl font-bold text-foreground">{t('browseVenues')}</Text>
          <Text className="text-muted-foreground mt-1 text-sm">
            {t('venuesAvailable', { count: filteredHalls.length })}
          </Text>
        </View>

        <HallSearchBar value={searchQuery} onChange={setSearchQuery} />

        <HallSortBar
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          sortOptions={sortOptions}
          selectedSort={selectedSort}
          onChangeSort={setSelectedSort}
        />

        {showFilters && (
          <HallFilterPanel
            typeFilters={typeFilters}
            priceFilters={priceFilters}
            selectedType={selectedType}
            selectedPrice={selectedPrice}
            onChangeType={setSelectedType}
            onChangePrice={setSelectedPrice}
            onClear={() => {
              setSelectedType('All');
              setSelectedPrice('All');
            }}
            showClear={selectedType !== 'All' || selectedPrice !== 'All'}
          />
        )}

        {filteredHalls.length === 0 ? (
          <View className="flex-1 items-center justify-center py-12">
            <Text className="text-4xl mb-3">🏛️</Text>
            <Text className="text-muted-foreground text-center">{t('noVenuesFound')}</Text>
            <Text className="text-muted-foreground text-center text-sm mt-1">
              {t('tryAdjustingFilters')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredHalls}
            renderItem={renderHallCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
