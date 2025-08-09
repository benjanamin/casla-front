<script setup>
import logoUrl from '@/assets/logo.jpg'
</script>

<template>
    <nav class="navbar navbar-expand-lg primary-background py-2">
        <div class="container-fluid">
            <a class="navbar-brand d-flex align-items-center gap-2" href="#">
                <!-- <img :src="logoUrl" alt="Comercial Casla" class="brand-logo" /> -->
                <span class="brand-text text-white">
                    COMERCIAL <span class="secondary-color">CASLA</span>
                </span>
            </a>
            <button class="navbar-toggler" type="button" style="background-color: #ffffff;" data-bs-toggle="collapse"
                data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav mx-3">
                    <li class="nav-item">
                        <a class="nav-link transition duration-300" href="#">Home</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Productos
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" href="#"><b>Categoria 1</b></a></li>
                            <li><a class="dropdown-item" href="#"><b>Categoria 2</b></a></li>
                            <li><a class="dropdown-item" href="#"><b>Categoria 3</b></a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link transition duration-300" href="#">Nosotros</a>
                    </li>
                </ul>
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