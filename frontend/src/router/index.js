import { createRouter, createWebHistory } from 'vue-router'
import { watch } from 'vue'
import { auth } from '../lib/auth'
import { createAuthGuard, createSignedOutRedirect } from './authGuard'

export const authRoutes = [
  {
    path: '/trips/new', name: 'create-trip', component: () => import('@/views/workspace/CreateTripView.vue'), meta: { requiresAuth: true, title: 'Tạo chuyến đi' },
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/workspace/Workspace.vue'),
    meta: { requiresAuth: true, title: 'Workspace' },
  },
  {
    path: '/overview',
    name: 'overview',
    component: () => import('@/views/overview/Overview.vue'),
    meta: { requiresAuth: true, title: 'Overview' },
  },
  {
    path: '/opinions',
    name: 'opinions',
    component: () => import('@/views/opinions/Opinions.vue'),
    meta: { requiresAuth: true, title: 'Opinions' },
  },
  {
    path: '/plan',
    name: 'plan',
    component: () => import('@/views/plan/Plan.vue'),
    meta: { requiresAuth: true, title: 'Plan' },
  },
  {
    path: '/checklist',
    name: 'checklist',
    component: () => import('@/views/checkList/CheckList.vue'),
    meta: { requiresAuth: true, title: 'Checklist' },
  },
  {
    path: '/documents',
    name: 'documents',
    component: () => import('@/views/documents/Documents.vue'),
    meta: { requiresAuth: true, title: 'Documents' },
  },
  {
    path: '/expenses',
    name: 'expenses',
    component: () => import('@/views/expenses/Expense.vue'),
    meta: { requiresAuth: true, title: 'Expenses' },
  },
  {
    path: '/export',
    name: 'export',
    component: () => import('@/views/export/Export.vue'),
    meta: { requiresAuth: true, title: 'Export' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('@/views/error/ForbiddenView.vue'),
    meta: { public: true },
  },
  {
    path: '/error',
    name: 'error',
    component: () => import('@/views/error/ErrorView.vue'),
    meta: { public: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/error/NotFoundView.vue'),
    meta: { public: true },
  },
]

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
