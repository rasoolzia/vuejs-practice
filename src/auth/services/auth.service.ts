import { authMappers } from '@/auth/mappers';
import { authRepository } from '@/auth/repositories';
import { authSchema } from '@/auth/schemas';
import type {
  LoginFormData,
  LoginResponse,
  RegisterFormData,
  User,
} from '@/auth/types';
import { StorageFactory } from '@/shared/libs';

const cookieStorage = StorageFactory.createStrategy('cookieStorage');
const storeAuthData = (result: LoginResponse): void => {
  if (result.accessToken) {
    cookieStorage.set('token', result.accessToken, { expires: 1 });
  }
  if (result.refreshToken) {
    cookieStorage.set('refreshToken', result.refreshToken, { expires: 7 });
  }
};

export const authService = {
  login: async (data: LoginFormData) => {
    const payload = authMappers.toLoginPayload(data);
    const response = await authRepository.login(payload);
    const result = authSchema.responseSchema.parse(response) as LoginResponse;
    storeAuthData(result);
    return result;
  },

  register: async (data: RegisterFormData) => {
    const payload = authMappers.toRegisterPayload(data);
    const response = await authRepository.register(payload);
    const result = authSchema.responseSchema.parse(response) as LoginResponse;
    return result;
  },

  getCurrentUser: async (): Promise<User> => {
    return await authRepository.getCurrentUser();
  },

  logout: async () => {
    return await authRepository.logout();
  },
};
