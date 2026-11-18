import { ActivityIndicator, Pressable, Text } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AuthColors } from './theme';

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
    <Animated.View     className="mt-[24px]" style={animatedStyle}>
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
        className={`h-9 items-center justify-center border border-[#222222] bg-white ${
          unavailable ? 'opacity-70' : 'active:opacity-90'
        }`}>
        {loading ? (
          <ActivityIndicator color={AuthColors.text} />
        ) : (
          <Text
            className="text-[12px] font-bold tracking-[1px] text-[#111111]"
            style={{ fontFamily: 'Arial' }}>
            {title}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}
