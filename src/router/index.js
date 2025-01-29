import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AccountView from '../views/AccountView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView
    },
    {
      path: "/organize",
      name: "organize",
      component: () => import('../views/OrganizeView.vue'),
    },/*
    {
      path: "/share",
      name: "share",
      component: () => import('../views/ShareView.vue'),
    },*/
    {
      path: "/discover",
      name: "discover",
      component: () => import('../views/DiscoverView.vue'),
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import('../views/SignUp.vue'),
    }
  ],
})

export default router
