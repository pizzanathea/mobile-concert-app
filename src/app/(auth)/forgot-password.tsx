import { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import type { TextInputRef } from '@expo/ui';

import { AuthFooter } from '@/components/auth/AuthFooter';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { PrimaryButton } from '@/components/auth/PrimaryButton';
import { getEmailError } from '@/components/auth/validation';
import { getAuthErrorMessage, requestPasswordReset } from '@/services/auth';

type Feedback = { type: 'error' | 'success'; message: string };

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const emailInput = useRef<TextInputRef>(null);
  const emailError = getEmailError(email);
  const isValid = !emailError;

  const onSubmit = async () => {
    setSubmitted(true);
    if (!isValid) {
      return;
    }

    setFeedback(null);
    setIsSubmitting(true);

    try {
      await requestPasswordReset({ email: email.trim() });
      setFeedback({
        type: 'success',
        message: 'If an account exists for this email, password reset instructions will be sent.',
      });
    } catch (error) {
      setFeedback({ type: 'error', message: getAuthErrorMessage(error, 'send reset instructions') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreen
      title="Reset Your Password"
      description="Enter the email address associated with your account.">
      <View
        className="rounded-[14px] border border-[#DDDDDD] bg-[#EEEEEE] px-6 py-[28px] sm:px-[38px]"
        style={{
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        }}>
        <View>
          <AuthInput
            label="Email Address"
            value={email}
            inputRef={emailInput}
            onChangeText={(value) => {
              setEmail(value);
              setFeedback(null);
            }}
            onBlur={() => setTouched(true)}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            returnKeyType="done"
            onSubmitEditing={() => void onSubmit()}
            error={touched || submitted ? emailError : undefined}
          />

          <PrimaryButton
            title="SEND RESET INSTRUCTIONS"
            onPress={() => void onSubmit()}
            disabled={!isValid}
            loading={isSubmitting}
          />

          {feedback ? (
            <Text
              className={`text-center text-xs leading-[18px] ${
                feedback.type === 'error' ? 'text-[#DC2626]' : 'text-[#15803D]'
              }`}
              accessibilityLiveRegion="polite">
              {feedback.message}
            </Text>
          ) : null}
        </View>
      </View>

      <AuthFooter
        prompt="Remembered your password?"
        linkText="Sign in"
        href="/(auth)/login"
      />
      <AuthFooter
        prompt="New to Z FEST?"
        linkText="Create an account"
        href="/(auth)/register"
      />
    </AuthScreen>
  );
}
