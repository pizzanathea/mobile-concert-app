import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AuthColors, AuthFonts } from './theme';

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function PrimaryButton({ title, onPress, disabled = false, loading = false }: PrimaryButtonProps) {
  const pressedProgress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(1 - pressedProgress.get() * 0.015, {
          duration: 100,
          easing: Easing.linear,
        }),
      },
    ],
  }));
  const unavailable = disabled || loading;

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <Pressable
        onPress={onPress}
        disabled={unavailable}
        onPressIn={() => {
          pressedProgress.set(1);
        }}
        onPressOut={() => {
          pressedProgress.set(0);
        }}
        accessibilityRole="button"
        accessibilityState={{ disabled: unavailable, busy: loading }}
        style={({ pressed }) => [styles.button, unavailable && styles.disabled, pressed && styles.pressed]}>
        {loading ? (
          <ActivityIndicator color={AuthColors.text} />
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 8,
  },
  button: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#111111',
    backgroundColor: '#F5F5F5',
  },
  disabled: {
    opacity: 0.42,
  },
  pressed: {
    opacity: 0.9,
  },
  title: {
    color: '#111111',
    fontFamily: AuthFonts.bodyBold,
    fontSize: 13,
    letterSpacing: 1.5,
  },
});
