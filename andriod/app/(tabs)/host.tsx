import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
  Dimensions,
  Alert,
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

export default function HostScreen() {
  const { colors, isDark } = useTheme();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Initialize app and get current user
  const initializeApp = useMutation(api.init.initializeApp);
  const getCurrentUser = useMutation(api.init.getCurrentUser);
  
  const spaces = useQuery(
    api.spaces.getMySpaces, 
    currentUserId ? { ownerId: currentUserId as any } : "skip"
  );
  
  const analytics = useQuery(
    api.analytics.getOwnerAnalytics, 
    currentUserId ? { ownerId: currentUserId as any } : "skip"
  );

  useEffect(() => {
    const setupUser = async () => {
      try {
        // Initialize the app first
        await initializeApp();
        // Get the current user
        const user = await getCurrentUser();
        if (user) {
          setCurrentUserId(user._id);
        }
      } catch (error) {
        console.error('Error setting up user:', error);
      }
    };
    
    setupUser();
  }, []);

  const handleAddSpace = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/add-space');
  };

  const handleSpacePress = (spaceId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/space/${spaceId}`);
  };

  const handleAnalytics = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert('Analytics', 'Detailed analytics coming soon!');
  };

  const handleMessages = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/messages');
  };

  const handleEditSpace = (spaceId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert('Edit Space', 'Space editing coming soon!');
  };

  const handleViewSpace = (spaceId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/space/${spaceId}`);
  };

  const handleSpaceStats = (spaceId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert('Space Statistics', 'Detailed space stats coming soon!');
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
          <Text style={[styles.spaceTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
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
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>€{item.pricePerMonth}/mo</Text>
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
              <MaterialIcons name="bookmark" size={16} color={colors.warning} />
            </View>
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {item.activeBookings || 0} active, {item.totalBookings || 0} total
            </Text>
          </View>
        </View>

        {item.rating > 0 && (
          <View style={styles.ratingRow}>
            <View style={[styles.detailIcon, { backgroundColor: isDark ? 'rgba(251, 191, 36, 0.2)' : '#FEF3C7' }]}>
              <MaterialIcons name="star" size={16} color={colors.warning} />
            </View>
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
              {item.rating.toFixed(1)} ({item.totalReviews} reviews)
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={[styles.actionButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
          onPress={() => handleEditSpace(item._id)}
        >
          <MaterialIcons name="edit" size={16} color={colors.primary} />
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
          onPress={() => handleViewSpace(item._id)}
        >
          <MaterialIcons name="visibility" size={16} color={colors.primary} />
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>View</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
          onPress={() => handleSpaceStats(item._id)}
        >
          <MaterialIcons name="bar-chart" size={16} color={colors.primary} />
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>Stats</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Show loading while getting user ID
  if (!currentUserId) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
        <View style={styles.loadingContainer}>
          <MaterialIcons name="hourglass-empty" size={48} color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Setting up your dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalEarnings = analytics?.overview?.monthlyEarnings || 0;
  const totalActiveBookings = analytics?.overview?.activeBookings || 0;
  const totalSpaces = analytics?.overview?.totalSpaces || 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Host Dashboard</Text>
          <Text style={styles.headerSubtitle}>Manage your storage spaces</Text>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <GradientCard style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: isDark ? 'rgba(52, 211, 153, 0.2)' : '#D1FAE5' }]}>
              <MaterialIcons name="euro" size={24} color={colors.success} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>€{totalEarnings}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Monthly Earnings</Text>
          </GradientCard>
          
          <GradientCard style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: isDark ? 'rgba(96, 165, 250, 0.2)' : '#DBEAFE' }]}>
              <MaterialIcons name="bookmark" size={24} color={colors.info} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {totalActiveBookings}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Bookings</Text>
          </GradientCard>
          
          <GradientCard style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: isDark ? 'rgba(251, 191, 36, 0.2)' : '#FEF3C7' }]}>
              <MaterialIcons name="home" size={24} color={colors.warning} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {totalSpaces}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Listed Spaces</Text>
          </GradientCard>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <AnimatedButton
            title="List New Space"
            onPress={handleAddSpace}
            variant="primary"
            size="large"
            icon="add"
            gradient
            style={styles.primaryAction}
          />
          
          <View style={styles.secondaryActions}>
            <TouchableOpacity 
              style={[styles.secondaryAction, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
              onPress={handleAnalytics}
            >
              <View style={[styles.actionIcon, { backgroundColor: isDark ? 'rgba(96, 165, 250, 0.2)' : '#DBEAFE' }]}>
                <MaterialIcons name="analytics" size={20} color={colors.info} />
              </View>
              <Text style={[styles.secondaryActionText, { color: colors.text }]}>Analytics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.secondaryAction, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
              onPress={handleMessages}
            >
              <View style={[styles.actionIcon, { backgroundColor: isDark ? 'rgba(244, 114, 182, 0.2)' : '#FCE7F3' }]}>
                <MaterialIcons name="message" size={20} color="#EC4899" />
              </View>
              <Text style={[styles.secondaryActionText, { color: colors.text }]}>Messages</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* My Spaces */}
        <View style={styles.spacesSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>My Spaces</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
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
                <MaterialIcons name="home-work" size={48} color="#FFFFFF" />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No spaces listed yet</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Start earning by listing your first storage space
              </Text>
              <AnimatedButton
                title="List Your First Space"
                onPress={handleAddSpace}
                variant="primary"
                size="medium"
                icon="add"
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
  },
  headerGradient: {
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  primaryAction: {
    marginBottom: 12,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryActionText: {
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
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingSpinner: {
    padding: 20,
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
    marginBottom: 20,
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});