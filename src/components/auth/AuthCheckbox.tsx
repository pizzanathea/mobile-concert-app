import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthColors, AuthFonts } from './theme';

type AuthCheckboxProps = {
  checked: boolean;
  onPress: () => void;
  label: string;
  error?: string;
};

export function AuthCheckbox({ checked, onPress, label, error }: AuthCheckboxProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
        hitSlop={8}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        style={styles.row}>
        <View style={[styles.box, checked && styles.boxChecked, error && styles.boxError]}>
          {checked ? <Check size={14} color={AuthColors.background} strokeWidth={3} /> : null}
        </View>
        <Text style={styles.label}>{label}</Text>
      </Pressable>
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 7,
  },
  row: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  box: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#4B4B4B',
    backgroundColor: '#F0ECEC',
  },
  boxChecked: {
    borderColor: AuthColors.primary,
    backgroundColor: AuthColors.primary,
  },
  boxError: {
    borderColor: AuthColors.error,
  },
  label: {
    flex: 1,
    color: AuthColors.textSecondary,
    fontFamily: AuthFonts.body,
    fontSize: 12,
    lineHeight: 18,
  },
  error: {
    color: AuthColors.error,
    fontFamily: AuthFonts.body,
    fontSize: 12,
  },
});
