export type AuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
};

type ApiResponse<T> = T & { error?: string };

const request = async <T>(endpoint: string, payload: Record<string, unknown>): Promise<ApiResponse<T>> => {
  const response = await fetch(`/.netlify/functions/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};

export const signup = (name: string, email: string, password: string) =>
  request<{ user: AuthUser; message: string }>('auth-signup', { name, email, password });

export const verifyOtp = (email: string, otp: string) =>
  request<{ user: AuthUser; message: string; attemptsLeft?: number }>('auth-verify-otp', { email, otp });

export const resendOtp = (email: string) =>
  request<{ message: string; retryAfterSeconds?: number }>('auth-resend-otp', { email });

export const login = (email: string, password: string) =>
  request<{ user: AuthUser; message: string; requiresOtp?: boolean }>('auth-login', { email, password });
