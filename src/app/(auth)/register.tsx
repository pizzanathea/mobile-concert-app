import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, UserRound } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
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
import { getAuthErrorMessage, register } from '@/services/auth';

const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Enter your full name.'),
    email: z.string().trim().min(1, 'Enter your email address.').email('Enter a valid email address.'),
    password: z.string().min(8, 'Use at least 8 characters for your password.'),
    confirmPassword: z.string().min(1, 'Confirm your password.'),
    acceptedTerms: z.boolean().refine((accepted) => accepted, 'You must accept the terms to continue.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Your passwords do not match.',
  });

type RegisterValues = z.infer<typeof registerSchema>;
type Feedback = { type: 'error' | 'success'; message: string };

export default function RegisterScreen() {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const emailInput = useRef<TextInputInstance>(null);
  const passwordInput = useRef<TextInputInstance>(null);
  const confirmPasswordInput = useRef<TextInputInstance>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptedTerms: false,
    },
  });

  const onSubmit = async ({ fullName, email, password }: RegisterValues) => {
    setFeedback(null);

    try {
      await register({ fullName, email, password });
      setFeedback({
        type: 'success',
        message: 'Registration request accepted. Account and session handling still need to be connected.',
      });
    } catch (error) {
      setFeedback({ type: 'error', message: getAuthErrorMessage(error, 'create your account') });
    }
  };

  return (
    <AuthScreen>
      <AuthHeader
        title="Create Your Account"
        description=""
      />

      <View style={styles.formCard}>
        <View style={styles.form}>
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                label="Full Name"
                value={value}
                onSubmitEditing={() => emailInput.current?.focus()}
                onChangeText={onChange}
                onBlur={onBlur}
                leftIcon={<UserRound size={18} color={AuthColors.textSecondary} strokeWidth={1.8} />}
                placeholder="Full Name"
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                returnKeyType="next"
                error={errors.fullName?.message}
              />
            )}
          />

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
                placeholder="Email Address"
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
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordInput.current?.focus()}
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordInput
                label="Confirm Password"
                value={value}
                inputRef={confirmPasswordInput}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Confirm Password"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={() => void handleSubmit(onSubmit)()}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="acceptedTerms"
            render={({ field: { onChange, value } }) => (
              <AuthCheckbox
                checked={value}
                onPress={() => onChange(!value)}
                label="I agree to the Z FEST terms and privacy policy."
                error={errors.acceptedTerms?.message}
              />
            )}
          />

          <PrimaryButton
            title="CREATE ACCOUNT"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
            loading={isSubmitting}
          />
          {feedback ? (
            <Text
              style={[
                styles.feedback,
                feedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess,
              ]}
              accessibilityLiveRegion="polite">
              {feedback.message}
            </Text>
          ) : null}
        </View>
      </View>

      <AuthFooter
        prompt="Already have an account?"
        linkText="Sign in"
        href="/(auth)/login"
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
    gap: 16,
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
