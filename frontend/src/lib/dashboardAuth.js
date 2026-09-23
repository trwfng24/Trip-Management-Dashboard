export async function signOutAndRedirect({ auth, router }) {
  await auth.signOut()
  await router.replace({ name: 'login' })
}
