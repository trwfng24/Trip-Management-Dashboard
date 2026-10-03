import { createRouter, createWebHistory } from 'vue-router'
import { watch } from 'vue'
import { auth } from '../lib/auth'
import { createAuthGuard, createSignedOutRedirect } from './authGuard'

export const authRoutes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true, title: 'Không gian chung' },
  },
  {
    path: '/overview',
    name: 'overview',
    component: () => import('@/views/workspace/Workspace.vue'),
    meta: { requiresAuth: true, title: 'Tổng quan' },
  },
  {
    path: '/opinions',
    name: 'opinions',
    component: () => import('@/views/workspace/Workspace.vue'),
    meta: { requiresAuth: true, title: 'Ý kiến' },
  },
  {
    path: '/plan',
    name: 'plan',
    component: () => import('@/views/workspace/Workspace.vue'),
    meta: { requiresAuth: true, title: 'Kế hoạch' },
  },
  {
    path: '/checklist',
    name: 'checklist',
    component: () => import('@/views/workspace/Workspace.vue'),
    meta: { requiresAuth: true, title: 'Checklist' },
  },
  {
    path: '/documents',
    name: 'documents',
    component: () => import('@/views/workspace/Workspace.vue'),
    meta: { requiresAuth: true, title: 'Tài liệu' },
  },
  {
    path: '/expenses',
    name: 'expenses',
    component: () => import('@/views/workspace/Workspace.vue'),
    meta: { requiresAuth: true, title: 'Chi phí' },
  },
  {
    path: '/export',
    name: 'export',
    component: () => import('@/views/workspace/Workspace.vue'),
    meta: { requiresAuth: true, title: 'Xuất dữ liệu' },
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
