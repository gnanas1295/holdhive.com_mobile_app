import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useTheme } from '@/app/contexts/ThemeContext';
import { GradientCard } from '@/app/components/ui/GradientCard';
import { AnimatedButton } from '@/app/components/ui/AnimatedButton';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const SPACE_TYPES = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'room', label: 'Room', icon: 'meeting-room' },
  { id: 'garage', label: 'Garage', icon: 'garage' },
  { id: 'basement', label: 'Basement', icon: 'foundation' },
  { id: 'attic', label: 'Attic', icon: 'roofing' },
  { id: 'storage_unit', label: 'Storage Unit', icon: 'inventory' },
];

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  
  // Initialize app on first load
  const initializeApp = useMutation(api.init.initializeApp);
  
  const spaces = useQuery(api.spaces.list, {
    city: searchQuery || undefined,
    maxPrice,
    spaceType: selectedType === 'all' ? undefined : selectedType,
  });

  useEffect(() => {
    // Initialize the app with demo data on first load
    const setupApp = async () => {
      try {
        await initializeApp();
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };
    
    setupApp();
  }, []);

  const handleSpacePress = (spaceId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/space/${spaceId}`);
  };

  const handleTypeSelect = (typeId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedType(typeId);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const renderSpaceCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.spaceCard,
        { 
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
          borderColor: colors.border,
        }
      ]}
      onPress={() => handleSpacePress(item._id)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.spaceInfo}>
          <Text style={[styles.spaceTitle, { color: colors.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.locationRow}>
            <MaterialIcons name="location-on" size={14} color={colors.textSecondary} />
            <Text style={[styles.locationText, { color: colors.textSecondary }]} numberOfLines={1}>
              {item.address}, {item.city}
            </Text>
          </View>
        </View>
        
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.isAvailable ? colors.success : colors.error }
        ]}>
          <Text style={styles.statusText}>
            {item.isAvailable ? 'Available' : 'Occupied'}
          </Text>
        </View>
      </View>

      <View style={styles.spaceDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <View style={[styles.detailIcon, { backgroundColor: isDark ? 'rgba(52, 211, 153, 0.2)' : '#D1FAE5' }]}>
              <MaterialIcons name="euro" size={16} color={colors.success} />
            </View>
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              €{item.pricePerMonth}/mo
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <View style={[styles.detailIcon, { backgroundColor: isDark ? 'rgba(96, 165, 250, 0.2)' : '#DBEAFE' }]}>
              <MaterialIcons name="square-foot" size={16} color={colors.info} />
            </View>
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>{item.size}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <View style={[styles.detailIcon, { backgroundColor: isDark ? 'rgba(251, 191, 36, 0.2)' : '#FEF3C7' }]}>
              <MaterialIcons name="category" size={16} color={colors.warning} />
            </View>
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {item.spaceType.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </Text>
          </View>
        </View>

        {item.owner && (
          <View style={styles.ownerRow}>
            <View style={[styles.detailIcon, { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : '#EDE9FE' }]}>
              <MaterialIcons name="person" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.ownerText, { color: colors.textSecondary }]}>
              {item.owner.name}
            </Text>
            {item.owner.isVerified && (
              <MaterialIcons name="verified" size={16} color={colors.success} />
            )}
            {item.owner.rating > 0 && (
              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={14} color={colors.warning} />
                <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                  {item.owner.rating.toFixed(1)}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.amenitiesRow}>
        {item.amenities.slice(0, 3).map((amenity: string, index: number) => (
          <View key={index} style={[styles.amenityChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.amenityText, { color: colors.textSecondary }]}>
              {amenity.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </Text>
          </View>
        ))}
        {item.amenities.length > 3 && (
          <Text style={[styles.moreAmenities, { color: colors.textTertiary }]}>
            +{item.amenities.length - 3} more
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>Welcome to</Text>
              <Text style={styles.appName}>Holdhive</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <MaterialIcons name="account-circle" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.headerSubtitle}>Find affordable storage spaces near you</Text>
          
          {/* Search Bar */}
          <View style={[styles.searchContainer, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <MaterialIcons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search by city or location..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="clear" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Space Type Filter */}
        <View style={styles.filterSection}>
          <Text style={[styles.filterTitle, { color: colors.text }]}>Space Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeFilter}>
            {SPACE_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeChip,
                  selectedType === type.id && { backgroundColor: colors.primary },
                  selectedType !== type.id && { backgroundColor: colors.card, borderColor: colors.border }
                ]}
                onPress={() => handleTypeSelect(type.id)}
              >
                <MaterialIcons 
                  name={type.icon as any} 
                  size={18} 
                  color={selectedType === type.id ? '#FFFFFF' : colors.textSecondary} 
                />
                <Text style={[
                  styles.typeChipText,
                  { color: selectedType === type.id ? '#FFFFFF' : colors.textSecondary }
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Spaces List */}
        <View style={styles.spacesSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Spaces</Text>
            <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
              {spaces?.length || 0} spaces found
            </Text>
          </View>

          {spaces === undefined ? (
            <GradientCard style={styles.loadingContainer}>
              <View style={styles.loadingSpinner}>
                <MaterialIcons name="hourglass-empty" size={32} color={colors.primary} />
              </View>
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading spaces...</Text>
            </GradientCard>
          ) : spaces.length === 0 ? (
            <GradientCard style={styles.emptyContainer}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.primary }]}>
                <MaterialIcons name="search-off" size={48} color="#FFFFFF" />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No spaces found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Try adjusting your search criteria or check back later for new listings
              </Text>
              <AnimatedButton
                title="Clear Filters"
                onPress={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setMaxPrice(undefined);
                }}
                variant="secondary"
                size="medium"
                icon="refresh"
                style={styles.emptyButton}
              />
            </GradientCard>
          ) : (
            <FlatList
              data={spaces}
              renderItem={renderSpaceCard}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              contentContainerStyle={styles.spacesList}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  typeFilter: {
    marginTop: 8,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    gap: 6,
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  spacesSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  resultCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    gap: 16,
  },
  loadingSpinner: {
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    gap: 16,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyButton: {
    marginTop: 8,
  },
  spacesList: {
    paddingBottom: 20,
  },
  spaceCard: {
    borderRadius: 20,
    marginBottom: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  spaceInfo: {
    flex: 1,
    marginRight: 12,
  },
  spaceTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  spaceDetails: {
    marginBottom: 16,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ownerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: 'auto',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  amenityChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  amenityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreAmenities: {
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'italic',
  },
});