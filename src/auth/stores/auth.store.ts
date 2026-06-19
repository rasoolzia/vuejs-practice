import { authService, tokenService } from '@/auth/services';
import type {
  LoginFormData,
  LoginResponse,
  RegisterFormData,
  User,
} from '@/auth/types';
import { cryptoSerializer, StorageFactory } from '@/shared/libs';
import { defineStore } from 'pinia';
import { tokenNames } from '../constants';

const storageSecretKey = import.meta.env.VITE_ENCRYPT_KEY;

const cookieStorage = StorageFactory.createStrategy('cookieStorage');

export const useAuthStore = defineStore(
  'auth',
  () => {
    // State
    const user = ref<User | null>(null);
    const loading = ref(false);
    const isAuthenticated = ref(false);

    // Actions
    const login = async (
      credentials: LoginFormData,
    ): Promise<LoginResponse> => {
      loading.value = true;

      try {
        const data = await authService.login(credentials);
        setLoginData(data);
        return data;
      } finally {
        loading.value = false;
      }
    };

    const register = async (
      credentials: RegisterFormData,
    ): Promise<LoginResponse> => {
      loading.value = true;

      try {
        const data = await authService.register(credentials);
        setLoginData(data);
        return data;
      } finally {
        loading.value = false;
      }
    };

    const updateUser = (updatedUser: User): void => {
      user.value = updatedUser;
    };

    const getCurrentUser = async (): Promise<User | undefined> => {
      try {
        const userData = await authService.getCurrentUser();

        user.value = userData;
        isAuthenticated.value = true;

        return userData;
      } catch (error) {
        console.error(error);

        return undefined;
      }
    };

    const logout = async () => {
      loading.value = true;

      try {
        const response = await authService.logout(
          cookieStorage.get(tokenNames.refreshToken) || undefined,
        );
        clearAuth();
        return response;
      } finally {
        loading.value = false;
      }
    };

    const setLoginData = (data: LoginResponse): void => {
      user.value = data.user;
      isAuthenticated.value = true;

      tokenService.setTokens(data.accessToken, data.refreshToken);
    };

    const clearAuth = () => {
      tokenService.clearTokens();

      user.value = null;
      isAuthenticated.value = false;
    };

    const checkIsAuthenticated = () => {
      return tokenService.hasValidAccessToken();
    };

    const restoreAuth = (): void => {
      if (checkIsAuthenticated()) {
        isAuthenticated.value = true;
      } else {
        clearAuth();
      }
    };

    restoreAuth();
    return {
      // State
      user,
      loading,
      // Getters
      isAuthenticated,
      // Actions
      login,
      register,
      logout,
      getCurrentUser,
      updateUser,
      restoreAuth,
      clearAuth,
    };
  },
  {
    persist: {
      serializer: cryptoSerializer(storageSecretKey),
      pick: ['user'],
    },
  },
);
