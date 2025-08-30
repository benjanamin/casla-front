<template>
  <div class="search-filters">
    <div class="search-box">
      <input 
        :value="searchQuery" 
        @input="$emit('update:searchQuery', $event.target.value)"
        @keyup="handleSearch"
        type="text" 
        placeholder="Buscar productos..."
        class="search-input"
      >
      <span class="search-icon">🔍</span>
    </div>
    
    <div class="filters">
             <select 
         :value="selectedCategory" 
         @change="handleCategoryFilter"
         class="filter-select"
       >
        <option value="">Todas las categorías</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
      
             <select 
         :value="selectedSupplier" 
         @change="handleSupplierFilter"
         class="filter-select"
       >
        <option value="">Todos los proveedores</option>
        <option v-for="supplier in suppliers" :key="supplier" :value="supplier">
          {{ supplier }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchFilters',
  props: {
    searchQuery: {
      type: String,
      default: ''
    },
    selectedCategory: {
      type: String,
      default: ''
    },
    selectedSupplier: {
      type: String,
      default: ''
    },
    categories: {
      type: Array,
      default: () => []
    },
    suppliers: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:searchQuery', 'update:selectedCategory', 'update:selectedSupplier', 'search', 'categoryFilter', 'supplierFilter'],
  methods: {
    handleSearch() {
      this.$emit('search')
    },
    
         handleCategoryFilter(event) {
       this.$emit('update:selectedCategory', event.target.value)
       this.$emit('categoryFilter')
     },
     
     handleSupplierFilter(event) {
       this.$emit('update:selectedSupplier', event.target.value)
       this.$emit('supplierFilter')
     }
  }
}
</script>

<style scoped>
.search-filters {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 12px 45px 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #022e6b;
}

.search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: #666;
}

.filters {
  display: flex;
  gap: 15px;
}

.filter-select {
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  min-width: 180px;
}

.filter-select:focus {
  outline: none;
  border-color: #022e6b;
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .filters {
    flex-direction: column;
  }
}
</style>
