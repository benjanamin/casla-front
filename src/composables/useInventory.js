import { ref, computed } from 'vue'
import productService from '@/services/productService'

export function useInventory() {
  // Reactive state
  const products = ref([])
  const suppliers = ref([])
  const summary = ref({
    totalProducts: 0,
    totalValue: 0,
    lowStockCount: 0,
    categories: []
  })
  const loading = ref(false)
  const error = ref(null)

  // Computed properties
  const lowStockProducts = computed(() => 
    products.value.filter(product => product.stock < 10)
  )

  const highMarginProducts = computed(() => 
    products.value.filter(product => {
      if (product.buyPrice === 0) return false
      const margin = ((product.sellPrice - product.buyPrice) / product.buyPrice) * 100
      return margin >= 50
    })
  )

  const totalInventoryValue = computed(() => 
    products.value.reduce((sum, product) => sum + (product.buyPrice * product.stock), 0)
  )

  // Methods
  const loadData = async () => {
    loading.value = true
    error.value = null
    
    try {
      const [productsData, suppliersData, summaryData] = await Promise.all([
        productService.getAllProducts(),
        productService.getSuppliers(),
        productService.getInventorySummary()
      ])
      
      products.value = productsData
      suppliers.value = suppliersData
      summary.value = summaryData
    } catch (err) {
      error.value = err.message
      console.error('Error loading inventory data:', err)
    } finally {
      loading.value = false
    }
  }

  const addProduct = async (productData) => {
    try {
      const newProduct = await productService.addProduct(productData)
      products.value.push(newProduct)
      await updateSummary()
      return newProduct
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const updateProduct = async (productId, updates) => {
    try {
      const updatedProduct = await productService.updateProduct(productId, updates)
      const index = products.value.findIndex(p => p.id === productId)
      if (index !== -1) {
        products.value[index] = updatedProduct
      }
      await updateSummary()
      return updatedProduct
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const deleteProduct = async (productId) => {
    try {
      await productService.deleteProduct(productId)
      products.value = products.value.filter(p => p.id !== productId)
      await updateSummary()
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const recordPurchase = async (productId, quantity, buyPrice, supplier) => {
    try {
      const updatedProduct = await productService.recordPurchase(
        productId, 
        quantity, 
        buyPrice, 
        supplier
      )
      
      const index = products.value.findIndex(p => p.id === productId)
      if (index !== -1) {
        products.value[index] = updatedProduct
      }
      
      await updateSummary()
      return updatedProduct
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const recordSale = async (productId, quantity, sellPrice) => {
    try {
      const updatedProduct = await productService.recordSale(
        productId, 
        quantity, 
        sellPrice
      )
      
      const index = products.value.findIndex(p => p.id === productId)
      if (index !== -1) {
        products.value[index] = updatedProduct
      }
      
      await updateSummary()
      return updatedProduct
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const updateSummary = async () => {
    try {
      summary.value = await productService.getInventorySummary()
    } catch (err) {
      console.error('Error updating summary:', err)
    }
  }

  const searchProducts = async (query) => {
    if (!query || query.trim() === '') {
      return products.value
    }
    
    try {
      return await productService.searchProducts(query)
    } catch (err) {
      error.value = err.message
      return []
    }
  }

  const getProductsByCategory = async (category) => {
    try {
      return await productService.getProductsByCategory(category)
    } catch (err) {
      error.value = err.message
      return []
    }
  }

  const getPriceHistory = async (productId) => {
    try {
      return await productService.getPriceHistory(productId)
    } catch (err) {
      error.value = err.message
      return []
    }
  }

  // Utility functions
  const calculateMargin = (product) => {
    if (product.buyPrice === 0) return 0
    return Math.round(((product.sellPrice - product.buyPrice) / product.buyPrice) * 100)
  }

  const getMarginClass = (product) => {
    const margin = calculateMargin(product)
    if (margin >= 50) return 'high'
    if (margin >= 25) return 'medium'
    return 'low'
  }

  const formatCurrency = (amount) => {
    return amount.toLocaleString('es-CL')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CL')
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    products,
    suppliers,
    summary,
    loading,
    error,
    
    // Computed
    lowStockProducts,
    highMarginProducts,
    totalInventoryValue,
    
    // Methods
    loadData,
    addProduct,
    updateProduct,
    deleteProduct,
    recordPurchase,
    recordSale,
    updateSummary,
    searchProducts,
    getProductsByCategory,
    getPriceHistory,
    
    // Utilities
    calculateMargin,
    getMarginClass,
    formatCurrency,
    formatDate,
    clearError
  }
}
