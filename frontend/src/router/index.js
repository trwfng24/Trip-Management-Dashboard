import { createRouter, createWebHistory } from 'vue-router'
import { watch } from 'vue'
import { auth } from '../lib/auth'
import { createAuthGuard, createSignedOutRedirect } from './authGuard'
import { authRoutes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: authRoutes,
})

router.beforeEach(createAuthGuard(auth))

const redirectSignedOutUser = createSignedOutRedirect(auth, router)
watch(auth.user, () => {
  redirectSignedOutUser()
})

export default router
