import { authMappers } from '@/auth/mappers';
import { authRepository } from '@/auth/repositories';
import { authSchema } from '@/auth/schemas';
import type {
  LoginFormData,
  LoginResponse,
  RegisterFormData,
  User,
} from '@/auth/types';

export const authService = {
  login: async (data: LoginFormData) => {
    const payload = authMappers.toLoginPayload(data);
    const response = await authRepository.login(payload);
    return authSchema.responseSchema.parse(response) as LoginResponse;
  },

  register: async (data: RegisterFormData) => {
    const payload = authMappers.toRegisterPayload(data);
    const response = await authRepository.register(payload);
    return authSchema.responseSchema.parse(response) as LoginResponse;
  },

  getCurrentUser: async (): Promise<User> => {
    return await authRepository.getCurrentUser();
  },

  logout: async (refreshToken?: string) => {
    try {
      if (refreshToken) {
        return await authRepository.logout(refreshToken);
      }

      return {
        message: 'Logged out successfully',
      };
    } catch (error) {
      return {
        message: error instanceof Error ? error.message : 'Logout failed',
      };
    }
  },

  refreshToken: async (refreshToken: string) => {
    return authRepository.refreshToken(refreshToken);
  },
};
