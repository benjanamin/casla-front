<script setup>
</script>

<template>
    <nav class="navbar navbar-expand-lg primary-background">
        <div class="container-fluid">
            <a class="navbar-brand bebas-neue-regular" href="#">
                <h1 class="text-3xl font-bold text-white">
                    COMERCIAL <span class="secondary-color">CASLA</span>
                </h1>
            </a>
            <button class="navbar-toggler" type="button" style="background-color: #ffffff;" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav mx-3">
                    <li class="nav-item">
                        <a class="nav-link text-white hover:text-gray-300 transition duration-300" href="#">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-white hover:text-gray-300 transition duration-300" href="#">Productos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-white hover:text-gray-300 transition duration-300" href="#">Nosotros</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<style scoped>
li a {
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