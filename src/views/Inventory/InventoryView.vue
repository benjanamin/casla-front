<template>
  <div class="inventory-container">
    <!-- Header Section -->
    <div class="inventory-header">
      <h1 class="primary-color">Gestión de Inventario</h1>
      <div class="header-actions">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addProductModal">
          Agregar Nuevo Producto
        </button>
        <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#bulkAddModal">
          <span class="icon">📦</span> Ingresar Productos
        </button>
      </div>
    </div>
    <!-- Summary Cards -->
    <SummaryCards :summary="summary" />

    <!-- Search and Filters -->
    <SearchFilters
      v-model:searchQuery="searchQuery"
      v-model:selectedCategory="selectedCategory"
      v-model:selectedSupplier="selectedSupplier"
      :categories="summary.categories"
      :suppliers="suppliers"
      @search="handleSearch"
      @categoryFilter="handleCategoryFilter"
      @supplierFilter="handleSupplierFilter"
    />

    <!-- Products Table -->
    <ProductsTable
      :products="filteredProducts"
      @edit="editProduct"
      @viewHistory="viewHistory"
      @recordTransaction="recordTransaction"
      @delete="deleteProduct"
    />
    
    <!-- Add Product Modal -->
    <AddProductModal
      @submit="addNewProduct"
    />

    <!-- Bulk Add Modal -->
    <BulkAddModal @submit="addBulkProducts" />

  </div>
</template>

<script>
import productService from '@/services/productService'
import authService from '@/services/authService'
import Swal from 'sweetalert2'
import {
  SummaryCards,
  SearchFilters,
  ProductsTable,
  AddProductModal,
  BulkAddModal,
} from '@/components/inventory'

export default {
  name: 'InventoryView',
  components: {
    SummaryCards,
    SearchFilters,
    ProductsTable,
    AddProductModal,
    BulkAddModal
  },
  data() {
    return {
      products: [],
      suppliers: [],
      summary: {
        totalProducts: 0,
        totalValue: 0,
        lowStockCount: 0,
        categories: []
      },
      searchQuery: '',
      selectedCategory: '',
      selectedSupplier: '',
      filteredProducts: [],
      
      // Modals
      showEditModal: false,
      showTransactionModal: false,
      showHistoryModal: false,
      
      // Forms
      editingProduct: {},
      transactionProduct: {},
      transactionType: 'buy',
      transactionData: {
        quantity: 1,
        price: 0,
        supplier: ''
      },
      
      priceHistory: [],
      historyProduct: {}
    }
  },
  
  async mounted() {
    // Check authentication and admin role before loading data
    const authResult = await authService.validateAuthAndRole()
    
    if (!authResult.isValid) {
      if (authResult.reason === 'no_token') {
        // No token found, redirect to login
        this.$router.push('/login')
        return
      } else if (authResult.reason === 'not_admin') {
        // User is not admin, redirect to home or show error
        alert('No tienes permisos para acceder a esta sección. Se requiere rol de Administrador.')
        this.$router.push('/')
        return
      } else {
        // Error occurred, redirect to login
        console.error('Authentication error:', authResult.reason)
        this.$router.push('/login')
        return
      }
    }
    
    // If authentication is valid, load the data
    await this.loadData()
  },
  
  methods: {
    async loadData() {
      try {
        const [products, suppliers, summary] = await Promise.all([
          productService.getAllProducts(),
          productService.getSuppliers(),
          productService.getInventorySummary()
        ])
        
        this.products = products
        this.suppliers = suppliers
        this.summary = summary
        this.filteredProducts = [...products]
      } catch (error) {
        console.error('Error loading data:', error)
      }
    },
    
    handleSearch() {
      this.applyFilters()
    },
    
    handleCategoryFilter() {
      this.applyFilters()
    },
    
    handleSupplierFilter() {
      this.applyFilters()
    },
    
    applyFilters() {
      let filtered = [...this.products]
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.barcode.includes(query) ||
          product.description.toLowerCase().includes(query)
        )
      }
      
      // Category and supplier filters removed as they're no longer in the DTO
      // Keeping the filter variables for backward compatibility but not using them
      
      this.filteredProducts = filtered
    },
    
    async addNewProduct(productData) {
      try {
        await productService.createProductAPI(productData)
        await this.loadData()
        this.applyFilters()
        
        // Show success message
        Swal.fire({
          title: '¡Éxito!',
          text: 'Producto añadido correctamente',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#022e6b'
        })
      } catch (error) {
        console.error('Error adding product:', error)
        
        // Show error message
        const errorMessage = error.response?.data?.message || error.message || 'Error al agregar el producto. Por favor, intenta nuevamente.'
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#d63031'
        })
      }
    },
    
    async addBulkProducts(products) {
      try {
        for (const product of products) {
          await productService.addProduct(product)
        }
        
        await this.loadData()
        this.applyFilters()
      } catch (error) {
        console.error('Error adding bulk products:', error)
      }
    },
    
    editProduct(product) {
      this.editingProduct = { ...product }
      this.showEditModal = true
    },
    
    async updateProductData() {
      try {
        await productService.updateProduct(this.editingProduct.id, this.editingProduct)
        this.showEditModal = false
        await this.loadData()
        this.applyFilters()
      } catch (error) {
        console.error('Error updating product:', error)
      }
    },
    
    recordTransaction(product) {
      this.transactionProduct = { ...product }
      // Buy price and supplier are no longer in the DTO
      this.transactionData.price = 0
      this.transactionData.supplier = ''
      this.showTransactionModal = true
    },
    
    async processTransaction() {
      try {
        if (this.transactionType === 'buy') {
          // recordPurchase now only takes productId and quantity
          await productService.recordPurchase(
            this.transactionProduct.id,
            this.transactionData.quantity
          )
        } else {
          // recordSale now only takes productId and quantity
          await productService.recordSale(
            this.transactionProduct.id,
            this.transactionData.quantity
          )
        }
        
        this.showTransactionModal = false
        await this.loadData()
        this.applyFilters()
      } catch (error) {
        console.error('Error processing transaction:', error)
      }
    },
    
    async viewHistory(product) {
      // Price history is no longer part of the DTO
      // This method is kept for backward compatibility but won't show history
      try {
        this.historyProduct = product
        this.priceHistory = [] // Price history no longer available
        this.showHistoryModal = true
        
        // Chart rendering removed as price history is no longer available
      } catch (error) {
        console.error('Error loading price history:', error)
      }
    },
    
    async deleteProduct(productId) {
      if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        try {
          await productService.deleteProduct(productId)
          await this.loadData()
          this.applyFilters()
        } catch (error) {
          console.error('Error deleting product:', error)
        }
      }
    },
    
    formatCurrency(amount) {
      if (amount === null || amount === undefined || isNaN(amount)) {
        return '0'
      }
      return Number(amount).toLocaleString('es-CL')
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('es-CL')
    }
  }
}
</script>

<style scoped>
.inventory-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.inventory-header h1 {
  font-size: 2.5rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 15px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #022e6b;
  color: white;
}

.btn-primary:hover {
  background-color: #1a4a8a;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: #e6a71e;
  color: white;
}

.btn-secondary:hover {
  background-color: #d19a1a;
  transform: translateY(-2px);
}

.icon {
  font-size: 18px;
}



.transaction-info {
  text-align: center;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
}

.transaction-info h3 {
  margin: 0 0 10px 0;
  color: #022e6b;
}

.transaction-type-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.type-btn {
  padding: 12px 24px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.type-btn.active {
  background-color: #022e6b;
  color: white;
  border-color: #022e6b;
}

.type-btn:hover:not(.active) {
  border-color: #022e6b;
  color: #022e6b;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.history-chart {
  margin-bottom: 30px;
  text-align: center;
}

.history-chart canvas {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f8f8f8;
}

.history-table table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th,
.history-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.history-table th {
  background-color: #f8f8f8;
  font-weight: 600;
  color: #022e6b;
}

.history-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 12px;
}

.history-badge.buy {
  background-color: #e8f5e8;
  color: #2d5a2d;
}

.history-badge.sell {
  background-color: #e3f2fd;
  color: #1565c0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .inventory-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
}
</style>
