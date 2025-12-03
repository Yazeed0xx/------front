import React from 'react';
import { View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Separator } from '@/components/ui/separator';
import { router } from 'expo-router';
import { HallCard, type Hall } from '@/components/halls/HallCard';
import { HallListHeader } from '@/components/halls/HallListHeader';
import { HallSearchBar } from '@/components/halls/HallSearchBar';
import { HallSortBar } from '@/components/halls/HallSortBar';
import { HallFilterPanel } from '@/components/halls/HallFilterPanel';
import { HallEmptyState } from '@/components/halls/HallEmptyState';

// All halls data
const allHalls: Hall[] = [
  {
    id: 1,
    name: 'The Grand Ballroom',
    location: 'Downtown',
    city: 'New York',
    price: 5000,
    originalPrice: 6500,
    capacity: 300,
    rating: 4.9,
    reviews: 128,
    type: 'Ballroom',
    amenities: ['Parking', 'Catering', 'DJ'],
    featured: true,
  },
  {
    id: 2,
    name: 'Rose Garden Estate',
    location: 'Countryside',
    city: 'Connecticut',
    price: 3500,
    capacity: 150,
    rating: 4.8,
    reviews: 89,
    type: 'Garden',
    amenities: ['Outdoor', 'Photography'],
    featured: false,
  },
  {
    id: 3,
    name: 'Crystal Palace',
    location: 'Beachfront',
    city: 'Miami',
    price: 7000,
    originalPrice: 8500,
    capacity: 400,
    rating: 5.0,
    reviews: 256,
    type: 'Beach',
    amenities: ['Ocean View', 'Catering', 'Valet'],
    featured: true,
  },
  {
    id: 4,
    name: 'Sunset Terrace',
    location: 'Rooftop',
    city: 'Los Angeles',
    price: 4200,
    capacity: 120,
    rating: 4.7,
    reviews: 67,
    type: 'Rooftop',
    amenities: ['City View', 'Bar'],
    featured: false,
  },
  {
    id: 5,
    name: 'Villa Rosa',
    location: 'Vineyard',
    city: 'Napa Valley',
    price: 6500,
    capacity: 200,
    rating: 4.9,
    reviews: 143,
    type: 'Garden',
    amenities: ['Wine Tasting', 'Catering', 'Accommodation'],
    featured: true,
  },
  {
    id: 6,
    name: 'The Atrium',
    location: 'Downtown',
    city: 'Chicago',
    price: 3800,
    capacity: 180,
    rating: 4.6,
    reviews: 92,
    type: 'Indoor',
    amenities: ['Parking', 'AV Equipment'],
    featured: false,
  },
  {
    id: 7,
    name: 'Oceanview Manor',
    location: 'Beachfront',
    city: 'San Diego',
    price: 5500,
    capacity: 250,
    rating: 4.8,
    reviews: 178,
    type: 'Beach',
    amenities: ['Beach Access', 'Catering', 'Spa'],
    featured: false,
  },
  {
    id: 8,
    name: 'Meadow Hall',
    location: 'Countryside',
    city: 'Vermont',
    price: 1800,
    capacity: 80,
    rating: 4.5,
    reviews: 45,
    type: 'Garden',
    amenities: ['Rustic', 'Barn'],
    featured: false,
  },
  {
    id: 9,
    name: 'Skyline Lounge',
    location: 'Rooftop',
    city: 'New York',
    price: 8000,
    capacity: 100,
    rating: 4.9,
    reviews: 112,
    type: 'Rooftop',
    amenities: ['Manhattan View', 'Premium Bar', 'DJ'],
    featured: true,
  },
  {
    id: 10,
    name: 'Lakeside Pavilion',
    location: 'Lakefront',
    city: 'Lake Tahoe',
    price: 4500,
    capacity: 175,
    rating: 4.7,
    reviews: 88,
    type: 'Outdoor',
    amenities: ['Lake View', 'Outdoor Ceremony'],
    featured: false,
  },
];

// Filter options
const typeFilters = ['All', 'Ballroom', 'Garden', 'Beach', 'Rooftop', 'Indoor', 'Outdoor'];
const priceFilters = ['All', 'Under $3k', '$3k-$5k', '$5k-$7k', '$7k+'];
const capacityFilters = ['All', '< 100', '100-200', '200-300', '300+'];
const sortOptions = ['Recommended', 'Price: Low', 'Price: High', 'Rating', 'Capacity'];

export default function HallsScreen() {
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
        case 'Under $3k':
          halls = halls.filter((h) => h.price < 3000);
          break;
        case '$3k-$5k':
          halls = halls.filter((h) => h.price >= 3000 && h.price <= 5000);
          break;
        case '$5k-$7k':
          halls = halls.filter((h) => h.price > 5000 && h.price <= 7000);
          break;
        case '$7k+':
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
      <HallListHeader total={filteredHalls.length} />
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

      <Separator className="mx-5 mb-4" />

      {filteredHalls.length === 0 ? (
        <HallEmptyState
          onReset={() => {
            setSearchQuery('');
            setSelectedType('All');
            setSelectedPrice('All');
          }}
        />
      ) : (
        <FlatList
          data={filteredHalls}
          renderItem={renderHallCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </SafeAreaView>
  );
}
