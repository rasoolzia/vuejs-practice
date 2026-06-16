import { useAuthStore } from '@/auth/stores';
import type {
  LoginFormData,
  LoginResponse,
  RegisterFormData,
} from '@/auth/types';

export function useAuthBridge() {
  const authStore = useAuthStore();
  const router = useRouter();

  return {
    isAuthInUse: computed(() => authStore.loading),
    username: computed(() => authStore.user?.username),

    async login(data: LoginFormData) {
      const res: LoginResponse | string = await authStore.login(data);
      if (typeof res === 'string') return res;
      if (res?.accessToken) router.replace({ name: 'dashboard' });
      return res;
    },

    async register(data: RegisterFormData) {
      const res: LoginResponse | string = await authStore.register(data);
      if (typeof res === 'string') return res;
      if (res?.accessToken) router.replace({ name: 'dashboard' });
      return res;
    },

    async logout() {
      await authStore.logout();
      router.replace({ name: 'signin' });
    },
  };
}
