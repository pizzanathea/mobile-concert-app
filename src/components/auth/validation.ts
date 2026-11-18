export function getEmailError(email: string): string | undefined {
  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    return 'Enter your email address.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return 'Enter a valid email address.';
  }

  return undefined;
}
