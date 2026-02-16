const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000/api';

type ApiResponse<T> = {
  success: boolean;
  error?: string;
} & T;

const apiRequest = async <T>(path: string, options: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json() as ApiResponse<T>;

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
};

export const apiRegisterUser = async (payload: { name: string; email: string; password: string }) => apiRequest<{ token: string }>('/auth/register', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const apiSendOtp = async (email: string) => apiRequest<{ cooldownSeconds: number }>('/auth/otp/send', {
  method: 'POST',
  body: JSON.stringify({ email }),
});

export const apiVerifyOtp = async (payload: { email: string; otp: string }) => apiRequest<{ message: string }>('/auth/otp/verify', {
  method: 'POST',
  body: JSON.stringify(payload),
});
