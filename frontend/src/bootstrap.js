export async function bootstrap({
  App,
  auth,
  createApp,
  router,
  mountTarget = '#app',
}) {
  await auth.initialize()

  const app = createApp(App)
  app.use(router)
  app.onUnmount(() => auth.dispose())
  app.mount(mountTarget)

  return app
}
