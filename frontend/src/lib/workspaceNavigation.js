export const workspaceNavigationItems = [
  { label: 'Overview', routeName: 'overview', icon: 'mdi-view-dashboard-outline' },
  { label: 'Opinions', routeName: 'opinions', icon: 'mdi-message-text-outline', badge: '12' },
  { label: 'Plan', routeName: 'plan', icon: 'mdi-calendar-clock-outline' },
  { label: 'Checklist', routeName: 'checklist', icon: 'mdi-format-list-checks' },
  { label: 'Documents', routeName: 'documents', icon: 'mdi-folder-outline' },
  { label: 'Expenses', routeName: 'expenses', icon: 'mdi-wallet-outline' },
  { label: 'Export', routeName: 'export', icon: 'mdi-export-variant' },
]

export function createWorkspaceBreadcrumbItems(routeName) {
  const activeItem = workspaceNavigationItems.find((item) => item.routeName === routeName)

  if (!activeItem) return [{ label: 'Workspace' }]

  return [{ label: 'Workspace', to: { name: 'dashboard' } }, { label: activeItem.label }]
}
