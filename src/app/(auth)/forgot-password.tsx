import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TextInputInstance } from 'react-native';
import { z } from 'zod';

import { AuthFooter } from '@/components/auth/AuthFooter';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { PrimaryButton } from '@/components/auth/PrimaryButton';
import { AuthColors, AuthFonts } from '@/components/auth/theme';
import { getAuthErrorMessage, requestPasswordReset } from '@/services/auth';

const resetSchema = z.object({
  email: z.string().trim().min(1, 'Enter your email address.').email('Enter a valid email address.'),
});

type ResetValues = z.infer<typeof resetSchema>;

export default function ForgotPasswordScreen() {
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(
    null
  );
  const emailInput = useRef<TextInputInstance>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    mode: 'onChange',
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ResetValues) => {
    setFeedback(null);

    try {
      await requestPasswordReset(values);
      setFeedback({
        type: 'success',
        message: 'If an account exists for this email, password reset instructions will be sent.',
      });
    } catch (error) {
      setFeedback({ type: 'error', message: getAuthErrorMessage(error, 'send reset instructions') });
    }
  };

  return (
    <AuthScreen>
      <AuthHeader
        title="Reset Your Password"
        description="Enter the email address associated with your account."
      />

      <View style={styles.formCard}>
        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                label="Email Address"
                value={value}
                inputRef={emailInput}
                onChangeText={onChange}
                onBlur={onBlur}
                leftIcon={<Mail size={18} color={AuthColors.textSecondary} strokeWidth={1.8} />}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="done"
                onSubmitEditing={() => void handleSubmit(onSubmit)()}
                error={errors.email?.message}
              />
            )}
          />

          <PrimaryButton
            title="SEND RESET INSTRUCTIONS"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
            loading={isSubmitting}
          />

          {feedback ? (
            <Text
              style={[styles.feedback, feedback.type === 'error' && styles.feedbackError]}
              accessibilityLiveRegion="polite">
              {feedback.message}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerPrompt}>Remembered your password?</Text>
        <Link href="/(auth)/login" asChild>
          <Pressable accessibilityRole="link" hitSlop={8}>
            <Text style={styles.footerLink}>Sign in</Text>
          </Pressable>
        </Link>
      </View>
      <AuthFooter prompt="New to Z FEST?" linkText="Create an account" href="/(auth)/register" />
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
  feedback: {
    color: AuthColors.success,
    fontFamily: AuthFonts.body,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  feedbackError: {
    color: AuthColors.error,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 22,
  },
  footerPrompt: {
    color: AuthColors.textSecondary,
    fontFamily: AuthFonts.body,
    fontSize: 13,
  },
  footerLink: {
    color: AuthColors.primary,
    fontFamily: AuthFonts.bodyBold,
    fontSize: 13,
  },
});
