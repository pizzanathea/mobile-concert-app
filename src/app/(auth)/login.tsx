import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react-native';
import { Link } from 'expo-router';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TextInputInstance } from 'react-native';
import { z } from 'zod';

import { AuthCheckbox } from '@/components/auth/AuthCheckbox';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { PrimaryButton } from '@/components/auth/PrimaryButton';
import { AuthColors, AuthFonts } from '@/components/auth/theme';
import { getAuthErrorMessage, signIn } from '@/services/auth';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Enter your email address.').email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
});

type LoginValues = z.infer<typeof loginSchema>;
type Feedback = { type: 'error' | 'success'; message: string };

export default function LoginScreen() {
  const [rememberMe, setRememberMe] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const emailInput = useRef<TextInputInstance>(null);
  const passwordInput = useRef<TextInputInstance>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginValues) => {
    setFeedback(null);

    try {
      await signIn(values);
      setFeedback({
        type: 'success',
        message: 'Sign-in request accepted. Session management still needs to be connected.',
      });
    } catch (error) {
      setFeedback({ type: 'error', message: getAuthErrorMessage(error, 'sign in') });
    }
  };

  return (
    <AuthScreen>
      <AuthHeader
        title="Login to Your Account"
        description=""
      />

      <View style={styles.formCard}>
        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                label="Email"
                value={value}
                inputRef={emailInput}
                onChangeText={onChange}
                onBlur={onBlur}
                leftIcon={<Mail size={18} color={AuthColors.textSecondary} strokeWidth={1.8} />}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                onSubmitEditing={() => passwordInput.current?.focus()}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordInput
                label="Password"
                value={value}
                inputRef={passwordInput}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Password"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={() => void handleSubmit(onSubmit)()}
                error={errors.password?.message}
              />
            )}
          />

          <View style={styles.optionsRow}>
            <AuthCheckbox
              checked={rememberMe}
              onPress={() => setRememberMe((current) => !current)}
              label="Remember me"
            />
            <Link href="/(auth)/forgot-password" asChild>
              <Pressable accessibilityRole="link" hitSlop={8}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </Pressable>
            </Link>
          </View>

          <PrimaryButton
            title="LOGIN"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
            loading={isSubmitting}
          />
          {feedback ? (
            <Text
              style={[
                styles.feedback,
                feedback.type === 'error' && styles.feedbackError,
                feedback.type === 'success' && styles.feedbackSuccess,
              ]}
              accessibilityLiveRegion="polite">
              {feedback.message}
            </Text>
          ) : null}
        </View>
      </View>

      <AuthFooter
        prompt="Don't have an account?"
        linkText="Sign up"
        href="/(auth)/register"
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: '#E6E6E6',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  form: {
    gap: 20,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: -7,
  },
  forgotPassword: {
    color: AuthColors.primary,
    fontFamily: AuthFonts.bodySemibold,
    fontSize: 12,
  },
  feedback: {
    color: AuthColors.textSecondary,
    fontFamily: AuthFonts.body,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  feedbackError: {
    color: AuthColors.error,
  },
  feedbackSuccess: {
    color: AuthColors.success,
  },
});
