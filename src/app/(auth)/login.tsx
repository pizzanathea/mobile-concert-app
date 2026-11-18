import { Link } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { TextInputRef } from '@expo/ui';

import { AuthFooter } from '@/components/auth/AuthFooter';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { PrimaryButton } from '@/components/auth/PrimaryButton';
import { getEmailError } from '@/components/auth/validation';
import { getAuthErrorMessage, signIn } from '@/services/auth';

type LoginValues = {
  email: string;
  password: string;
};

type LoginField = keyof LoginValues;
type Feedback = { type: 'error' | 'success'; message: string };

export default function LoginScreen() {
  const [values, setValues] = useState<LoginValues>({ email: '', password: '' });
  const [touched, setTouched] = useState<Partial<Record<LoginField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const emailInput = useRef<TextInputRef>(null);
  const passwordInput = useRef<TextInputRef>(null);

  const errors = {
    email: getEmailError(values.email),
    password: values.password ? undefined : 'Enter your password.',
  };
  const isValid = !errors.email && !errors.password;

  const updateField = (field: LoginField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFeedback(null);
  };

  const onSubmit = async () => {
    setSubmitted(true);
    if (!isValid) {
      return;
    }

    setFeedback(null);
    setIsSubmitting(true);

    try {
      await signIn({ email: values.email.trim(), password: values.password });
      setFeedback({
        type: 'success',
        message: 'Sign-in request accepted. Session management still needs to be connected.',
      });
    } catch (error) {
      setFeedback({ type: 'error', message: getAuthErrorMessage(error, 'sign in') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreen title="Login to Your Account">
      <View
        className="rounded-[14px] border border-[#DDDDDD] bg-[#EEEEEE] px-5 py-[25px] sm:px-8"
        style={{
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        }}>
        <View className="gap-2">
          <AuthInput
            label="Email"
            value={values.email}
            inputRef={emailInput}
            onChangeText={(value) => updateField('email', value)}
            onBlur={() => setTouched((current) => ({ ...current, email: true }))}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            returnKeyType="next"
            onSubmitEditing={() => passwordInput.current?.focus()}
            error={(touched.email || submitted) ? errors.email : undefined}
          />

          <PasswordInput
            label="Password"
            value={values.password}
            inputRef={passwordInput}
            onChangeText={(value) => updateField('password', value)}
            onBlur={() => setTouched((current) => ({ ...current, password: true }))}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="current-password"
            returnKeyType="done"
            onSubmitEditing={() => void onSubmit()}
            error={(touched.password || submitted) ? errors.password : undefined}
          />

          <PrimaryButton
            title="LOGIN"
            onPress={() => void onSubmit()}
            disabled={!isValid}
            loading={isSubmitting}
          />
          <View className="mt-[14px] items-center">
            <Link href="/(auth)/forgot-password" asChild>
              <Pressable accessibilityRole="link" hitSlop={8}>
                <Text
                  className="text-[12px] font-medium text-[#FF9900]"
                  style={{ fontFamily: 'Arial' }}>
                  Forgot Password?
                </Text>
              </Pressable>
            </Link>
          </View>
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
        prompt="Don't have an account?"
        linkText="Sign up"
        href="/(auth)/register"
      />
    </AuthScreen>
  );
}
