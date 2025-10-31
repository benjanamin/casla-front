<script setup>
import ProductsListSideBar from '@/components/navbars/ProductsListSideBar.vue';
import ProductCard from '@/components/store/ProductCard.vue';
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { watch } from 'vue'

const route = useRoute();
const category = route.query.category;

// Mobile filter state
const showFilters = ref(false);

// Real products data matching your business categories
const products = ref([
  // Generated from public/products folder
  { id: 1, brand: 'Casla', name: 'Autoperforante hexagonal con golilla', category: 'productos-metalicos', price: 25000, image: '/products/autoperforante-hexagonal-con-golilla-300x200.png' },
  { id: 2, brand: 'Casla', name: 'Autoperforante hexagonal con golilla (alt)', category: 'productos-metalicos', price: 25000, image: '/products/autoperforante_hexagonal_con_golilla.-300x171.png' },
  { id: 3, brand: 'Casla', name: 'Barandas 1', category: 'productos-metalicos', price: 30000, image: '/products/barandas-1-225x300.jpg', largeImage: '/products/barandas-1-225x300.jpg'},
  { id: 4, brand: 'Casla', name: 'Barandas 2', category: 'productos-metalicos', price: 30000, image: '/products/barandas-2-168x300.jpg', largeImage: '/products/barandas-2-168x300.jpg' },
  { id: 5, brand: 'Casla', name: 'Barandas', category: 'productos-metalicos', price: 30000, image: '/products/barandas.jpg', largeImage: '/products/barandas.jpg' },
  { id: 6, brand: 'Casla', name: 'Brocas', category: 'abrasivos', price: 12000, image: '/products/brocas-300x185.png' },
  { id: 7, brand: 'Casla', name: 'Broca SDS Plus', category: 'abrasivos', price: 12000, image: '/products/Broca_sds_plus.jpg-2550×3300-150x150.png' },
  { id: 8, brand: 'Casla', name: 'Buzo Minero Poplin', category: 'elementos-de-proteccion-personal', price: 18000, image: '/products/buzo-minero-poplin-300x300.jpg' },
  { id: 9, brand: 'Casla', name: 'Cabeza Lenteja Broca', category: 'fijaciones', price: 8000, image: '/products/cabeza_lenteja_broca-150x150.png' },
  { id: 10, brand: 'Casla', name: 'Cadenas Inox', category: 'productos-metalicos', price: 20000, image: '/products/cadenas_inox.jpg-2950×3545-150x150.png' },
  { id: 11, brand: 'Casla', name: 'Caja Mascarilla', category: 'elementos-de-proteccion-personal', price: 9000, image: '/products/caja-mascarilla-300x225.jpg' },
  { id: 12, brand: 'Casla', name: 'Choca Carros', category: 'productos-metalicos', price: 15000, image: '/products/choca-carros-225x300.jpg' },
  { id: 13, brand: 'Casla', name: 'Clavo Techo Paragua', category: 'fijaciones', price: 5000, image: '/products/clavo-techo-paragua-300x217.png' },
  { id: 14, brand: 'Casla', name: 'Corral Carros', category: 'productos-metalicos', price: 15000, image: '/products/corral-carros-225x300.jpg' },
  { id: 15, brand: 'Casla', name: 'Dado Magnético', category: 'ferreteria', price: 4000, image: '/products/dado-magnetico-300x142.png' },
  { id: 16, brand: 'Casla', name: 'Disco de Corte A330', category: 'abrasivos', price: 3500, image: '/products/Disco-de-corte-A330-300x219.jpg', largeImage: '/products/Disco-de-corte-A330-min-300x283.jpg' },
  { id: 17, brand: 'Casla', name: 'Disco de Corte A330 (alt)', category: 'abrasivos', price: 3500, image: '/products/Disco-de-corte-A330-min-300x283.jpg', largeImage: '/products/Disco-de-corte-A330-min-300x283.jpg' },
  { id: 18, brand: 'Casla', name: 'Disco de Corte Finos A960', category: 'abrasivos', price: 3500, image: '/products/disco-de-corte-finos-a960-min-300x219.jpg' },
  { id: 19, brand: 'Casla', name: 'Discos Flap SMT324 Extra', category: 'abrasivos', price: 4200, image: '/products/Discos-flap-smt324-extra-min-1-300x219.jpg', largeImage: '/products/Discos-flap-smt324-extra-min-300x283.jpg' },
  { id: 20, brand: 'Casla', name: 'Discos Flap SMT324 Extra (alt)', category: 'abrasivos', price: 4200, image: '/products/Discos-flap-smt324-extra-min-300x283.jpg', largeImage: '/products/Discos-flap-smt324-extra-min-300x283.jpg' },
  { id: 21, brand: 'Casla', name: 'Disp Saly', category: 'ferreteria', price: 10000, image: '/products/disp salyy.JPG' },
  { id: 22, brand: 'Casla', name: 'Dispensador 1lt Pintura', category: 'ferreteria', price: 10000, image: '/products/dispensador 1 lt pintura electroestatica.png' },
  { id: 23, brand: 'Casla', name: 'Dispensador Toma Temp y Alcohol', category: 'ferreteria', price: 10000, image: '/products/dispensador toma temperatura y alcohol gel.JPG', largeImage: '/products/dispensador toma temperatura y alcohol gel.JPG 02.JPG' },
  { id: 24, brand: 'Casla', name: 'Dispensador Toma Temp y Alcohol (alt)', category: 'ferreteria', price: 10000, image: '/products/dispensador toma temperatura y alcohol gel.JPG 02.JPG', largeImage: '/products/dispensador toma temperatura y alcohol gel.JPG 02.JPG' },
  { id: 25, brand: 'Casla', name: 'Dispensador Alcohol Gel 10', category: 'ferreteria', price: 10000, image: '/products/dispensador-alcohol-gel-10.png-125x300.jpg' },
  { id: 26, brand: 'Casla', name: 'Dispensador Alcohol Gel 11', category: 'ferreteria', price: 10000, image: '/products/dispensador-alcohol-gel-11.png-101x300.jpg' },
  { id: 27, brand: 'Casla', name: 'Fijaciones Cubierta', category: 'fijaciones', price: 8000, image: '/products/Fijaciones-cubierta-300x244.png' },
  { id: 28, brand: 'Casla', name: 'Gateras 1', category: 'ferreteria', price: 12000, image: '/products/gateras-1-225x300.jpg' },
  { id: 29, brand: 'Casla', name: 'Gateras', category: 'ferreteria', price: 12000, image: '/products/gateras-225x300.jpg' },
  { id: 30, brand: 'Casla', name: 'Guante Soldador Rojo', category: 'elementos-de-proteccion-personal', price: 3500, image: '/products/guante-soldador-rojo-150x150.jpg' },
  { id: 31, brand: 'Casla', name: 'Guantes Cabritilla Blanco 2', category: 'elementos-de-proteccion-personal', price: 3500, image: '/products/guantes-cabritilla-blanco-con-y-sin-forro-2-300x300.jpg', largeImage: '/products/guantes-cabritilla-blanco-con-y-sin-forro-300x300.jpg' },
  { id: 32, brand: 'Casla', name: 'Guantes Cabritilla Blanco', category: 'elementos-de-proteccion-personal', price: 3500, image: '/products/guantes-cabritilla-blanco-con-y-sin-forro-300x300.jpg', largeImage: '/products/guantes-cabritilla-blanco-con-y-sin-forro-300x300.jpg' },
  { id: 33, brand: 'Casla', name: 'Guantes Kron CN Lona Palma Verde', category: 'elementos-de-proteccion-personal', price: 3500, image: '/products/guantes-kron-cn-lona-palma-verde-descarne-150x150.jpg' },
  { id: 34, brand: 'Casla', name: 'Guantes Soldador Azul Kevlar', category: 'elementos-de-proteccion-personal', price: 3500, image: '/products/guantes-soldador-azul-kevlar-refuerzo-pistola-150x150.jpg' },
  { id: 35, brand: 'Casla', name: 'IMG 0080', category: 'ferreteria', price: 10000, image: '/products/IMG_0080-300x168.jpg' },
  { id: 36, brand: 'Casla', name: 'IMG 0081', category: 'ferreteria', price: 10000, image: '/products/IMG_0081-233x300.jpg' },
  { id: 37, brand: 'Casla', name: 'Mascara Soldar 1', category: 'elementos-de-proteccion-personal', price: 12000, image: '/products/mascara-soldar-1-300x268.jpg', largeImage: '/products/mascara-soldar-300x268.jpg' },
  { id: 38, brand: 'Casla', name: 'Mascara Soldar', category: 'elementos-de-proteccion-personal', price: 12000, image: '/products/mascara-soldar-300x268.jpg', largeImage: '/products/mascara-soldar-300x268.jpg' },
  { id: 39, brand: 'Casla', name: 'Mascarillas', category: 'elementos-de-proteccion-personal', price: 12000, image: '/products/mascarillas-300x130.png' },
  { id: 40, brand: 'Casla', name: 'Pasarelas 1', category: 'productos-metalicos', price: 20000, image: '/products/pasarelas-1-169x300.jpg' },
  { id: 41, brand: 'Casla', name: 'Pasarelas 2', category: 'productos-metalicos', price: 20000, image: '/products/pasarelas-2-169x300.jpg' },
  { id: 42, brand: 'Casla', name: 'Perno Anclaje 2', category: 'fijaciones', price: 8000, image: '/products/perno-anclaje-2-150x150.png', largeImage: '/products/perno-anclaje-300x215.png' },
  { id: 43, brand: 'Casla', name: 'Perno Anclaje', category: 'fijaciones', price: 8000, image: '/products/perno-anclaje-300x215.png', largeImage: '/products/perno-anclaje-300x215.png' },
  { id: 44, brand: 'Casla', name: 'Pintura Esmalte al Agua', category: 'ferreteria', price: 18000, image: '/products/Pintura-Esmalte-al-agua-con-nanoparticulas-de-cobre-min-2-300x219.jpg' },
  { id: 45, brand: 'Casla', name: 'Protección Tras Tienda 1', category: 'productos-metalicos', price: 9000, image: '/products/proteccion-tras-tienda-1-300x225.jpg' },
  { id: 46, brand: 'Casla', name: 'Protección Tras Tienda 2', category: 'productos-metalicos', price: 9000, image: '/products/proteccion-tras-tienda-2-225x300.jpg' },
  { id: 47, brand: 'Casla', name: 'Punta Phillip', category: 'ferreteria', price: 2000, image: '/products/Punta-Phillip-300x56.png' },
  { id: 48, brand: 'Casla', name: 'Punta Phillips Larga', category: 'ferreteria', price: 2000, image: '/products/punta-phillips-larga--300x91.png' },
]);

// Filter state
const searchQuery = ref('');
const activeFilters = ref({
  categories: [],
  brands: [],
  priceRange: { min: '', max: '' }
});

// Real categories matching your navbar
const categories = ref([
  { id: 'productos-metalicos', name: 'Productos metálicos', count: 4 },
  { id: 'abrasivos', name: 'Abrasivos', count: 4 },
  { id: 'fijaciones', name: 'Fijaciones', count: 4 },
  { id: 'elementos-de-proteccion-personal', name: 'Elementos de protección personal', count: 4 },
  { id: 'materiales-de-construccion', name: 'Materiales de construcción', count: 4 },
  { id: 'ferreteria', name: 'Ferreteria', count: 4 }
]);

const brands = ref([
  { id: 1, name: 'Casla', count: 24 },
  { id: 2, name: 'Stanley', count: 8 },
  { id: 3, name: 'DeWalt', count: 6 },
  { id: 4, name: 'Bosch', count: 4 },
  { id: 5, name: 'Makita', count: 3 }
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
    filtered = filtered.filter(product => activeFilters.value.categories.includes(product.category));
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

const getPageTitle = () => {
  if (activeFilters.value.categories.length > 0) {
    const category = categories.value.find(c => c.id === activeFilters.value.categories[0]);
    return category ? category.name : 'Productos';
  }
  return 'Todos los productos';
};

// Watch for URL category changes and update filters accordingly
watch(
  () => route.query.category,
  (newCategory) => {
    if (newCategory) {
      // Set the category filter based on URL
      activeFilters.value.categories = [newCategory];
    } else {
      // Clear category filter if no category in URL
      activeFilters.value.categories = [];
    }
  },
  { immediate: true }
);

// Initialize category filter from URL if present
if (category) {
  activeFilters.value.categories = [category];
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
          :current-filters="activeFilters"
          :current-search-query="searchQuery"
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
            :current-filters="activeFilters"
            :current-search-query="searchQuery"
            @search-change="handleSearchChange"
            @filter-change="handleFilterChange"
          />
        </div>
        
        <!-- Products Column -->
        <div class="col-lg-9 col-md-12">
          <div class="products-header">
            <h2 class="page-title">
              {{ getPageTitle() }}
            </h2>
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
                :image="product.image"
                :large-image="product.largeImage"
                :category="product.category"
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
 
.product-item {
  display: flex;
  flex-direction: column;
}

.product-item .card {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
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
    margin-bottom: 2rem;
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
  .products-page {
    margin-bottom: 2rem;
  }

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

