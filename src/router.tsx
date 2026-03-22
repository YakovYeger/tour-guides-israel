import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { getAuthState } from '@/lib/supabase/client'
import type { RouterContext } from '@/routes/__root'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    context: {
      getAuth: getAuthState,
    } as RouterContext,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
