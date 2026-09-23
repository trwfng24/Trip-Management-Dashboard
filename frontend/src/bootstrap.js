export async function bootstrap({
  App,
  auth,
  createApp,
  router,
  ui,
  mountTarget = '#app',
}) {
  await auth.initialize()

  const app = createApp(App)
  app.use(router)
  if (ui) app.use(ui)
  app.onUnmount(() => auth.dispose())
  app.mount(mountTarget)

  return app
}
