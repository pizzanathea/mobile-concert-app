import { Checkbox, Host } from '@expo/ui';
import { Pressable, Text, View } from 'react-native';

type AuthCheckboxProps = {
  checked: boolean;
  onPress: () => void;
  label: string;
  error?: string;
};

export function AuthCheckbox({ checked, onPress, label, error }: AuthCheckboxProps) {
  return (
    <View className="gap-2">
      <View className="min-h-10 flex-row items-center gap-2.5">
        <Host matchContents style={{ width: 24, height: 24 }}>
          <Checkbox value={checked} onValueChange={onPress} />
        </Host>
        <Pressable
          onPress={onPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityState={{ checked }}
          className="min-h-10 flex-1 justify-center">
          <Text className="text-xs leading-[18px] text-[#4B4B4B]">{label}</Text>
        </Pressable>
      </View>
      {error ? (
        <Text className="text-xs text-[#DC2626]" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
