import { routes as authRoutes } from '@/auth/routes';
import { useAuthStore } from '@/auth/stores';
import { routes as componentsRoutes } from '@/components/routes';
import { routes as dashboardRoutes } from '@/dashboard/routes';
import { createRouter, createWebHistory } from 'vue-router';
import { routes as playgroundRoute } from './playground';

const router = createRouter({
  routes: [
    {
      path: '/',
      redirect: { name: 'dashboard' },
    },
    ...authRoutes,
    ...componentsRoutes,
    ...dashboardRoutes,
    ...playgroundRoute,
  ],
  history: createWebHistory('/vuejs-practice'),
});

router.beforeEach((to, _from, next) => {
  const { isAuthenticated } = useAuthStore();
  if (!to.meta.isGuest && !isAuthenticated) {
    return next({ name: 'signin' });
  }

  if (to.meta.isGuest && isAuthenticated) {
    return next({ name: 'dashboard' });
  }

  //TODO add acl

  //TODO add title and description change

  next();
});

export default router;
