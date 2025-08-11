<script setup>
import ProductCard from './ProductCard.vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const featuredProducts = ref([
    {
        id: 1,
        name: 'Producto 1',
        brand: 'Marca 1',
        price: 100,
    },
    {
        id: 2,
        name: 'Producto 2',
        brand: 'Marca 2',
        price: 200,
    },
    {
        id: 3,
        name: 'Producto 3',
        brand: 'Marca 3',
        price: 300,
    },
    {
        id: 4,
        name: 'Producto 4',
        brand: 'Marca 4',
        price: 400,
    },
    {
        id: 5,
        name: 'Producto 5',
        brand: 'Marca 5',
        price: 500,
    },
])

// Track screen size
const isMobile = ref(false)

// Check if screen is mobile size
const checkScreenSize = () => {
    isMobile.value = window.innerWidth < 768
}

// Computed property to chunk products based on screen size
const featuredProductChunks = computed(() => {
    const chunkSize = isMobile.value ? 1 : 4
    const chunks = []
    for (let i = 0; i < featuredProducts.value.length; i += chunkSize) {
        chunks.push(featuredProducts.value.slice(i, i + chunkSize))
    }
    return chunks
})

// Set up event listeners for responsive behavior
onMounted(() => {
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize)
})
</script>

<template>
    <div class="container-md justify-content-md-center">
        <div id="carouselExample" class="carousel slide">
            <div class="carousel-inner">
                <div 
                    v-for="(chunk, index) in featuredProductChunks" 
                    :key="index"
                    class="carousel-item"
                    :class="{ active: index === 0 }"
                >
                    <div class="cards-wrapper">
                        <ProductCard 
                            v-for="product in chunk" 
                            :key="product.id" 
                            :brand="product.brand" 
                            :name="product.name" 
                        />
                    </div>
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev" v-if="featuredProductChunks.length > 1">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next" v-if="featuredProductChunks.length > 1">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.cards-wrapper {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.card img {
    max-width: 100%;
    max-height: 100%;
}

.card {
    margin: 0 0.5em;
    box-shadow: 2px 6px 8px 0 rgba(22, 22, 26, 0.18);
    border: none;
    border-radius: 0;
}

.carousel-inner {
    padding: 1em;
}

.carousel-control-prev,
.carousel-control-next {
    background-color: #e1e1e1;
    width: 5vh;
    height: 5vh;
    border-radius: 50%;
    top: 50%;
    transform: translateY(-50%);
}

/* Mobile styles */
@media (max-width: 767px) {
    .cards-wrapper {
        justify-content: center;
        gap: 0.5rem;
    }
    
    .card {
        margin: 0;
        min-width: 280px; /* Ensure card has minimum width on mobile */
    }
    
    .carousel-inner {
        padding: 0.5em;
    }
}

@media (min-width: 768px) {
    .card img {
        height: 11em;
    }
    
    .cards-wrapper {
        gap: 1rem;
    }
}
</style>