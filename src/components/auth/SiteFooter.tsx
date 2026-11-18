import { Text, View } from 'react-native';

export function SiteFooter() {
  return (
    <View className="w-full bg-[#080500] px-5 py-4">
      <View className="min-h-8 w-full max-w-[1016px] flex-row flex-wrap items-center justify-between gap-x-6 gap-y-3 self-center">
        <View className="flex-row flex-wrap items-center gap-x-4 gap-y-1">
          <Text
            className="text-[20px] font-black leading-6 tracking-[-0.7px] text-[#FBBF24]"
            style={{ fontFamily: 'Arial' }}>
            ZFEST
          </Text>
          <Text
            className="text-[11px] leading-4 text-[#A1A1AA]"
            style={{ fontFamily: 'Arial' }}>
            © 2026 Z Fest. All Rights Reserved.
          </Text>
        </View>
        <Text
          className="text-[11px] leading-4 text-[#FBBF24]"
          style={{ fontFamily: 'Arial' }}>
          Terms and Conditions
        </Text>
      </View>
    </View>
  );
}
