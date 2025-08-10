<script setup>
import ProductCard from './ProductCard.vue'
import { ref } from 'vue'

const products = ref([
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
    
    
])
</script>

<template>
    <div class="container-md justify-content-md-center">
        <div class="row">
            <div v-for="product in products" :key="product.id" class="col">
                <ProductCard :brand="product.brand" :name="product.name" />
            </div>
        </div>
    </div>
</template>