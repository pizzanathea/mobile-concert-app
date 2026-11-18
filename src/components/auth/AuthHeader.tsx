import { Text, View } from 'react-native';

export function AuthHeader() {
  return (
    <View className="h-[76px] w-full justify-center border-b border-[#ECECEC] bg-white px-6 md:px-[4.25%]">
      <View className="w-full max-w-[1464px] self-center">
        <Text
          accessibilityLabel="Z FEST"
          className="text-[28px] font-black leading-[34px] tracking-[-1.2px] text-[#111111]"
          style={{ fontFamily: 'Arial' }}>
          Z<Text className="text-[#FF9900]">FEST</Text>
        </Text>
      </View>
    </View>
  );
}
