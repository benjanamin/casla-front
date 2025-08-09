<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import NavBar from './components/NavBar.vue'
import './assets/css/base.css'
</script>

<template>
  <div id="app">
    <NavBar />
    <!-- <header>
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

      <div class="wrapper">
        <HelloWorld msg="You did it!" />

        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav>
      </div>
    </header> -->
    <main class="flex-grow-1">
      <div>
        <RouterView />
      </div>
    </main>
    <footer class="primary-background">
      <div class="container py-5">
        <div class="row">
          <div class="col-md-4">
            <h5 class="text-white">Comercial Casla</h5>
            <p class="text-white-50">Tu socio comercial de confianza</p>
          </div>
          <div class="col-md-4">
            <h6 class="text-white">Contacto</h6>
            <p class="text-white-50">Email: info@comercialcasla.com</p>
            <p class="text-white-50">Teléfono: +54 11 1234-5678</p>
          </div>
          <div class="col-md-4">
            <h6 class="text-white">Síguenos</h6>
            <p class="text-white-50">Facebook | Instagram | LinkedIn</p>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-12">
            <hr class="border-light">
            <p class="text-white-50 text-center mb-0">&copy; 2025 Comercial Casla. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.flex-grow-1 {
  flex: 1;
}
</style>
