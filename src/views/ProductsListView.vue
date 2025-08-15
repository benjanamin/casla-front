<script setup>
import ProductsListSideBar from '@/components/navbars/ProductsListSideBar.vue';
import ProductCard from '@/components/store/ProductCard.vue';
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { watch } from 'vue'

const route = useRoute();
const category = route.query.category;
watch(
  () => route.query.category,
  (newCategory, oldCategory) => {
    console.log(newCategory, oldCategory);
  }
)
// Mobile filter state
const showFilters = ref(false);

// Sample products data - in a real app, this would come from an API
const products = ref([
  { id: 1, brand: 'Nike', name: 'Air Max 270', category: 'Running', price: 12000, image: 'https://picsum.photos/300/200?random=1' },
  { id: 2, brand: 'Adidas', name: 'Ultraboost 22', category: 'Running', price: 15000, image: 'https://picsum.photos/300/200?random=2' },
  { id: 3, brand: 'Nike', name: 'Mercurial Vapor', category: 'Fútbol', price: 18000, image: 'https://picsum.photos/300/200?random=3' },
  { id: 4, brand: 'Puma', name: 'Future Z', category: 'Fútbol', price: 14000, image: 'https://picsum.photos/300/200?random=4' },
  { id: 5, brand: 'Under Armour', name: 'Curry 9', category: 'Básquet', price: 16000, image: 'https://picsum.photos/300/200?random=5' },
  { id: 6, brand: 'Nike', name: 'LeBron 19', category: 'Básquet', price: 20000, image: 'https://picsum.photos/300/200?random=6' },
  { id: 7, brand: 'Adidas', name: 'Barricade', category: 'Tenis', price: 13000, image: 'https://picsum.photos/300/200?random=7' },
  { id: 8, brand: 'New Balance', name: 'Fresh Foam', category: 'Running', price: 11000, image: 'https://picsum.photos/300/200?random=8' },
  { id: 9, brand: 'Nike', name: 'Metcon 7', category: 'Gimnasio', price: 17000, image: 'https://picsum.photos/300/200?random=9' },
  { id: 10, brand: 'Adidas', name: 'Powerlift 5', category: 'Gimnasio', price: 12000, image: 'https://picsum.photos/300/200?random=10' },
]);

// Filter state
const searchQuery = ref('');
const activeFilters = ref({
  categories: [],
  brands: [],
  priceRange: { min: '', max: '' }
});

// Sample categories and brands data
const categories = ref([
  { id: 1, name: 'Fútbol', count: 25 },
  { id: 2, name: 'Básquet', count: 18 },
  { id: 3, name: 'Tenis', count: 12 },
  { id: 4, name: 'Running', count: 30 },
  { id: 5, name: 'Gimnasio', count: 15 }
]);

const brands = ref([
  { id: 1, name: 'Nike', count: 20 },
  { id: 2, name: 'Adidas', count: 18 },
  { id: 3, name: 'Puma', count: 12 },
  { id: 4, name: 'Under Armour', count: 8 },
  { id: 5, name: 'New Balance', count: 10 }
]);

// Computed filtered products
const filteredProducts = computed(() => {
  let filtered = products.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }

  // Category filter
  if (activeFilters.value.categories.length > 0) {
    const categoryNames = activeFilters.value.categories.map(catId => {
      const category = categories.value.find(c => c.id === catId);
      return category ? category.name : '';
    });
    filtered = filtered.filter(product => categoryNames.includes(product.category));
  }

  // Brand filter
  if (activeFilters.value.brands.length > 0) {
    const brandNames = activeFilters.value.brands.map(brandId => {
      const brand = brands.value.find(b => b.id === brandId);
      return brand ? brand.name : '';
    });
    filtered = filtered.filter(product => brandNames.includes(product.brand));
  }

  // Price filter
  if (activeFilters.value.priceRange.min || activeFilters.value.priceRange.max) {
    filtered = filtered.filter(product => {
      const min = activeFilters.value.priceRange.min || 0;
      const max = activeFilters.value.priceRange.max || Infinity;
      return product.price >= min && product.price <= max;
    });
  }

  return filtered;
});

// Event handlers
const handleSearchChange = (query) => {
  searchQuery.value = query;
};

const handleFilterChange = (filters) => {
  activeFilters.value = filters;
};

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const closeFilters = () => {
  showFilters.value = false;
};

// Initialize category filter from URL if present
if (category) {
  const categoryObj = categories.value.find(c => c.name.toLowerCase() === category.toLowerCase());
  if (categoryObj) {
    activeFilters.value.categories = [categoryObj.id];
  }
}
</script>

<template>
  <div class="products-page">
    <!-- Mobile Filter Toggle Button -->
    <div class="mobile-filter-toggle d-lg-none">
      <button 
        @click="toggleFilters" 
        class="btn btn-outline-primary filter-toggle-btn"
      >
        <i class="bi bi-funnel me-2"></i>
        {{ showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros' }}
        <span class="filter-count" v-if="activeFilters.categories.length || activeFilters.brands.length || activeFilters.priceRange.min || activeFilters.priceRange.max">
          ({{ (activeFilters.categories.length + activeFilters.brands.length) + (activeFilters.priceRange.min || activeFilters.priceRange.max ? 1 : 0) }})
        </span>
      </button>
    </div>

    <!-- Mobile Filter Overlay -->
    <div 
      v-if="showFilters" 
      class="mobile-filter-overlay d-lg-none"
      @click="closeFilters"
    ></div>

    <!-- Mobile Filter Sidebar -->
    <div 
      v-if="showFilters" 
      class="mobile-filter-sidebar d-lg-none"
    >
      <div class="mobile-filter-header">
        <h5 class="mobile-filter-title">
          <i class="bi bi-funnel me-2"></i>Filtros
        </h5>
        <button 
          @click="closeFilters" 
          class="btn-close"
          aria-label="Cerrar filtros"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="mobile-filter-content">
        <ProductsListSideBar 
          :categories="categories"
          :brands="brands"
          @search-change="handleSearchChange"
          @filter-change="handleFilterChange"
        />
      </div>
    </div>

    <div class="container-fluid">
      <div class="row">
        <!-- Desktop Sidebar Column -->
        <div class="col-lg-3 col-md-4 d-none d-lg-block">
          <ProductsListSideBar 
            :categories="categories"
            :brands="brands"
            @search-change="handleSearchChange"
            @filter-change="handleFilterChange"
          />
        </div>
        
        <!-- Products Column -->
        <div class="col-lg-9 col-md-12">
          <div class="products-header">
            <h2 class="page-title">Productos</h2>
            <div class="results-info">
              <span class="results-count">{{ filteredProducts.length }} productos encontrados</span>
              <div class="sort-controls">
                <select class="form-select sort-select">
                  <option>Ordenar por</option>
                  <option>Precio: Menor a Mayor</option>
                  <option>Precio: Mayor a Menor</option>
                  <option>Nombre: A-Z</option>
                  <option>Nombre: Z-A</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <div class="products-grid" v-if="filteredProducts.length > 0">
            <div 
              v-for="product in filteredProducts" 
              :key="product.id"
              class="product-item"
            >
              <ProductCard 
                :brand="product.brand"
                :name="product.name"
              />
            </div>
          </div>

          <!-- No Results Message -->
          <div v-else class="no-results">
            <div class="no-results-content">
              <i class="bi bi-search no-results-icon"></i>
              <h3>No se encontraron productos</h3>
              <p>Intenta ajustar tus filtros o términos de búsqueda</p>
              <button 
                @click="() => { searchQuery = ''; activeFilters = { categories: [], brands: [], priceRange: { min: '', max: '' } } }"
                class="btn btn-primary"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-page {
  padding: 2rem 0;
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Mobile Filter Toggle */
.mobile-filter-toggle {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: white;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 1rem;
}

.filter-toggle-btn {
  width: 100%;
  border: 2px solid #57c28b;
  color: #57c28b;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.filter-toggle-btn:hover {
  background-color: #57c28b;
  color: white;
}

.filter-count {
  background-color: #57c28b;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-left: 0.5rem;
}

/* Mobile Filter Overlay */
.mobile-filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
  animation: fadeIn 0.3s ease;
}

/* Mobile Filter Sidebar */
.mobile-filter-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 85%;
  max-width: 350px;
  height: 100vh;
  background: white;
  z-index: 1060;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.mobile-filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 1;
}

.mobile-filter-title {
  margin: 0;
  color: #022e6b;
  font-size: 1.1rem;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background-color: #e9ecef;
  color: #495057;
}

.mobile-filter-content {
  padding: 1rem;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.page-title {
  color: #022e6b;
  font-weight: 700;
  margin-bottom: 1rem;
}

.products-header {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.results-count {
  color: #6c757d;
  font-size: 0.9rem;
}

.sort-select {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 0.5rem;
  font-size: 0.9rem;
  min-width: 200px;
}

.sort-select:focus {
  border-color: #57c28b;
  box-shadow: 0 0 0 0.2rem rgba(87, 194, 139, 0.25);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.product-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.no-results {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.no-results-content {
  text-align: center;
  padding: 2rem;
}

.no-results-icon {
  font-size: 4rem;
  color: #dee2e6;
  margin-bottom: 1rem;
}

.no-results h3 {
  color: #495057;
  margin-bottom: 0.5rem;
}

.no-results p {
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.btn-primary {
  background-color: #57c28b;
  border-color: #57c28b;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: #47b57d;
  border-color: #47b57d;
  transform: translateY(-1px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .products-page {
    padding: 0;
  }
  
  .products-header {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 0;
  }
  
  .results-info {
    flex-direction: column;
    align-items: stretch;
  }
  
  .sort-select {
    min-width: auto;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    padding: 0 1rem;
  }
  
  .product-item {
    border-radius: 8px;
  }
}

@media (max-width: 576px) {
  .products-grid {
    grid-template-columns: 1fr;
    padding: 0 0.5rem;
  }
  
  .mobile-filter-sidebar {
    width: 100%;
    max-width: none;
  }
}
</style>

