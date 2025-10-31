<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import logoUrl from '@/assets/logo.jpg'
import authService from '@/services/authService'

const router = useRouter()

// Authentication state
const isAuthenticated = ref(false)
const userInfo = ref(null)
const isLoading = ref(false)

// Function to check authentication status and get user info
const checkAuthStatus = async () => {
  try {
    isLoading.value = true
    
    if (authService.isAuthenticated()) {
      // Get user info to show in navbar
      const user = await authService.getCurrentUser()
      userInfo.value = user
      isAuthenticated.value = true
    } else {
      isAuthenticated.value = false
      userInfo.value = null
    }
  } catch (error) {
    console.error('Error checking auth status:', error)
    isAuthenticated.value = false
    userInfo.value = null
  } finally {
    isLoading.value = false
  }
}

// Logout function
const handleLogout = () => {
  authService.logout()
  isAuthenticated.value = false
  userInfo.value = null
  router.push('/login')
}

// Check authentication status when component mounts
onMounted(() => {
  checkAuthStatus()
})
</script>

<template>
    <nav class="navbar navbar-expand-lg primary-background py-2">
        <div class="container-fluid">
            <router-link class="navbar-brand d-flex align-items-center gap-2" to="/">
                <!-- <img :src="logoUrl" alt="Comercial Casla" class="brand-logo" /> -->
                <span class="brand-text text-white">
                    COMERCIAL <span class="secondary-color">CASLA</span>
                </span>
            </router-link>
            <button class="navbar-toggler" type="button" style="background-color: #ffffff;" data-bs-toggle="collapse"
                data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav mx-3">
                    <li class="nav-item">
                        <router-link class="nav-link transition duration-300" to="/">Home</router-link>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Productos
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" to="/productos?category=productos-metalicos"><b>Productos metálicos</b></router-link></li>
                            <li><router-link class="dropdown-item" to="/productos?category=abrasivos"><b>Abrasivos</b></router-link></li>
                            <li><router-link class="dropdown-item" to="/productos?category=fijaciones"><b>Fijaciones</b></router-link></li>
                            <li><router-link class="dropdown-item" to="/productos?category=elementos-de-proteccion-personal"><b>Elementos de protección personal</b></router-link></li>
                            <li><router-link class="dropdown-item" to="/productos?category=materiales-de-construccion"><b>Materiales de construcción</b></router-link></li>
                            <li><router-link class="dropdown-item" to="/productos?category=ferreteria"><b>Ferreteria</b></router-link></li>
                            <li><router-link class="dropdown-item" to="/productos"><b>Todos los productos</b></router-link></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown" v-show="isAuthenticated">
                        <a class="nav-link dropdown-toggle" href="#" id="inventoryDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Inventario
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="inventoryDropdown">
                            <li><router-link class="dropdown-item" to="/inventario"><b>Gestión de Inventario</b></router-link></li>
                            <li><router-link class="dropdown-item" to="/inventario/punto-de-venta"><b>Punto de Venta</b></router-link></li>
                        </ul>
                    </li>
                    <!-- <li class="nav-item">
                        <a class="nav-link transition duration-300" href="#">Nosotros</a>
                    </li> -->
                </ul>
                
                <!-- User section - moved to the right -->
                <div class="d-flex align-items-center gap-3 ms-auto">
                    <!-- Show user info when authenticated -->
                    <div v-if="isAuthenticated && userInfo" class="d-flex align-items-center gap-2 text-white">
                        <i class="bi bi-person-circle"></i>
                        <span class="small">{{ userInfo.username || userInfo.email }}</span>
                        <span class="badge bg-success small">{{ userInfo.role }}</span>
                    </div>
                    
                    <!-- Login button when not authenticated -->
                    <div v-if="isAuthenticated" class="d-flex gap-2">
                        <button @click="handleLogout" class="btn btn-outline-light btn-sm">
                            <i class="bi bi-box-arrow-right me-1"></i>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.brand-logo {
    height: 38px; /* adjust if your image feels too big/small */
    width: auto;
    border-radius: 4px;
    object-fit: cover;
}

.brand-text {
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: 0.5px;
}

.nav-link.show{
    color: #e6a71e;
}

.dropdown-menu {
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
}

.nav-link {
    font-size: 1.2rem;
    font-weight: 600;
    color: #ffffff;
    text-decoration: none;
    transition: color 0.3s ease;
}

li a:hover {
    color: #e6a71e;
}
</style>