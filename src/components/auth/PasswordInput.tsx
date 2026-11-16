import { Eye, EyeOff, LockKeyhole } from 'lucide-react-native';
import { useState } from 'react';
import type { Ref } from 'react';
import { Pressable, StyleSheet, type TextInputInstance, type TextInputProps } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AuthInput } from './AuthInput';
import { AuthColors } from './theme';

type PasswordInputProps = Omit<TextInputProps, 'secureTextEntry' | 'style'> & {
  label: string;
  error?: string;
  inputRef?: Ref<TextInputInstance>;
};

export function PasswordInput({ label, error, ...inputProps }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const visibilityProgress = useSharedValue(0);
  const visibilityStyle = useAnimatedStyle(() => ({
    opacity: 0.75 + visibilityProgress.get() * 0.25,
    transform: [{ scale: 0.94 + visibilityProgress.get() * 0.06 }],
  }));
  const toggleVisibility = () => {
    const nextVisible = !visible;
    setVisible(nextVisible);
    visibilityProgress.set(withTiming(nextVisible ? 1 : 0, { duration: 150, easing: Easing.linear }));
  };

  return (
    <AuthInput
      {...inputProps}
      label={label}
      error={error}
      leftIcon={<LockKeyhole size={18} color={AuthColors.textSecondary} strokeWidth={1.8} />}
      secureTextEntry={!visible}
      rightElement={
        <Pressable
          onPress={toggleVisibility}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}>
          <Animated.View style={[styles.visibilityIcon, visibilityStyle]}>
            {visible ? (
              <EyeOff size={18} color={AuthColors.textSecondary} strokeWidth={1.9} />
            ) : (
              <Eye size={18} color={AuthColors.textSecondary} strokeWidth={1.9} />
            )}
          </Animated.View>
        </Pressable>
      }
    />
  );
}

const styles = StyleSheet.create({
  visibilityIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
