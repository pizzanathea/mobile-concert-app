import { Host, TextInput as ExpoTextInput } from '@expo/ui';
import type { TextInputProps, TextInputRef } from '@expo/ui';
import { useState, type ReactNode, type Ref } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AuthColors } from './theme';

type AuthInputProps = Omit<
  TextInputProps,
  'defaultValue' | 'ref' | 'style' | 'textStyle' | 'value'
> & {
  label: string;
  value: string;
  error?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
  inputRef?: Ref<TextInputRef>;
};

export function AuthInput({
  label,
  value,
  error,
  leftIcon,
  rightElement,
  inputRef,
  onFocus,
  onBlur,
  ...inputProps
}: AuthInputProps) {
  const [focused, setFocused] = useState(false);
  const focusProgress = useSharedValue(0);
  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focusProgress.get(),
      [0, 1],
      [error ? AuthColors.error : AuthColors.border, AuthColors.primary]
    ),
  }));

  const handleFocus: TextInputProps['onFocus'] = () => {
    setFocused(true);
    focusProgress.set(withTiming(1, { duration: 180, easing: Easing.linear }));
    onFocus?.();
  };

  const handleBlur: TextInputProps['onBlur'] = () => {
    setFocused(false);
    focusProgress.set(withTiming(0, { duration: 180, easing: Easing.linear }));
    onBlur?.();
  };

  return (
    <View>
      <Animated.View
        className="relative h-[44px] border-b bg-transparent"
        style={[animatedBorderStyle, error && !focused && { borderColor: AuthColors.error }]}>
        <Host matchContents style={{ width: '100%', height: 44 }}>
          <ExpoTextInput
            {...inputProps}
            ref={inputRef}
            defaultValue={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
              width: '100%',
              height: 44,
              paddingVertical: 10,
              paddingLeft: leftIcon ? 32 : 0,
              paddingRight: rightElement ? 38 : 0,
              backgroundColor: 'transparent',
              borderRadius: 0,
              borderWidth: 0,
            }}
            textStyle={{ color: AuthColors.text, fontSize: 14, fontFamily: 'Arial' }}
            placeholderTextColor={AuthColors.muted}
            accessibilityLabel={label}
            selectionColor={AuthColors.primary}
          />
        </Host>
        {leftIcon ? (
          <View
            pointerEvents="none"
            className="absolute left-1 top-0 h-[44px] items-center justify-center">
            {leftIcon}
          </View>
        ) : null}
        {rightElement ? (
          <View className="absolute right-0 top-0 h-[44px] items-center justify-center">
            {rightElement}
          </View>
        ) : null}
      </Animated.View>
      {error ? (
        <Text className="text-xs text-[#DC2626]" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
