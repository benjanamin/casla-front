<template>
  <div class="products-table-container">
    <div class="table-scroll-wrapper">
      <table class="products-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Producto</th>
            <th>Stock</th>
            <th>Unidad</th>
            <th>Precio Venta</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" 
              :class="{ 'low-stock': product.stock < 10, 'disabled': !product.enabled }">
            <td>{{ product.barcode }}</td>
            <td>
              <div class="product-info">
                <strong>{{ product.name }}</strong>
                <small>{{ product.brand }}</small>
                <small v-if="product.description" class="description">{{ product.description }}</small>
              </div>
            </td>
            <td>
              <span class="stock-badge" :class="{ 'low': product.stock < 10 }">
                {{ product.stock }}
              </span>
            </td>
            <td>{{ formatUnit(product.unit) }}</td>
            <td>${{ formatCurrency(product.unitSellPrice) }}</td>
            <td>
              <div class="status-badges">
                <span v-if="product.enabled" class="status-badge enabled">Activo</span>
                <span v-else class="status-badge disabled">Inactivo</span>
                <span v-if="product.showInPOS" class="status-badge pos">POS</span>
                <span v-if="product.showInStore" class="status-badge store">Tienda</span>
              </div>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="$emit('edit', product)" class="btn-icon" title="Editar">
                  ✏️
                </button>
                <!-- <button @click="$emit('viewHistory', product)" class="btn-icon" title="Historial">
                  📊
                </button> -->
                <!-- <button @click="$emit('recordTransaction', product)" class="btn-icon" title="Transacción">
                  💰
                </button>
                <button @click="$emit('delete', product.id)" class="btn-icon delete" title="Eliminar">
                  🗑️
                </button> -->
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination Controls -->
    <div v-if="pagination" class="pagination-container">
      <div class="pagination-info">
        <span>
          Mostrando {{ ((pagination.page - 1) * pagination.pageSize) + 1 }} - 
          {{ Math.min(pagination.page * pagination.pageSize, pagination.totalCount) }} 
          de {{ pagination.totalCount }} productos
        </span>
      </div>
      <div class="pagination-controls">
        <button 
          @click="$emit('page-change', pagination.page - 1)"
          :disabled="!pagination.hasPreviousPage || loading"
          class="pagination-btn"
          title="Página anterior">
          ← Anterior
        </button>
        <div class="page-numbers">
          <span class="current-page">{{ pagination.page }} / {{ pagination.totalPages }}</span>
        </div>
        <button 
          @click="$emit('page-change', pagination.page + 1)"
          :disabled="!pagination.hasNextPage || loading"
          class="pagination-btn"
          title="Página siguiente">
          Siguiente →
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductsTable',
  props: {
    products: {
      type: Array,
      required: true,
      default: () => []
    },
    pagination: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['edit', 'viewHistory', 'recordTransaction', 'delete', 'page-change'],
  methods: {
    formatCurrency(amount) {
      if (amount === null || amount === undefined || isNaN(amount)) {
        return '0'
      }
      return Number(amount).toLocaleString('es-CL')
    },
    
    formatUnit(unit) {
      if (!unit) return 'Unidad'
      // Transform "unit" (case-insensitive) to "Unidad"
      if (unit.toLowerCase() === 'unit') {
        return 'Unidad'
      }
      // Return the unit as-is if it's already in Spanish or other value
      return unit
    }
  }
}
</script>

<style scoped>
.products-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-scroll-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
}

.products-table {
  width: 100%;
  min-width: 800px; /* Ensure table has minimum width for readability */
  border-collapse: collapse;
}

.products-table th {
  background-color: #f8f8f8;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #022e6b;
  border-bottom: 2px solid #e0e0e0;
}

.products-table td {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.products-table tr:hover {
  background-color: #f8f8f8;
}

.products-table tr.low-stock {
  background-color: #fff5f5;
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-info strong {
  color: #022e6b;
}

.product-info small {
  color: #666;
  font-size: 12px;
}

.product-info .description {
  margin-top: 4px;
  font-style: italic;
  color: #999;
}

.stock-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 12px;
  background-color: #e8f5e8;
  color: #2d5a2d;
}

.stock-badge.low {
  background-color: #ffe8e8;
  color: #d63031;
}

.margin-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 12px;
}

.margin-badge.high {
  background-color: #e8f5e8;
  color: #2d5a2d;
}

.margin-badge.medium {
  background-color: #fff3cd;
  color: #856404;
}

.status-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
}

.status-badge.enabled {
  background-color: #e8f5e8;
  color: #2d5a2d;
}

.status-badge.disabled {
  background-color: #ffe8e8;
  color: #d63031;
}

.status-badge.pos {
  background-color: #e3f2fd;
  color: #1565c0;
}

.status-badge.store {
  background-color: #fff3cd;
  color: #856404;
}

.products-table tr.disabled {
  opacity: 0.6;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  background-color: #f0f0f0;
  transform: scale(1.1);
}

.btn-icon.delete:hover {
  background-color: #ffe8e8;
  color: #d63031;
}

/* Responsive Design */
@media (max-width: 768px) {
  .products-table {
    font-size: 14px;
  }
  
  .products-table th,
  .products-table td {
    padding: 10px 8px;
    white-space: nowrap; /* Prevent text wrapping on mobile */
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
  
  /* Add scroll indicator for mobile */
  .table-scroll-wrapper::after {
    content: '← Desliza para ver más →';
    display: block;
    text-align: center;
    padding: 10px;
    background: linear-gradient(90deg, transparent, #f0f0f0, transparent);
    color: #666;
    font-size: 12px;
    font-style: italic;
  }
  
  /* Optimize column widths for mobile */
  .products-table th:nth-child(1), /* Código */
  .products-table td:nth-child(1) {
    min-width: 80px;
  }
  
  .products-table th:nth-child(2), /* Producto */
  .products-table td:nth-child(2) {
    min-width: 150px;
  }
  
  .products-table th:nth-child(3), /* Categoría */
  .products-table td:nth-child(3) {
    min-width: 100px;
  }
  
  .products-table th:nth-child(4), /* Proveedor */
  .products-table td:nth-child(4) {
    min-width: 120px;
  }
  
  .products-table th:nth-child(5), /* Stock */
  .products-table td:nth-child(5) {
    min-width: 60px;
  }
  
  .products-table th:nth-child(6), /* Precio Compra */
  .products-table td:nth-child(6) {
    min-width: 100px;
  }
  
  .products-table th:nth-child(7), /* Precio Venta */
  .products-table td:nth-child(7) {
    min-width: 100px;
  }
  
  .products-table th:nth-child(8), /* Margen */
  .products-table td:nth-child(8) {
    min-width: 80px;
  }
  
  .products-table th:nth-child(9), /* Acciones */
  .products-table td:nth-child(9) {
    min-width: 100px;
  }
}

/* Extra small devices */
@media (max-width: 480px) {
  .products-table {
    font-size: 12px;
  }
  
  .products-table th,
  .products-table td {
    padding: 8px 6px;
  }
  
  .table-scroll-wrapper::after {
    font-size: 11px;
    padding: 8px;
  }
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f8f8f8;
  border-top: 1px solid #e0e0e0;
  flex-wrap: wrap;
  gap: 15px;
}

.pagination-info {
  color: #666;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.pagination-btn {
  padding: 10px 20px;
  border: 2px solid #022e6b;
  background-color: white;
  color: #022e6b;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #022e6b;
  color: white;
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #ccc;
  color: #999;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 10px;
}

.current-page {
  padding: 8px 16px;
  background-color: #022e6b;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
}

@media (max-width: 768px) {
  .pagination-container {
    flex-direction: column;
    text-align: center;
  }
  
  .pagination-controls {
    width: 100%;
    justify-content: center;
  }
  
  .pagination-btn {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>
