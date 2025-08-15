<template>
  <div class="sidebar">
    <!-- Search Section -->
    <div class="sidebar-section">
      <h5 class="sidebar-title">
        <i class="bi bi-search me-2"></i>Buscar
      </h5>
      <div class="search-container">
        <input 
          v-model="searchQuery" 
          type="text" 
          class="form-control search-input" 
          placeholder="Buscar productos..."
          @input="handleSearch"
        >
      </div>
    </div>

    <!-- Categories Section -->
    <div class="sidebar-section">
      <h5 class="sidebar-title">
        <i class="bi bi-tags me-2"></i>Categorías
      </h5>
      <div class="filter-list">
        <label 
          v-for="category in categories" 
          :key="category.id"
          class="filter-item"
        >
          <input 
            type="checkbox" 
            :value="category.id"
            v-model="selectedCategories"
            @change="handleCategoryChange"
            class="filter-checkbox"
          >
          <span class="filter-label">{{ category.name }}</span>
          <span class="filter-count">({{ category.count }})</span>
        </label>
      </div>
    </div>

    <!-- Price Range Section -->
    <div class="sidebar-section">
      <h5 class="sidebar-title">
        <i class="bi bi-currency-dollar me-2"></i>Rango de Precio
      </h5>
      <div class="price-range">
        <div class="price-inputs">
          <input 
            v-model.number="priceRange.min" 
            type="number" 
            class="form-control price-input" 
            placeholder="Min"
            @input="handlePriceChange"
          >
          <span class="price-separator">-</span>
          <input 
            v-model.number="priceRange.max" 
            type="number" 
            class="form-control price-input" 
            placeholder="Max"
            @input="handlePriceChange"
          >
        </div>
        <div class="price-slider">
          <input 
            type="range" 
            :min="priceSlider.min" 
            :max="priceSlider.max" 
            v-model="priceSlider.value"
            @input="handleSliderChange"
            class="range-slider"
          >
          <div class="price-labels">
            <span>${{ priceSlider.min }}</span>
            <span>${{ priceSlider.max }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Brands Section -->
    <div class="sidebar-section">
      <h5 class="sidebar-title">
        <i class="bi bi-award me-2"></i>Marcas
      </h5>
      <div class="filter-list">
        <label 
          v-for="brand in brands" 
          :key="brand.id"
          class="filter-item"
        >
          <input 
            type="checkbox" 
            :value="brand.id"
            v-model="selectedBrands"
            @change="handleBrandChange"
            class="filter-checkbox"
          >
          <span class="filter-label">{{ brand.name }}</span>
          <span class="filter-count">({{ brand.count }})</span>
        </label>
      </div>
    </div>

    <!-- Clear Filters Button -->
    <div class="sidebar-section">
      <button 
        @click="clearAllFilters" 
        class="btn btn-clear-filters w-100"
        :disabled="!hasActiveFilters"
      >
        <i class="bi bi-x-circle me-2"></i>Limpiar Filtros
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props for receiving data from parent
const props = defineProps({
  categories: {
    type: Array,
    default: () => [
      { id: 1, name: 'Fútbol', count: 25 },
      { id: 2, name: 'Básquet', count: 18 },
      { id: 3, name: 'Tenis', count: 12 },
      { id: 4, name: 'Running', count: 30 },
      { id: 5, name: 'Gimnasio', count: 15 }
    ]
  },
  brands: {
    type: Array,
    default: () => [
      { id: 1, name: 'Nike', count: 20 },
      { id: 2, name: 'Adidas', count: 18 },
      { id: 3, name: 'Puma', count: 12 },
      { id: 4, name: 'Under Armour', count: 8 },
      { id: 5, name: 'New Balance', count: 10 }
    ]
  }
})

// Emits for communicating with parent
const emit = defineEmits(['filter-change', 'search-change'])

// Reactive data
const searchQuery = ref('')
const selectedCategories = ref([])
const selectedBrands = ref([])
const priceRange = ref({ min: '', max: '' })
const priceSlider = ref({ min: 0, max: 10000, value: 10000 })

// Computed properties
const hasActiveFilters = computed(() => {
  return searchQuery.value || 
         selectedCategories.value.length > 0 || 
         selectedBrands.value.length > 0 || 
         priceRange.value.min || 
         priceRange.value.max
})

// Methods
const handleSearch = () => {
  emit('search-change', searchQuery.value)
}

const handleCategoryChange = () => {
  emit('filter-change', {
    categories: selectedCategories.value,
    brands: selectedBrands.value,
    priceRange: priceRange.value
  })
}

const handleBrandChange = () => {
  emit('filter-change', {
    categories: selectedCategories.value,
    brands: selectedBrands.value,
    priceRange: priceRange.value
  })
}

const handlePriceChange = () => {
  emit('filter-change', {
    categories: selectedCategories.value,
    brands: selectedBrands.value,
    priceRange: priceRange.value
  })
}

const handleSliderChange = () => {
  priceRange.value.max = priceSlider.value.value
  handlePriceChange()
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategories.value = []
  selectedBrands.value = []
  priceRange.value = { min: '', max: '' }
  priceSlider.value.value = priceSlider.value.max
  
  emit('search-change', '')
  emit('filter-change', {
    categories: [],
    brands: [],
    priceRange: { min: '', max: '' }
  })
}

// Watch for external category changes (from URL params)
watch(() => props.categories, (newCategories) => {
  // You can add logic here to sync with URL parameters
}, { deep: true })
</script>

<style scoped>
.sidebar {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 20px;
}

/* Mobile adjustments - remove sticky positioning and adjust styling */
@media (max-width: 991px) {
  .sidebar {
    position: static;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    background: transparent;
  }
  
  .sidebar-section {
    margin-bottom: 1.5rem;
  }
  
  .sidebar-title {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }
  
  .search-input {
    font-size: 1rem;
    padding: 0.875rem 1rem;
  }
  
  .filter-item {
    padding: 0.75rem 0;
  }
  
  .filter-label {
    font-size: 1rem;
  }
  
  .price-input {
    font-size: 1rem;
    padding: 0.75rem;
  }
  
  .btn-clear-filters {
    font-size: 1rem;
    padding: 1rem;
  }
}

.sidebar-section {
  margin-bottom: 2rem;
}

.sidebar-section:last-child {
  margin-bottom: 0;
}

.sidebar-title {
  color: #022e6b;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.search-container {
  position: relative;
}

.search-input {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #57c28b;
  box-shadow: 0 0 0 0.2rem rgba(87, 194, 139, 0.25);
}

.filter-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  padding-left: 0.5rem;
}

.filter-item:hover {
  background-color: #f8f9fa;
}

.filter-checkbox {
  margin-right: 0.75rem;
  width: 16px;
  height: 16px;
  accent-color: #57c28b;
}

.filter-label {
  flex: 1;
  font-size: 0.9rem;
  color: #495057;
}

.filter-count {
  color: #6c757d;
  font-size: 0.8rem;
}

.price-range {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-input {
  flex: 1;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  padding: 0.5rem;
  font-size: 0.9rem;
}

.price-input:focus {
  border-color: #57c28b;
  box-shadow: 0 0 0 0.2rem rgba(87, 194, 139, 0.25);
}

.price-separator {
  color: #6c757d;
  font-weight: 500;
}

.price-slider {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.range-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e9ecef;
  outline: none;
  -webkit-appearance: none;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #57c28b;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.range-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #57c28b;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.price-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #6c757d;
}

.btn-clear-filters {
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
  color: #6c757d;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-clear-filters:hover:not(:disabled) {
  background-color: #e9ecef;
  border-color: #dee2e6;
  color: #495057;
}

.btn-clear-filters:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .price-inputs {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .price-separator {
    display: none;
  }
}
</style>