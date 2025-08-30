<template>
  <div class="products-table-container">
    <div class="table-scroll-wrapper">
      <table class="products-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Proveedor</th>
            <th>Stock</th>
            <th>Precio Compra</th>
            <th>Precio Venta</th>
            <th>Margen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" 
              :class="{ 'low-stock': product.stock < 10 }">
            <td>{{ product.code }}</td>
            <td>
              <div class="product-info">
                <strong>{{ product.name }}</strong>
                <small>{{ product.brand }}</small>
              </div>
            </td>
            <td>{{ product.category }}</td>
            <td>{{ product.supplier }}</td>
            <td>
              <span class="stock-badge" :class="{ 'low': product.stock < 10 }">
                {{ product.stock }}
              </span>
            </td>
            <td>${{ formatCurrency(product.buyPrice) }}</td>
            <td>${{ formatCurrency(product.sellPrice) }}</td>
            <td>
              <span class="margin-badge" :class="getMarginClass(product)">
                {{ calculateMargin(product) }}%
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="$emit('edit', product)" class="btn-icon" title="Editar">
                  ✏️
                </button>
                <button @click="$emit('viewHistory', product)" class="btn-icon" title="Historial">
                  📊
                </button>
                <button @click="$emit('recordTransaction', product)" class="btn-icon" title="Transacción">
                  💰
                </button>
                <button @click="$emit('delete', product.id)" class="btn-icon delete" title="Eliminar">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
    }
  },
  emits: ['edit', 'viewHistory', 'recordTransaction', 'delete'],
  methods: {
    calculateMargin(product) {
      if (product.buyPrice === 0) return 0
      return Math.round(((product.sellPrice - product.buyPrice) / product.buyPrice) * 100)
    },
    
    getMarginClass(product) {
      const margin = this.calculateMargin(product)
      if (margin >= 50) return 'high'
      if (margin >= 25) return 'medium'
      return 'low'
    },
    
    formatCurrency(amount) {
      return amount.toLocaleString('es-CL')
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

.margin-badge.low {
  background-color: #ffe8e8;
  color: #d63031;
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
</style>
