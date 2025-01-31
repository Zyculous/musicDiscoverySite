import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AccountView from '../views/AccountView.vue'
import AboutView from '../views/AboutView.vue'
import OrganizeView from '../views/OrganizeView.vue'
import DiscoverView from '../views/DiscoverView.vue'
import SignUpView from '../views/SignUp.vue'

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
      component: AboutView,
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
    },
    {
      path: '/organize',
      name: 'organize',
      component: OrganizeView,
    } /*
    {
      path: "/share",
      name: "share",
      component: () => import('../views/ShareView.vue'),
    },*/,
    {
      path: '/discover',
      name: 'discover',
      component: DiscoverView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView,
    },
  ],
})

export default router
