import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/app/contexts/ThemeContext';
import { GradientCard } from './GradientCard';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function ThemeToggle() {
  const { theme, setTheme, colors, isDark } = useTheme();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setTheme(newTheme);
  };

  const themes = [
    { key: 'light', label: 'Light', icon: 'light-mode' },
    { key: 'dark', label: 'Dark', icon: 'dark-mode' },
    { key: 'system', label: 'System', icon: 'settings' },
  ] as const;

  return (
    <GradientCard style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="palette" size={24} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>Theme</Text>
      </View>
      
      <View style={styles.optionsContainer}>
        {themes.map((themeOption) => (
          <TouchableOpacity
            key={themeOption.key}
            style={[
              styles.option,
              {
                backgroundColor: theme === themeOption.key ? colors.primary : colors.surface,
                borderColor: colors.border,
              }
            ]}
            onPress={() => handleThemeChange(themeOption.key)}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={themeOption.icon as any}
              size={20}
              color={theme === themeOption.key ? '#FFFFFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.optionText,
                {
                  color: theme === themeOption.key ? '#FFFFFF' : colors.textSecondary,
                }
              ]}
            >
              {themeOption.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </GradientCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});