import { computed, ref } from 'vue'

export function createAuthStore(client) {
  const session = ref(null)
  const user = computed(() => session.value?.user ?? null)
  const isLoading = ref(true)
  let initializePromise
  let subscription

  async function run(action) {
    const { data, error } = await action()
    if (error) throw error
    return data
  }

  async function initialize() {
    if (initializePromise) return initializePromise

    initializePromise = (async () => {
      try {
        const { data, error } = await client.auth.getSession()
        if (error) throw error

        session.value = data.session
        subscription = client.auth.onAuthStateChange((_event, nextSession) => {
          session.value = nextSession
        }).data.subscription
      } finally {
        isLoading.value = false
      }
    })()

    return initializePromise
  }

  return {
    session,
    user,
    isLoading,
    initialize,
    signIn: ({ email, password }) =>
      run(() => client.auth.signInWithPassword({ email, password })),
    signUp: ({ displayName, email, password }) =>
      run(() =>
        client.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName } },
        }),
      ),
    signInWithGoogle: () =>
      run(() =>
        client.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin },
        }),
      ),
    signOut: () => run(() => client.auth.signOut()),
    dispose() {
      subscription?.unsubscribe()
      subscription = undefined
    },
  }
}
