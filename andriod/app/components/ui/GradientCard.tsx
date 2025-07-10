import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/app/contexts/ThemeContext';

interface GradientCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: boolean;
  colors?: string[];
}

export function GradientCard({ children, style, gradient = false, colors }: GradientCardProps) {
  const { colors: themeColors, isDark } = useTheme();
  
  const defaultColors = colors || [themeColors.gradientStart, themeColors.gradientEnd];
  
  if (gradient) {
    return (
      <LinearGradient
        colors={defaultColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[
      styles.card,
      { 
        backgroundColor: themeColors.card,
        shadowColor: themeColors.shadow,
        borderColor: themeColors.border,
      },
      isDark && styles.darkCard,
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
  },
  darkCard: {
    shadowOpacity: 0.3,
    elevation: 8,
  },
});