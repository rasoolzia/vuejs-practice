import { authClient } from '@/auth/client';
import type {
  LoginRequestPayload,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  registerRequestPayload,
  User,
} from '@/auth/types';

const authRepository = {
  login: async (payload: LoginRequestPayload): Promise<LoginResponse> => {
    const response = await authClient.post('/auth/signin', payload);
    return response.data;
  },

  register: async (payload: registerRequestPayload): Promise<LoginResponse> => {
    const response = await authClient.post('/auth/signup', payload);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await authClient.get('/auth/me');
    return response.data;
  },

  logout: async (refreshToken?: string): Promise<LogoutResponse> => {
    const response = await authClient.post('/auth/logout', { refreshToken });

    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await authClient.post('/auth/refresh', { refreshToken });

    return response.data;
  },
};

export { authRepository };
