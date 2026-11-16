import { create, isAxiosError } from 'axios';

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL;
const loginPath = process.env.EXPO_PUBLIC_AUTH_LOGIN_PATH;
const registerPath = process.env.EXPO_PUBLIC_AUTH_REGISTER_PATH;

// Configure these variables after confirming the paths with the backend owner.
// Response parsing and session storage remain intentionally undefined until their contract exists.
const authClient = create({
  baseURL: apiBaseUrl,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export class AuthIntegrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthIntegrationError';
  }
}

function requireAuthPath(path: string | undefined, variableName: string): string {
  if (!apiBaseUrl) {
    throw new AuthIntegrationError(
      'Authentication is not connected yet. Configure EXPO_PUBLIC_API_URL to continue.'
    );
  }

  if (!path) {
    throw new AuthIntegrationError(
      `Authentication is not connected yet. Configure ${variableName} to continue.`
    );
  }

  return path;
}

export async function signIn(payload: LoginPayload): Promise<void> {
  await authClient.post(requireAuthPath(loginPath, 'EXPO_PUBLIC_AUTH_LOGIN_PATH'), payload);
}

export async function register(payload: RegisterPayload): Promise<void> {
  await authClient.post(requireAuthPath(registerPath, 'EXPO_PUBLIC_AUTH_REGISTER_PATH'), payload);
}

export function getAuthErrorMessage(error: unknown, action: 'sign in' | 'create your account'): string {
  if (error instanceof AuthIntegrationError) {
    return error.message;
  }

  if (isAxiosError(error)) {
    return error.response
      ? `We couldn't ${action}. Check your details and try again.`
      : 'Unable to reach the authentication service. Check your connection and try again.';
  }

  return `Something went wrong while trying to ${action}. Please try again.`;
}
