import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTheme } from '@/app/contexts/ThemeContext';
import { GradientCard } from '@/app/components/ui/GradientCard';
import * as Haptics from 'expo-haptics';

export default function MessagesScreen() {
  const { colors, isDark } = useTheme();

  // Mock conversations data
  const conversations = [
    {
      id: '1',
      participant: {
        name: 'Emma Walsh',
        avatar: 'E',
        isOnline: true,
      },
      lastMessage: {
        text: "Hi! I'm interested in your garage space. Is it still available?",
        timestamp: '2 min ago',
        isRead: false,
      },
      space: {
        title: 'Spacious Garage Storage',
        type: 'garage',
      },
    },
    {
      id: '2',
      participant: {
        name: 'James Murphy',
        avatar: 'J',
        isOnline: false,
      },
      lastMessage: {
        text: "Thank you for the quick response! I'll pick up my items tomorrow.",
        timestamp: '1 hour ago',
        isRead: true,
      },
      space: {
        title: 'Clean Basement Room',
        type: 'basement',
      },
    },
    {
      id: '3',
      participant: {
        name: 'Sarah Johnson',
        avatar: 'S',
        isOnline: true,
      },
      lastMessage: {
        text: 'The access code works perfectly. Thanks!',
        timestamp: '3 hours ago',
        isRead: true,
      },
      space: {
        title: 'Modern Storage Unit',
        type: 'storage_unit',
      },
    },
  ];

  const handleConversationPress = (conversationId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Navigate to individual chat screen
    router.push(`/chat/${conversationId}`);
  };

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const renderConversation = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.conversationCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => handleConversationPress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.conversationHeader}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{item.participant.avatar}</Text>
          </LinearGradient>
          {item.participant.isOnline && (
            <View style={[styles.onlineIndicator, { backgroundColor: colors.success }]} />
          )}
        </View>

        <View style={styles.conversationInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.participantName, { color: colors.text }]}>
              {item.participant.name}
            </Text>
            <Text style={[styles.timestamp, { color: colors.textTertiary }]}>
              {item.lastMessage.timestamp}
            </Text>
          </View>

          <View style={styles.spaceRow}>
            <MaterialIcons 
              name={getSpaceIcon(item.space.type)} 
              size={14} 
              color={colors.textSecondary} 
            />
            <Text style={[styles.spaceTitle, { color: colors.textSecondary }]} numberOfLines={1}>
              {item.space.title}
            </Text>
          </View>

          <View style={styles.messageRow}>
            <Text 
              style={[
                styles.lastMessage, 
                { 
                  color: item.lastMessage.isRead ? colors.textSecondary : colors.text,
                  fontWeight: item.lastMessage.isRead ? '500' : '600',
                }
              ]} 
              numberOfLines={2}
            >
              {item.lastMessage.text}
            </Text>
            {!item.lastMessage.isRead && (
              <View style={[styles.unreadIndicator, { backgroundColor: colors.primary }]} />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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

  const unreadCount = conversations.filter(c => !c.lastMessage.isRead).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Messages</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <MaterialIcons name="search" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <LinearGradient
            colors={[colors.secondary, colors.accent]}
            style={styles.emptyIcon}
          >
            <MaterialIcons name="message" size={48} color="#FFFFFF" />
          </LinearGradient>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No messages yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            When someone contacts you about your spaces, their messages will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  conversationCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  conversationHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  conversationInfo: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantName: {
    fontSize: 16,
    fontWeight: '700',
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '500',
  },
  spaceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  spaceTitle: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
});