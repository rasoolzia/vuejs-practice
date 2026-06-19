import { useAuthStore } from '@/auth/stores';
import type { LoginFormData, RegisterFormData } from '@/auth/types';

export function useAuthBridge() {
  const authStore = useAuthStore();
  const router = useRouter();

  return {
    isAuthInUse: computed(() => authStore.loading),
    username: computed(() => authStore.user?.username),

    async login(data: LoginFormData) {
      const res = await authStore.login(data);

      if (res.accessToken) {
        router.replace({ name: 'dashboard' });
      }

      return res;
    },

    async register(data: RegisterFormData) {
      const res = await authStore.register(data);

      if (res.accessToken) {
        router.replace({ name: 'dashboard' });
      }

      return res;
    },

    async logout() {
      await authStore.logout();
      router.replace({ name: 'signin' });
    },
  };
}
