import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/app/contexts/ThemeContext';
import { GradientCard } from '@/app/components/ui/GradientCard';
import { ThemeToggle } from '@/app/components/ui/ThemeToggle';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const { colors, isDark } = useTheme();

  // Mock user data
  const user = {
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+353 87 123 4567',
    rating: 4.8,
    totalReviews: 24,
    isVerified: true,
    joinedDate: '2023-06-15',
    totalBookings: 12,
    totalSpaces: 2,
  };

  const handlePress = (action: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log(`Pressed: ${action}`);
  };

  const menuItems = [
    {
      icon: 'edit',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      action: 'edit-profile',
      color: colors.primary,
      bgColor: isDark ? 'rgba(129, 140, 248, 0.2)' : '#EEF2FF',
    },
    {
      icon: 'payment',
      title: 'Payment Methods',
      subtitle: 'Manage cards and payment options',
      action: 'payment-methods',
      color: colors.success,
      bgColor: isDark ? 'rgba(52, 211, 153, 0.2)' : '#D1FAE5',
    },
    {
      icon: 'notifications',
      title: 'Notifications',
      subtitle: 'Customize your notification preferences',
      action: 'notifications',
      color: colors.warning,
      bgColor: isDark ? 'rgba(251, 191, 36, 0.2)' : '#FEF3C7',
    },
    {
      icon: 'security',
      title: 'Privacy & Security',
      subtitle: 'Manage your account security',
      action: 'privacy-security',
      color: colors.error,
      bgColor: isDark ? 'rgba(248, 113, 113, 0.2)' : '#FEE2E2',
    },
    {
      icon: 'help',
      title: 'Help & Support',
      subtitle: 'Get help or contact support',
      action: 'help-support',
      color: '#8B5CF6',
      bgColor: isDark ? 'rgba(139, 92, 246, 0.2)' : '#F3E8FF',
    },
    {
      icon: 'info',
      title: 'About',
      subtitle: 'App version and legal information',
      action: 'about',
      color: colors.textSecondary,
      bgColor: isDark ? 'rgba(148, 163, 184, 0.2)' : '#F3F4F6',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
        </LinearGradient>

        {/* Profile Card */}
        <GradientCard style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.profileImageGradient}
            >
              <Text style={styles.profileInitial}>{user.name.charAt(0)}</Text>
            </LinearGradient>
            <TouchableOpacity style={[styles.editImageButton, { backgroundColor: colors.success }]}>
              <MaterialIcons name="camera-alt" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
              {user.isVerified && (
                <View style={[styles.verifiedBadge, { backgroundColor: isDark ? 'rgba(52, 211, 153, 0.2)' : '#D1FAE5' }]}>
                  <MaterialIcons name="verified" size={20} color={colors.success} />
                </View>
              )}
            </View>
            
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user.email}</Text>
            
            {user.rating > 0 && (
              <View style={styles.ratingRow}>
                <View style={[styles.ratingContainer, { backgroundColor: isDark ? 'rgba(251, 191, 36, 0.2)' : '#FEF3C7' }]}>
                  <MaterialIcons name="star" size={16} color={colors.warning} />
                  <Text style={[styles.ratingText, { color: isDark ? colors.warning : '#92400E' }]}>
                    {user.rating.toFixed(1)} ({user.totalReviews} reviews)
                  </Text>
                </View>
              </View>
            )}
          </View>
        </GradientCard>

        {/* Stats */}
        <GradientCard style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: isDark ? 'rgba(96, 165, 250, 0.2)' : '#DBEAFE' }]}>
              <MaterialIcons name="bookmark" size={20} color={colors.info} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{user.totalBookings}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Bookings</Text>
          </View>
          
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: isDark ? 'rgba(52, 211, 153, 0.2)' : '#D1FAE5' }]}>
              <MaterialIcons name="home" size={20} color={colors.success} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{user.totalSpaces}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Spaces Listed</Text>
          </View>
          
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: isDark ? 'rgba(251, 191, 36, 0.2)' : '#FEF3C7' }]}>
              <MaterialIcons name="calendar-today" size={20} color={colors.warning} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {new Date(user.joinedDate).getFullYear()}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Member Since</Text>
          </View>
        </GradientCard>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Menu Items */}
        <GradientCard style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                { borderBottomColor: colors.borderLight },
                index === menuItems.length - 1 && styles.lastMenuItem,
              ]}
              onPress={() => handlePress(item.action)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: item.bgColor }]}>
                  <MaterialIcons name={item.icon as any} size={20} color={item.color} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </GradientCard>

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            { 
              backgroundColor: colors.card,
              borderColor: isDark ? 'rgba(248, 113, 113, 0.3)' : '#FEE2E2',
              shadowColor: colors.shadow,
            }
          ]}
          onPress={() => handlePress('logout')}
          activeOpacity={0.7}
        >
          <View style={[styles.logoutIcon, { backgroundColor: isDark ? 'rgba(248, 113, 113, 0.2)' : '#FEE2E2' }]}>
            <MaterialIcons name="logout" size={20} color={colors.error} />
          </View>
          <Text style={[styles.logoutText, { color: colors.error }]}>Sign Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textTertiary }]}>Holdhive v1.0.0</Text>
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
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileCard: {
    marginHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImageGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
  },
  verifiedBadge: {
    borderRadius: 12,
    padding: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '500',
  },
  ratingRow: {
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    marginHorizontal: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  statItem: {
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
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  menuContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    marginHorizontal: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 20,
    borderWidth: 2,
    gap: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '500',
  },
});