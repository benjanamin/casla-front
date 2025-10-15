import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import authService from '@/services/authService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/productos',
      name: 'productos',
      component: () => import('../views/ProductsListView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/inventario/punto-de-venta',
      name: 'punto-de-venta',
      component: () => import('../views/Inventory/POSView.vue'),
      meta: { requiresAuth: true, requiresAdmin: false }
    },
    {
      path: '/inventario',
      name: 'inventario',
      component: () => import('../views/Inventory/InventoryView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
  ],
})

// Navigation guard to protect routes
router.beforeEach(async (to, from, next) => {
  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    try {
      // First check if user is authenticated
      if (!authService.isAuthenticated()) {
        next('/login')
        return
      }
      
      // If route requires admin role, check for admin
      if (to.meta.requiresAdmin) {
        const authResult = await authService.validateAuthAndRole()
        
        if (!authResult.isValid) {
          if (authResult.reason === 'not_admin') {
            // User is not admin, redirect to home
            alert('No tienes permisos para acceder a esta sección. Se requiere rol de Administrador.')
            next('/')
            return
          } else {
            // Error occurred, redirect to login
            console.error('Authentication error:', authResult.reason)
            next('/login')
            return
          }
        }
      }
      
      // If authentication is valid, continue to the route
      next()
    } catch (error) {
      console.error('Error in navigation guard:', error)
      next('/login')
    }
  } else {
    // Route doesn't require authentication, continue normally
    next()
  }
})

export default router
