import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('components/Home/Home.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        redirect: '/home',
      },
      {
        path: '/home',
        component: () => import('src/components/Home/Home.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/settings',
        component: () => import('src/components/Settings/Settings.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/login',
    component: () => import('components/Login/Login.vue'),
    meta: {
      requiresUnAuth: true,
    },
  },
  {
    path: '/selectfile',
    component: () => import('src/components/SelectFile/SelectFile.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/test',
    component: () => import('src/components/Test/Test.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/:catchAll(.*)*',
    redirect: '/login',
  },
];

export default routes;
