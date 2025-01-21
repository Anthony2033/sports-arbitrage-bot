import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '../services/auth'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import EventDetailsView from '../views/EventDetailsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: LoginView
    },
    {
      path: '/dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/event/:id',
      component: EventDetailsView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth && !authService.isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})

export default router 