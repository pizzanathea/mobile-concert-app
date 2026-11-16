import type { Href } from 'expo-router';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthColors, AuthFonts } from './theme';

type AuthFooterProps = {
  prompt: string;
  linkText: string;
  href: Href;
};

export function AuthFooter({ prompt, linkText, href }: AuthFooterProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{prompt}</Text>
      <Link href={href} asChild>
        <Pressable accessibilityRole="link" hitSlop={8}>
          <Text style={styles.link}>{linkText}</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 22,
  },
  prompt: {
    color: AuthColors.textSecondary,
    fontFamily: AuthFonts.body,
    fontSize: 13,
  },
  link: {
    color: AuthColors.primary,
    fontFamily: AuthFonts.bodyBold,
    fontSize: 13,
  },
});
