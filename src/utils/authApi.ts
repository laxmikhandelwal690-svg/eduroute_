const isBrowser = typeof window !== 'undefined';

const resolveApiBaseUrl = () => {
  const envApiUrl = import.meta.env.VITE_API_URL?.trim();
  if (envApiUrl) {
    return envApiUrl.replace(/\/$/, '');
  }

  if (!isBrowser) {
    return 'http://localhost:5000/api';
  }

  const { hostname } = window.location;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  return isLocalhost ? 'http://localhost:5000/api' : '/api';
};

const API_BASE_URL = resolveApiBaseUrl();

type ApiResponse<T> = {
  success?: boolean;
  ok?: boolean;
  error?: string;
} & T;

const parseResponseData = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json() as Promise<ApiResponse<T>>;
  }

  const rawText = await response.text();
  return {
    success: response.ok,
    error: rawText || `Unexpected response (${response.status})`,
  } as ApiResponse<T>;
};

const apiRequest = async <T>(path: string, options: RequestInit): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error('Unable to connect to server. Please try again in a moment.');
  }

  const data = await parseResponseData<T>(response);
  const isSuccessful = response.ok && (data.success ?? data.ok ?? true);

  if (!isSuccessful) {
    throw new Error(data.error || 'Request failed');
  }

  return data as T;
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
