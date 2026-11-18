import { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import type { TextInputRef } from '@expo/ui';

import { AuthCheckbox } from '@/components/auth/AuthCheckbox';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { PrimaryButton } from '@/components/auth/PrimaryButton';
import { getEmailError } from '@/components/auth/validation';
import { getAuthErrorMessage, register } from '@/services/auth';

type RegisterValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

type RegisterField = keyof RegisterValues;
type Feedback = { type: 'error' | 'success'; message: string };

function validate(values: RegisterValues) {
  const fullName = values.fullName.trim().length >= 2 ? undefined : 'Enter your full name.';
  const email = getEmailError(values.email);
  const password =
    values.password.length >= 8 ? undefined : 'Use at least 8 characters for your password.';
  const confirmPassword = !values.confirmPassword
    ? 'Confirm your password.'
    : values.password !== values.confirmPassword
      ? 'Your passwords do not match.'
      : undefined;
  const acceptedTerms = values.acceptedTerms
    ? undefined
    : 'You must accept the terms to continue.';

  return { fullName, email, password, confirmPassword, acceptedTerms };
}

export default function RegisterScreen() {
  const [values, setValues] = useState<RegisterValues>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });
  const [touched, setTouched] = useState<Partial<Record<RegisterField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const fullNameInput = useRef<TextInputRef>(null);
  const emailInput = useRef<TextInputRef>(null);
  const passwordInput = useRef<TextInputRef>(null);
  const confirmPasswordInput = useRef<TextInputRef>(null);

  const errors = validate(values);
  const isValid = Object.values(errors).every((error) => !error);
  const visibleError = (field: RegisterField) =>
    submitted || touched[field] ? errors[field] : undefined;

  const updateField = <Field extends RegisterField>(
    field: Field,
    value: RegisterValues[Field]
  ) => {
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
      await register({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      setFeedback({
        type: 'success',
        message:
          'Registration request accepted. Account and session handling still need to be connected.',
      });
    } catch (error) {
      setFeedback({ type: 'error', message: getAuthErrorMessage(error, 'create your account') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreen title="Create Your Account">
      <View
        className="rounded-[14px] border border-[#DDDDDD] bg-[#EEEEEE] px-6 py-[28px] sm:px-[38px]"
        style={{
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        }}>
        <View className="gap-3">
          <AuthInput
            label="Full Name"
            value={values.fullName}
            inputRef={fullNameInput}
            onChangeText={(value) => updateField('fullName', value)}
            onBlur={() => setTouched((current) => ({ ...current, fullName: true }))}
            placeholder="Full Name"
            autoCapitalize="words"
            autoComplete="name"
            returnKeyType="next"
            onSubmitEditing={() => emailInput.current?.focus()}
            error={visibleError('fullName')}
          />

          <AuthInput
            label="Email Address"
            value={values.email}
            inputRef={emailInput}
            onChangeText={(value) => updateField('email', value)}
            onBlur={() => setTouched((current) => ({ ...current, email: true }))}
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            returnKeyType="next"
            onSubmitEditing={() => passwordInput.current?.focus()}
            error={visibleError('email')}
          />

          <PasswordInput
            label="Password"
            value={values.password}
            inputRef={passwordInput}
            onChangeText={(value) => updateField('password', value)}
            onBlur={() => setTouched((current) => ({ ...current, password: true }))}
            placeholder="At least 8 characters"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="new-password"
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordInput.current?.focus()}
            error={visibleError('password')}
          />

          <PasswordInput
            label="Confirm Password"
            value={values.confirmPassword}
            inputRef={confirmPasswordInput}
            onChangeText={(value) => updateField('confirmPassword', value)}
            onBlur={() => setTouched((current) => ({ ...current, confirmPassword: true }))}
            placeholder="Confirm Password"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="new-password"
            returnKeyType="done"
            onSubmitEditing={() => void onSubmit()}
            error={visibleError('confirmPassword')}
          />

          <AuthCheckbox
            checked={values.acceptedTerms}
            onPress={() => updateField('acceptedTerms', !values.acceptedTerms)}
            label="I agree to the Z FEST terms and privacy policy."
            error={visibleError('acceptedTerms')}
          />

          <PrimaryButton
            title="CREATE ACCOUNT"
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
        prompt="Already have an account?"
        linkText="Sign in"
        href="/(auth)/login"
      />
    </AuthScreen>
  );
}
