import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/app/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradient?: boolean;
}

export function AnimatedButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  disabled = false,
  style,
  textStyle,
  gradient = false,
}: AnimatedButtonProps) {
  const { colors, isDark } = useTheme();

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        return [
          ...baseStyle,
          { backgroundColor: colors.primary },
          disabled && { backgroundColor: colors.textTertiary },
        ];
      case 'secondary':
        return [
          ...baseStyle,
          { backgroundColor: colors.secondary },
          disabled && { backgroundColor: colors.textTertiary },
        ];
      case 'outline':
        return [
          ...baseStyle,
          { 
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: colors.primary,
          },
          disabled && { borderColor: colors.textTertiary },
        ];
      case 'ghost':
        return [
          ...baseStyle,
          { backgroundColor: 'transparent' },
        ];
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];
    
    switch (variant) {
      case 'primary':
      case 'secondary':
        return [
          ...baseTextStyle,
          { color: '#FFFFFF' },
          disabled && { color: colors.background },
        ];
      case 'outline':
      case 'ghost':
        return [
          ...baseTextStyle,
          { color: colors.primary },
          disabled && { color: colors.textTertiary },
        ];
      default:
        return baseTextStyle;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'medium': return 20;
      case 'large': return 24;
      default: return 20;
    }
  };

  const renderContent = () => (
    <>
      {icon && iconPosition === 'left' && (
        <MaterialIcons
          name={icon}
          size={getIconSize()}
          color={variant === 'primary' || variant === 'secondary' ? '#FFFFFF' : colors.primary}
          style={styles.iconLeft}
        />
      )}
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      {icon && iconPosition === 'right' && (
        <MaterialIcons
          name={icon}
          size={getIconSize()}
          color={variant === 'primary' || variant === 'secondary' ? '#FFFFFF' : colors.primary}
          style={styles.iconRight}
        />
      )}
    </>
  );

  if (gradient && (variant === 'primary' || variant === 'secondary')) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.8}
        style={[style]}
      >
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, styles[size], { backgroundColor: 'transparent' }]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[getButtonStyle(), style]}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  medium: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});