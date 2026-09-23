export function createAuthGuard(auth) {
  return async (to) => {
    await auth.initialize()

    if (to.meta.requiresAuth && !auth.user.value) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (to.meta.guestOnly && auth.user.value) {
      return { name: 'dashboard' }
    }

    return true
  }
}

export function createSignedOutRedirect(auth, router) {
  return async () => {
    const currentRoute = router.currentRoute.value

    if (!auth.user.value && currentRoute.meta.requiresAuth) {
      await router.replace({
        name: 'login',
        query: { redirect: currentRoute.fullPath },
      })
    }
  }
}
