import { useState, type ReactNode, type Ref } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputInstance, type TextInputProps } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AuthColors, AuthFonts } from './theme';

type AuthInputProps = Omit<TextInputProps, 'style'> & {
  label: string;
  error?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
  inputRef?: Ref<TextInputInstance>;
};

export function AuthInput({
  label,
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

  const handleFocus: TextInputProps['onFocus'] = (event) => {
    setFocused(true);
    focusProgress.set(withTiming(1, { duration: 180, easing: Easing.linear }));
    onFocus?.(event);
  };

  const handleBlur: TextInputProps['onBlur'] = (event) => {
    setFocused(false);
    focusProgress.set(withTiming(0, { duration: 180, easing: Easing.linear }));
    onBlur?.(event);
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View
        style={[
          styles.inputContainer,
          animatedBorderStyle,
          focused && styles.inputContainerFocused,
          error && !focused && styles.inputContainerError,
        ]}>
        {leftIcon}
        <TextInput
          {...inputProps}
          ref={inputRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={styles.input}
          placeholderTextColor={AuthColors.muted}
          accessibilityLabel={label}
          selectionColor={AuthColors.primary}
        />
        {rightElement}
      </Animated.View>
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    color: AuthColors.textSecondary,
    fontFamily: AuthFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  inputContainer: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#DADADA',
    backgroundColor: '#E7E7E7',
  },
  inputContainerFocused: {
    backgroundColor: '#E7E7E7',
    borderColor: '#111111',
  },
  inputContainerError: {
    borderColor: AuthColors.error,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    color: AuthColors.text,
    fontFamily: AuthFonts.body,
    fontSize: 15,
  },
  error: {
    color: AuthColors.error,
    fontFamily: AuthFonts.body,
    fontSize: 12,
  },
});
