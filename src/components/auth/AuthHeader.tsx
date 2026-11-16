import { Music2 } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { AuthColors, AuthFonts } from './theme';

type AuthHeaderProps = {
  title: string;
  description: string;
};

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.brandWrap}>
        <View style={styles.brand}>
          <View style={styles.logoMark}>
            <Music2 size={16} color={AuthColors.background} strokeWidth={2.6} />
          </View>
          <Text style={styles.brandText}>
            Z <Text style={styles.brandAccent}>FEST</Text>
          </Text>
        </View>
      </View>

      <View style={styles.headerTitleWrap}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
    width: '100%',
  },
  brandWrap: {
    borderBottomWidth: 1,
    borderBottomColor: '#D9D1D2',
    paddingBottom: 14,
    marginBottom: 26,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoMark: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: AuthColors.primary,
  },
  brandText: {
    color: AuthColors.text,
    fontFamily: AuthFonts.headingStrong,
    fontSize: 16,
    letterSpacing: 1,
  },
  brandAccent: {
    color: AuthColors.primary,
  },
  headerTitleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  title: {
    color: AuthColors.text,
    fontFamily: AuthFonts.headingStrong,
    fontSize: 34,
    lineHeight: 42,
    letterSpacing: -1.2,
    textAlign: 'center',
  },
  description: {
    marginTop: 10,
    color: AuthColors.textSecondary,
    fontFamily: AuthFonts.body,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
});
