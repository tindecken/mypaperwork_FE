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
        component: () => import('src/components/Paperwork/PaperworkList.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/category-details/:id',
        component: () => import('src/components/Category/CategoryDetails.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/paperworks',
        component: () => import('src/components/Paperwork/PaperworkList.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/paperwork-details/:id',
        component: () => import('src/components/Paperwork/PaperworkDetails.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/paperwork-edit/:id',
        component: () => import('src/components/Paperwork/EditPaperwork.vue'),
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
    path: '/signup',
    component: () => import('components/Signup/Signup.vue'),
    meta: {
      requiresUnAuth: true,
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
    path: '/logout',
    component: () => import('src/components/Logout/Logout.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/forgot-password',
    component: () => import('src/components/ForgotPassword/ForgotPassword.vue'),
    meta: {
      requiresUnAuth: true,
    },
  },
  {
    path: '/reset-password',
    component: () => import('src/components/ResetPassword/ResetPassword.vue'),
    meta: {
      requiresUnAuth: true,
    },
  },
  {
    path: '/:catchAll(.*)*',
    redirect: '/login',
  },
];

export default routes;
