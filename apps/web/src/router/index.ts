import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomePage.vue'),
  },
  {
    path: '/activity/turkish-wheel',
    name: 'turkish-wheel',
    component: () => import('../activities/turkish-wheel/index.vue'),
  },
  {
    path: '/activity/ganesh-chaturthi',
    name: 'ganesh-chaturthi',
    component: () => import('../activities/ganesh-chaturthi/index.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
