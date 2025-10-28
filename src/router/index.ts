import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from "../pages/LandingPage.vue";
import Login from '../pages/Login.vue'
import Signup from '../pages/Signup.vue'
import BaseTodo from '../pages/BaseTodo.vue'
import ErrorPage from '../pages/ErrorPage.vue'
import ServerError from '../pages/ServerError.vue'
import { supabase } from '../lib/supabaseClient'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  {
    path: '/dashboard',
    component: BaseTodo,
    meta: { requiresAuth: true },
  },
  // 👇 Catch-all route (404)
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: ErrorPage },
  { path: '/server-error', name: 'ServerError', component: ServerError },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✅ Route guard to protect authenticated routes
router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        return '/login'
      }
    } catch (error) {
      console.error("Supabase auth check failed:", error)
      // 👇 Redirect to 500 page if Supabase or network fails
      return '/server-error'
    }
  }
})

export default router
