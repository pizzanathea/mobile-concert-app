import type { Href } from 'expo-router';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

type AuthFooterProps = {
  prompt: string;
  linkText: string;
  href: Href;
};

export function AuthFooter({ prompt, linkText, href }: AuthFooterProps) {
  return (
    <View className="mt-[22px] flex-row flex-wrap items-center justify-center gap-[5px]">
      <Text className="text-[13px] text-[#4B4B4B]">{prompt}</Text>
      <Link href={href} asChild>
        <Pressable accessibilityRole="link" hitSlop={8}>
          <Text className="text-[13px] font-bold text-[#FF9900]">{linkText}</Text>
        </Pressable>
      </Link>
    </View>
  );
}
