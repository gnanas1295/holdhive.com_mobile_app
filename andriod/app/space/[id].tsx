import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useTheme } from '@/app/contexts/ThemeContext';
import { GradientCard } from '@/app/components/ui/GradientCard';
import { AnimatedButton } from '@/app/components/ui/AnimatedButton';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function SpaceDetailScreen() {
  const { colors, isDark } = useTheme();
  const { id } = useLocalSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const space = useQuery(api.spaces.getById, { spaceId: id as string });

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleBookNow = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert('Book Space', 'Booking functionality coming soon!');
  };

  const handleContact = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert('Contact Owner', 'Messaging functionality coming soon!');
  };

  const handleFavorite = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert('Favorite', 'Added to favorites!');
  };

  const handleShare = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert('Share', 'Share functionality coming soon!');
  };

  const getSpaceIcon = (type: string) => {
    const icons = {
      garage: 'garage',
      room: 'meeting-room',
      basement: 'foundation',
      attic: 'roofing',
      storage_unit: 'inventory',
    };
    return icons[type as keyof typeof icons] || 'home';
  };

  const getAmenityIcon = (amenity: string) => {
    const icons = {
      '24_7_access': 'access-time',
      'climate_controlled': 'thermostat',
      'security': 'security',
      'parking': 'local-parking',
      'electricity': 'electrical-services',
      'easy_access': 'accessible',
    };
    return icons[amenity as keyof typeof icons] || 'check-circle';
  };

  const getSecurityIcon = (feature: string) => {
    const icons = {
      'cctv': 'videocam',
      'secure_lock': 'lock',
      'alarm_system': 'alarm',
      'lighting': 'lightbulb',
      'keypad_access': 'dialpad',
      'security_guard': 'security',
    };
    return icons[feature as keyof typeof icons] || 'shield';
  };

  if (space === undefined) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
        <View style={styles.loadingContainer}>
          <MaterialIcons name="hourglass-empty" size={32} color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading space details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!space) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.text }]}>Space not found</Text>
          <AnimatedButton
            title="Go Back"
            onPress={handleBack}
            variant="primary"
            size="medium"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity 
          style={[styles.headerButton, { backgroundColor: colors.card }]}
          onPress={handleBack}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: colors.card }]}
            onPress={handleShare}
          >
            <MaterialIcons name="share" size={20} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: colors.card }]}
            onPress={handleFavorite}
          >
            <MaterialIcons name="favorite-border" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          {space.images && space.images.length > 0 ? (
            <Image 
              source={{ uri: `https://picsum.photos/400/300?random=${space._id}` }} 
              style={styles.spaceImage} 
            />
          ) : (
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.placeholderImage}
            >
              <MaterialIcons name="photo" size={60} color="#FFFFFF" />
            </LinearGradient>
          )}
          
          <View style={styles.priceOverlay}>
            <LinearGradient
              colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)']}
              style={styles.priceContainer}
            >
              <Text style={styles.priceText}>€{space.pricePerMonth}</Text>
              <Text style={styles.priceSubtext}>per month</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Space Info */}
        <View style={styles.content}>
          <GradientCard style={styles.section}>
            <View style={styles.titleRow}>
              <View style={styles.titleContainer}>
                <Text style={[styles.spaceTitle, { color: colors.text }]}>{space.title}</Text>
                <View style={styles.locationRow}>
                  <MaterialIcons name="location-on" size={16} color={colors.textSecondary} />
                  <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                    {space.address}, {space.city}
                  </Text>
                </View>
              </View>
              
              <View style={[
                styles.statusBadge,
                { backgroundColor: space.isAvailable ? colors.success : colors.error }
              ]}>
                <Text style={styles.statusText}>
                  {space.isAvailable ? 'Available' : 'Occupied'}
                </Text>
              </View>
            </View>

            <View style={styles.quickStats}>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: isDark ? 'rgba(96, 165, 250, 0.2)' : '#DBEAFE' }]}>
                  <MaterialIcons name={getSpaceIcon(space.spaceType)} size={20} color={colors.info} />
                </View>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Type</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {space.spaceType.replace('_', ' ')}
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: isDark ? 'rgba(52, 211, 153, 0.2)' : '#D1FAE5' }]}>
                  <MaterialIcons name="square-foot" size={20} color={colors.success} />
                </View>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Size</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{space.size}</Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: isDark ? 'rgba(251, 191, 36, 0.2)' : '#FEF3C7' }]}>
                  <MaterialIcons name="schedule" size={20} color={colors.warning} />
                </View>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Access</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{space.accessHours}</Text>
              </View>
            </View>
          </GradientCard>

          {/* Description */}
          <GradientCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {space.description}
            </Text>
          </GradientCard>

          {/* Amenities */}
          {space.amenities && space.amenities.length > 0 && (
            <GradientCard style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {space.amenities.map((amenity, index) => (
                  <View key={index} style={[styles.amenityItem, { backgroundColor: colors.surface }]}>
                    <MaterialIcons 
                      name={getAmenityIcon(amenity) as any} 
                      size={18} 
                      color={colors.primary} 
                    />
                    <Text style={[styles.amenityText, { color: colors.text }]}>
                      {amenity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                  </View>
                ))}
              </View>
            </GradientCard>
          )}

          {/* Security Features */}
          {space.securityFeatures && space.securityFeatures.length > 0 && (
            <GradientCard style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Security Features</Text>
              <View style={styles.amenitiesGrid}>
                {space.securityFeatures.map((feature, index) => (
                  <View key={index} style={[styles.amenityItem, { backgroundColor: colors.surface }]}>
                    <MaterialIcons 
                      name={getSecurityIcon(feature) as any} 
                      size={18} 
                      color={colors.success} 
                    />
                    <Text style={[styles.amenityText, { color: colors.text }]}>
                      {feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                  </View>
                ))}
              </View>
            </GradientCard>
          )}

          {/* Owner Info */}
          {space.owner && (
            <GradientCard style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Hosted by</Text>
              <View style={styles.ownerInfo}>
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.ownerAvatar}
                >
                  <Text style={styles.ownerInitial}>{space.owner.name.charAt(0)}</Text>
                </LinearGradient>
                
                <View style={styles.ownerDetails}>
                  <View style={styles.ownerNameRow}>
                    <Text style={[styles.ownerName, { color: colors.text }]}>{space.owner.name}</Text>
                    {space.owner.isVerified && (
                      <MaterialIcons name="verified" size={16} color={colors.success} />
                    )}
                  </View>
                  
                  {space.owner.rating > 0 && (
                    <View style={styles.ownerRating}>
                      <MaterialIcons name="star" size={16} color={colors.warning} />
                      <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                        {space.owner.rating.toFixed(1)} ({space.owner.totalReviews} reviews)
                      </Text>
                    </View>
                  )}
                  
                  {space.owner.bio && (
                    <Text style={[styles.ownerBio, { color: colors.textSecondary }]} numberOfLines={2}>
                      {space.owner.bio}
                    </Text>
                  )}
                </View>
              </View>
            </GradientCard>
          )}

          {/* Rental Terms */}
          <GradientCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Rental Terms</Text>
            <View style={styles.termsGrid}>
              <View style={styles.termItem}>
                <Text style={[styles.termLabel, { color: colors.textSecondary }]}>Minimum Period</Text>
                <Text style={[styles.termValue, { color: colors.text }]}>
                  {space.minimumRentalPeriod} month{space.minimumRentalPeriod > 1 ? 's' : ''}
                </Text>
              </View>
              
              <View style={styles.termItem}>
                <Text style={[styles.termLabel, { color: colors.textSecondary }]}>Monthly Rate</Text>
                <Text style={[styles.termValue, { color: colors.text }]}>€{space.pricePerMonth}</Text>
              </View>
            </View>
          </GradientCard>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.contactButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={handleContact}
        >
          <MaterialIcons name="message" size={20} color={colors.primary} />
          <Text style={[styles.contactButtonText, { color: colors.primary }]}>Contact</Text>
        </TouchableOpacity>
        
        <AnimatedButton
          title="Book Now"
          onPress={handleBookNow}
          variant="primary"
          size="large"
          icon="event"
          gradient
          style={styles.bookButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  spaceImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceOverlay: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  priceContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  priceSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  section: {
    marginTop: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  spaceTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 32,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 16,
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
  quickStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
    minWidth: '45%',
  },
  amenityText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  ownerInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  ownerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownerInitial: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  ownerDetails: {
    flex: 1,
    gap: 6,
  },
  ownerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ownerName: {
    fontSize: 18,
    fontWeight: '700',
  },
  ownerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  ownerBio: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  termsGrid: {
    gap: 16,
  },
  termItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  termLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  termValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bookButton: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
  },
});