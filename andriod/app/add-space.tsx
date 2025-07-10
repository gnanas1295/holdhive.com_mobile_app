import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useTheme } from '@/app/contexts/ThemeContext';
import { GradientCard } from '@/app/components/ui/GradientCard';
import { AnimatedButton } from '@/app/components/ui/AnimatedButton';
import * as Haptics from 'expo-haptics';

const SPACE_TYPES = [
  { id: 'room', label: 'Room', icon: 'meeting-room' },
  { id: 'garage', label: 'Garage', icon: 'garage' },
  { id: 'basement', label: 'Basement', icon: 'foundation' },
  { id: 'attic', label: 'Attic', icon: 'roofing' },
  { id: 'storage_unit', label: 'Storage Unit', icon: 'inventory' },
  { id: 'other', label: 'Other', icon: 'category' },
];

const AMENITIES = [
  { id: '24_7_access', label: '24/7 Access', icon: 'access-time' },
  { id: 'climate_controlled', label: 'Climate Controlled', icon: 'thermostat' },
  { id: 'security', label: 'Security System', icon: 'security' },
  { id: 'parking', label: 'Parking Available', icon: 'local-parking' },
  { id: 'electricity', label: 'Electricity', icon: 'electrical-services' },
  { id: 'easy_access', label: 'Easy Access', icon: 'accessible' },
];

const SECURITY_FEATURES = [
  { id: 'cctv', label: 'CCTV Cameras', icon: 'videocam' },
  { id: 'secure_lock', label: 'Secure Lock', icon: 'lock' },
  { id: 'alarm_system', label: 'Alarm System', icon: 'alarm' },
  { id: 'lighting', label: 'Good Lighting', icon: 'lightbulb' },
  { id: 'keypad_access', label: 'Keypad Access', icon: 'dialpad' },
  { id: 'security_guard', label: 'Security Guard', icon: 'security' },
];

export default function AddSpaceScreen() {
  const { colors, isDark } = useTheme();
  const createSpace = useMutation(api.spaces.create);
  const getCurrentUser = useMutation(api.init.getCurrentUser);
  
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    pricePerMonth: '',
    spaceType: 'room',
    size: '',
    minimumRentalPeriod: '1',
    accessHours: '24/7',
  });
  
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedSecurityFeatures, setSelectedSecurityFeatures] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const setupUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUserId(user._id);
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    };
    
    setupUser();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenityId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedAmenities(prev => 
      prev.includes(amenityId) 
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const toggleSecurityFeature = (featureId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedSecurityFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSubmit = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (!currentUserId) {
      Alert.alert('Error', 'User not found. Please try again.');
      return;
    }

    // Validation
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title for your space');
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    if (!formData.address.trim()) {
      Alert.alert('Error', 'Please enter an address');
      return;
    }
    if (!formData.city.trim()) {
      Alert.alert('Error', 'Please enter a city');
      return;
    }
    if (!formData.pricePerMonth || isNaN(Number(formData.pricePerMonth))) {
      Alert.alert('Error', 'Please enter a valid price per month');
      return;
    }
    if (!formData.size.trim()) {
      Alert.alert('Error', 'Please enter the size of your space');
      return;
    }

    setIsSubmitting(true);

    try {
      await createSpace({
        title: formData.title.trim(),
        description: formData.description.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        pricePerMonth: Number(formData.pricePerMonth),
        spaceType: formData.spaceType as any,
        size: formData.size.trim(),
        amenities: selectedAmenities,
        images: [], // TODO: Add image upload functionality
        ownerId: currentUserId as any,
        minimumRentalPeriod: Number(formData.minimumRentalPeriod),
        accessHours: formData.accessHours,
        securityFeatures: selectedSecurityFeatures,
      });

      Alert.alert(
        'Success!',
        'Your space has been listed successfully.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error creating space:', error);
      Alert.alert('Error', 'Failed to create space. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  if (!currentUserId) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
        <View style={styles.loadingContainer}>
          <MaterialIcons name="hourglass-empty" size={48} color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            onPress={handleBack}
          >
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>List Your Space</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Basic Information */}
        <GradientCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Title *</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              placeholder="e.g., Spacious Garage Storage in City Center"
              placeholderTextColor={colors.textTertiary}
              value={formData.title}
              onChangeText={(value) => handleInputChange('title', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Description *</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              placeholder="Describe your space, its features, and what makes it special..."
              placeholderTextColor={colors.textTertiary}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Space Type *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeSelector}>
              {SPACE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeChip,
                    formData.spaceType === type.id && { backgroundColor: colors.primary },
                    formData.spaceType !== type.id && { backgroundColor: colors.surface, borderColor: colors.border }
                  ]}
                  onPress={() => handleInputChange('spaceType', type.id)}
                >
                  <MaterialIcons 
                    name={type.icon as any} 
                    size={18} 
                    color={formData.spaceType === type.id ? '#FFFFFF' : colors.textSecondary} 
                  />
                  <Text style={[
                    styles.typeChipText,
                    { color: formData.spaceType === type.id ? '#FFFFFF' : colors.textSecondary }
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </GradientCard>

        {/* Location */}
        <GradientCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Location</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Address *</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              placeholder="e.g., 123 Main Street"
              placeholderTextColor={colors.textTertiary}
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>City *</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              placeholder="e.g., Dublin"
              placeholderTextColor={colors.textTertiary}
              value={formData.city}
              onChangeText={(value) => handleInputChange('city', value)}
            />
          </View>
        </GradientCard>

        {/* Pricing & Details */}
        <GradientCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Pricing & Details</Text>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Price per Month (€) *</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                placeholder="150"
                placeholderTextColor={colors.textTertiary}
                value={formData.pricePerMonth}
                onChangeText={(value) => handleInputChange('pricePerMonth', value)}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Size *</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                placeholder="e.g., 10x10 ft"
                placeholderTextColor={colors.textTertiary}
                value={formData.size}
                onChangeText={(value) => handleInputChange('size', value)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Min. Rental (months)</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                placeholder="1"
                placeholderTextColor={colors.textTertiary}
                value={formData.minimumRentalPeriod}
                onChangeText={(value) => handleInputChange('minimumRentalPeriod', value)}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Access Hours</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                placeholder="24/7"
                placeholderTextColor={colors.textTertiary}
                value={formData.accessHours}
                onChangeText={(value) => handleInputChange('accessHours', value)}
              />
            </View>
          </View>
        </GradientCard>

        {/* Amenities */}
        <GradientCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Amenities</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Select all amenities that apply to your space
          </Text>
          
          <View style={styles.checkboxGrid}>
            {AMENITIES.map((amenity) => (
              <TouchableOpacity
                key={amenity.id}
                style={[
                  styles.checkboxItem,
                  { 
                    backgroundColor: selectedAmenities.includes(amenity.id) ? colors.primary : colors.surface,
                    borderColor: selectedAmenities.includes(amenity.id) ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => toggleAmenity(amenity.id)}
              >
                <MaterialIcons 
                  name={amenity.icon as any} 
                  size={18} 
                  color={selectedAmenities.includes(amenity.id) ? '#FFFFFF' : colors.textSecondary} 
                />
                <Text style={[
                  styles.checkboxText,
                  { color: selectedAmenities.includes(amenity.id) ? '#FFFFFF' : colors.textSecondary }
                ]}>
                  {amenity.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GradientCard>

        {/* Security Features */}
        <GradientCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Security Features</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Select all security features available
          </Text>
          
          <View style={styles.checkboxGrid}>
            {SECURITY_FEATURES.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={[
                  styles.checkboxItem,
                  { 
                    backgroundColor: selectedSecurityFeatures.includes(feature.id) ? colors.success : colors.surface,
                    borderColor: selectedSecurityFeatures.includes(feature.id) ? colors.success : colors.border,
                  }
                ]}
                onPress={() => toggleSecurityFeature(feature.id)}
              >
                <MaterialIcons 
                  name={feature.icon as any} 
                  size={18} 
                  color={selectedSecurityFeatures.includes(feature.id) ? '#FFFFFF' : colors.textSecondary} 
                />
                <Text style={[
                  styles.checkboxText,
                  { color: selectedSecurityFeatures.includes(feature.id) ? '#FFFFFF' : colors.textSecondary }
                ]}>
                  {feature.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GradientCard>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <AnimatedButton
            title={isSubmitting ? "Creating Space..." : "List My Space"}
            onPress={handleSubmit}
            variant="primary"
            size="large"
            icon="add"
            disabled={isSubmitting}
            gradient
          />
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
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '500',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '500',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  typeSelector: {
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    minWidth: '45%',
  },
  checkboxText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  submitContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
});