import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/index.vue'),
    },
    {
      path: '/layout',
      name: 'layout',
      component: () => import('@/views/layout.vue'),
    },
    {
      path: '/mapping',
      name: 'mapping',
      component: () => import('@/views/mapping.vue'),
    },
    {
      path: '/serial',
      name: 'serial',
      component: () => import('@/views/serial.vue'),
    },
    {
      path: '/editor',
      name: 'editor',
      component: () => import('@/views/editor.vue'),
    },
  ],
});

export default router;
