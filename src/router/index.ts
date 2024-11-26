import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/viewuwes/index.vue'),
    },
    {
      path: '/layout',
      name: 'layout',
      component: () => import('@/viewuwes/layout.vue'),
    },
    {
      path: '/mapping',
      name: 'mapping',
      component: () => import('@/viewuwes/mapping.vue'),
    },
    {
      path: '/serial',
      name: 'serial',
      component: () => import('@/viewuwes/serial.vue'),
    },
    // {
    //   path: '/editor',
    //   name: 'editor',
    //   component: () => import('@/viewuwes/editor/index.vue'),
    //   children: [
    //     {
    //       path: '',
    //       name: 'editor-properties',
    //       component: () => import('@/viewuwes/editor/properties.vue'),
    //     },
    //     {
    //       path: 'layout',
    //       name: 'editor-layout',
    //       component: () => import('@/viewuwes/editor/layout.vue'),
    //     },
    //   ],
    // },
  ],
});

export default router;
