<template>
  <div class="inventory-container">
    <!-- Header Section -->
    <div class="inventory-header">
      <h1 class="primary-color">Gestión de Inventario</h1>
      <div class="header-actions">
        <button @click="showAddProductModal = true" class="btn btn-primary">
          <span class="icon">+</span> Agregar Producto
        </button>
        <button @click="showBulkAddModal = true" class="btn btn-secondary">
          <span class="icon">📦</span> Agregar Múltiples
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
      :show="showAddProductModal"
      :categories="summary.categories"
      :suppliers="suppliers"
      @close="showAddProductModal = false"
      @submit="addNewProduct"
    />

  </div>
</template>

<script>
import productService from '@/services/productService'
import {
  SummaryCards,
  SearchFilters,
  ProductsTable,
  BaseModal,
  AddProductModal,
} from '@/components/inventory'

export default {
  name: 'InventoryView',
  components: {
    SummaryCards,
    SearchFilters,
    ProductsTable,
    BaseModal,
    AddProductModal,
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
      showAddProductModal: false,
      showBulkAddModal: false,
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
      
      bulkProductsText: '',
      priceHistory: [],
      historyProduct: {}
    }
  },
  
  async mounted() {
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
          product.code.includes(query) ||
          product.supplier.toLowerCase().includes(query)
        )
      }
      
      if (this.selectedCategory) {
        filtered = filtered.filter(product => 
          product.category === this.selectedCategory
        )
      }
      
      if (this.selectedSupplier) {
        filtered = filtered.filter(product => 
          product.supplier === this.selectedSupplier
        )
      }
      
      this.filteredProducts = filtered
    },
    
    async addNewProduct(productData) {
      try {
        await productService.addProduct(productData)
        this.showAddProductModal = false
        await this.loadData()
        this.applyFilters()
      } catch (error) {
        console.error('Error adding product:', error)
      }
    },
    
    async addBulkProducts() {
      try {
        const lines = this.bulkProductsText.trim().split('\n')
        const products = []
        
        for (const line of lines) {
          if (line.trim()) {
            const [code, name, brand, category, buyPrice, sellPrice, supplier, stock, description] = line.split('|')
            if (code && name) {
              products.push({
                code: code.trim(),
                name: name.trim(),
                brand: brand?.trim() || '',
                category: category?.trim() || '',
                buyPrice: parseFloat(buyPrice) || 0,
                sellPrice: parseFloat(sellPrice) || 0,
                supplier: supplier?.trim() || '',
                stock: parseInt(stock) || 0,
                description: description?.trim() || ''
              })
            }
          }
        }
        
        for (const product of products) {
          await productService.addProduct(product)
        }
        
        this.showBulkAddModal = false
        this.bulkProductsText = ''
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
      this.transactionData.price = product.buyPrice
      this.transactionData.supplier = product.supplier
      this.showTransactionModal = true
    },
    
    async processTransaction() {
      try {
        if (this.transactionType === 'buy') {
          await productService.recordPurchase(
            this.transactionProduct.id,
            this.transactionData.quantity,
            this.transactionData.price,
            this.transactionData.supplier
          )
        } else {
          await productService.recordSale(
            this.transactionProduct.id,
            this.transactionData.quantity,
            this.transactionData.price
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
      try {
        this.historyProduct = product
        this.priceHistory = await productService.getPriceHistory(product.id)
        this.showHistoryModal = true
        
        this.$nextTick(() => {
          this.renderHistoryChart()
        })
      } catch (error) {
        console.error('Error loading price history:', error)
      }
    },
    
    renderHistoryChart() {
      const ctx = this.$refs.historyChart
      if (!ctx) return
      
      const buyPrices = this.priceHistory
        .filter(record => record.type === 'buy')
        .map(record => record.price)
      
      // Simple chart rendering - in a real app you'd use Chart.js or similar
      ctx.width = ctx.offsetWidth
      ctx.height = 200
      const context = ctx.getContext('2d')
      
      // Clear canvas
      context.clearRect(0, 0, ctx.width, ctx.height)
      
      // Draw chart (simplified)
      if (buyPrices.length > 0) {
        context.strokeStyle = '#022e6b'
        context.lineWidth = 2
        context.beginPath()
        buyPrices.forEach((price, index) => {
          const x = (index / (buyPrices.length - 1)) * ctx.width
          const y = ctx.height - (price / Math.max(...buyPrices)) * ctx.height
          if (index === 0) {
            context.moveTo(x, y)
          } else {
            context.lineTo(x, y)
          }
        })
        context.stroke()
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
      return amount.toLocaleString('es-CL')
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

.bulk-add-instructions {
  margin-bottom: 20px;
}

.bulk-textarea {
  width: 100%;
  font-family: monospace;
  font-size: 12px;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  resize: vertical;
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
