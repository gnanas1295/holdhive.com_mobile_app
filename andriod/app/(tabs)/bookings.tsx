import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

// Mock user ID - in a real app, this would come from authentication
const MOCK_USER_ID = 'k17f8c9h0g5d2e1a3b6c7d8e9f0a1b2c' as any;

const STATUS_COLORS = {
  pending: '#F59E0B',
  confirmed: '#10B981',
  active: '#2563EB',
  completed: '#6B7280',
  cancelled: '#EF4444',
};

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<'renter' | 'owner'>('renter');

  // Mock data for demonstration
  const mockBookings = [
    {
      _id: '1',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      totalAmount: 450,
      space: {
        title: 'Spacious Garage Storage in City Center',
        address: '123 Grafton Street',
        city: 'Dublin',
        images: [],
      },
      owner: {
        name: 'Sarah Johnson',
        phone: '+353 87 123 4567',
      },
      createdAt: '2024-01-10T10:00:00Z',
    },
    {
      _id: '2',
      status: 'pending',
      startDate: '2024-02-01',
      endDate: '2024-05-01',
      totalAmount: 300,
      space: {
        title: 'Clean Basement Room Near University',
        address: '456 Dame Street',
        city: 'Dublin',
        images: [],
      },
      owner: {
        name: "Michael O'Connor",
        phone: '+353 86 987 6543',
      },
      createdAt: '2024-01-20T14:30:00Z',
    },
  ];

  const bookings = mockBookings; // In real app: useQuery(api.bookings.getMyBookings, { userId: MOCK_USER_ID });

  const handleTabPress = (tab: 'renter' | 'owner') => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setActiveTab(tab);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderBookingCard = ({ item }: { item: any }) => (
    <View style={styles.bookingCard}>
      <View style={styles.cardHeader}>
        <View style={styles.spaceInfo}>
          <Text style={styles.spaceTitle} numberOfLines={2}>
            {item.space?.title || 'Unknown Space'}
          </Text>
          <View style={styles.locationRow}>
            <MaterialIcons name="location-on" size={14} color="#6B7280" />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.space?.address}, {item.space?.city}
            </Text>
          </View>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] }]}>
          <Text style={styles.statusText}>{STATUS_LABELS[item.status]}</Text>
        </View>
      </View>

      <View style={styles.imageContainer}>
        {item.space?.images && item.space.images.length > 0 ? (
          <Image source={{ uri: 'https://picsum.photos/100/80?random=' + item._id }} style={styles.spaceImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialIcons name="photo" size={24} color="#FFFFFF" />
          </View>
        )}
        
        <View style={styles.bookingDetails}>
          <View style={styles.dateRow}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="calendar-today" size={16} color="#667eea" />
            </View>
            <Text style={styles.dateText}>
              {formatDate(item.startDate)} - {formatDate(item.endDate)}
            </Text>
          </View>
          
          <View style={styles.priceRow}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="euro" size={16} color="#10B981" />
            </View>
            <Text style={styles.priceText}>€{item.totalAmount} total</Text>
          </View>

          {activeTab === 'renter' && item.owner && (
            <View style={styles.contactRow}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="person" size={16} color="#6B7280" />
              </View>
              <Text style={styles.contactText}>{item.owner.name}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="message" size={18} color="#667eea" />
          <Text style={styles.actionButtonText}>Message</Text>
        </TouchableOpacity>
        
        {item.status === 'pending' && (
          <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
            <MaterialIcons name="payment" size={18} color="#FFFFFF" />
            <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Pay Now</Text>
          </TouchableOpacity>
        )}
        
        {item.status === 'active' && (
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="info" size={18} color="#667eea" />
            <Text style={styles.actionButtonText}>Details</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Bookings</Text>
          <Text style={styles.headerSubtitle}>Manage your storage rentals</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'renter' && styles.activeTab]}
          onPress={() => handleTabPress('renter')}
        >
          <View style={[styles.tabIcon, activeTab === 'renter' && styles.activeTabIcon]}>
            <MaterialIcons
              name="person"
              size={20}
              color={activeTab === 'renter' ? '#FFFFFF' : '#6B7280'}
            />
          </View>
          <Text style={[styles.tabText, activeTab === 'renter' && styles.activeTabText]}>
            As Renter
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'owner' && styles.activeTab]}
          onPress={() => handleTabPress('owner')}
        >
          <View style={[styles.tabIcon, activeTab === 'owner' && styles.activeTabIcon]}>
            <MaterialIcons
              name="business"
              size={20}
              color={activeTab === 'owner' ? '#FFFFFF' : '#6B7280'}
            />
          </View>
          <Text style={[styles.tabText, activeTab === 'owner' && styles.activeTabText]}>
            As Host
          </Text>
        </TouchableOpacity>
      </View>

      {bookings === undefined ? (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingSpinner}>
            <MaterialIcons name="hourglass-empty" size={32} color="#667eea" />
          </View>
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <MaterialIcons name="bookmark-border" size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptySubtitle}>
            {activeTab === 'renter'
              ? 'Start exploring spaces to make your first booking'
              : 'List your space to start receiving bookings'}
          </Text>
          <TouchableOpacity style={styles.emptyButton}>
            <Text style={styles.emptyButtonText}>
              {activeTab === 'renter' ? 'Explore Spaces' : 'List Your Space'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingCard}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    backgroundColor: '#667eea',
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#667eea',
  },
  tabIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingSpinner: {
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  emptyButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
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
    color: '#111827',
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
    color: '#6B7280',
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
  imageContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 16,
  },
  spaceImage: {
    width: 80,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  placeholderImage: {
    width: 80,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingDetails: {
    flex: 1,
    gap: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  priceText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  contactText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  primaryButton: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
});