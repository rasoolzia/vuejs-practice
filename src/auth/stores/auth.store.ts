import { authService } from '@/auth/services';
import type {
  LoginFormData,
  LoginResponse,
  RegisterFormData,
  User,
} from '@/auth/types';
import { cryptoSerializer } from '@/shared/libs';
import { defineStore } from 'pinia';

const storageSecretKey = import.meta.env.VITE_ENCRYPT_KEY;

export const useAuthStore = defineStore(
  'auth',
  () => {
    // State
    const user = ref<User | null>(null);
    const loading = ref(false);

    // Getters
    const isAuthenticated = computed(() => !!user.value);

    // Actions
    const login = async (
      credentials: LoginFormData,
    ): Promise<LoginResponse | string> => {
      loading.value = true;
      try {
        const data: LoginResponse = await authService.login(credentials);
        user.value = data.user;
        return data;
      } catch (error: unknown) {
        console.error('Login error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Login failed';
        return errorMessage;
      } finally {
        loading.value = false;
      }
    };

    const register = async (
      credentials: RegisterFormData,
    ): Promise<LoginResponse | string> => {
      loading.value = true;
      try {
        const data: LoginResponse = await authService.register(credentials);
        user.value = data.user;
        return data;
      } catch (error: unknown) {
        console.error('Registration error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Registration failed';
        return errorMessage;
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
        return userData;
      } catch (error: unknown) {
        console.error('Get current user error:', error);
        return undefined;
      }
    };

    const logout = async (): Promise<{ status: string; message: string }> => {
      loading.value = true;
      try {
        const response = await authService.logout();
        console.log('response :', response);
        user.value = null;
        return { status: 'true', message: 'you logged in successfully' };
      } finally {
        loading.value = false;
      }
    };

    return {
      // State
      user,
      loading,
      // Getters
      isAuthenticated,
      // Actions
      login,
      register,
      updateUser,
      getCurrentUser,
      logout,
    };
  },
  {
    persist: {
      serializer: cryptoSerializer(storageSecretKey),
      pick: ['user'],
    },
  },
);
