export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

export type PasswordResetPayload = {
  email: string;
};

type AuthPayload = LoginPayload | RegisterPayload | PasswordResetPayload;

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL;
const loginPath = process.env.EXPO_PUBLIC_AUTH_LOGIN_PATH;
const registerPath = process.env.EXPO_PUBLIC_AUTH_REGISTER_PATH;
const passwordResetPath = process.env.EXPO_PUBLIC_AUTH_PASSWORD_RESET_PATH;

export class AuthIntegrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthIntegrationError';
  }
}

class AuthRequestError extends Error {
  constructor() {
    super('The authentication service rejected the request.');
    this.name = 'AuthRequestError';
  }
}

class AuthNetworkError extends Error {
  constructor() {
    super('Unable to reach the authentication service.');
    this.name = 'AuthNetworkError';
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

  return `${apiBaseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

async function postJson(path: string, payload: AuthPayload): Promise<void> {
  let response: Response;

  try {
    response = await fetch(path, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new AuthNetworkError();
    }

    throw error;
  }

  if (!response.ok) {
    throw new AuthRequestError();
  }
}

export async function signIn(payload: LoginPayload): Promise<void> {
  await postJson(requireAuthPath(loginPath, 'EXPO_PUBLIC_AUTH_LOGIN_PATH'), payload);
}

export async function register(payload: RegisterPayload): Promise<void> {
  await postJson(requireAuthPath(registerPath, 'EXPO_PUBLIC_AUTH_REGISTER_PATH'), payload);
}

export async function requestPasswordReset(payload: PasswordResetPayload): Promise<void> {
  await postJson(
    requireAuthPath(passwordResetPath, 'EXPO_PUBLIC_AUTH_PASSWORD_RESET_PATH'),
    payload
  );
}

export function getAuthErrorMessage(
  error: unknown,
  action: 'sign in' | 'create your account' | 'send reset instructions'
): string {
  if (error instanceof AuthIntegrationError) {
    return error.message;
  }

  if (error instanceof AuthNetworkError) {
    return 'Unable to reach the authentication service. Check your connection and try again.';
  }

  if (error instanceof AuthRequestError) {
    return `We couldn't ${action}. Check your details and try again.`;
  }

  return `Something went wrong while trying to ${action}. Please try again.`;
}
