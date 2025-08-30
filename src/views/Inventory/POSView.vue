<template>
    <div class="container-fluid">
        <div class="row mt-5 mb-5">
            <!-- Left Side - Product Scanning and Cart -->
            <div class="col-md-8 d-flex">
                <div class="card flex-fill">
                    <div class="card-header text-white" style="background-color: #022e6b;">
                        <div class="d-flex justify-content-between align-items-center">
                            <h4 class="mb-0">
                                <i class="bi bi-cash-register me-2"></i>
                                Punto de Venta
                            </h4>
                            <div class="text-white-50 small">
                                <i class="bi bi-keyboard me-1"></i>
                                F1: Scanner | F2: Buscar | F3: Vender
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <!-- Alert Messages -->
                        <div v-if="successMessage" class="alert alert-success alert-dismissible fade show mb-3" role="alert">
                            <i class="bi bi-check-circle me-2"></i>
                            {{ successMessage }}
                            <button type="button" class="btn-close" @click="successMessage = ''"></button>
                        </div>
                        
                        <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show mb-3" role="alert">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            {{ errorMessage }}
                            <button type="button" class="btn-close" @click="errorMessage = ''"></button>
                        </div>

                        <!-- Product Scanner Input -->
                        <div class="mb-4">
                            <label for="productScanner" class="form-label fw-bold">
                                <i class="bi bi-upc-scan me-2"></i>
                                Escanear Producto
                            </label>
                            <div class="input-group">
                                <input 
                                    type="text" 
                                    id="productScanner"
                                    v-model="scannedCode"
                                    @keyup.enter="scanProduct"
                                    class="form-control form-control-lg"
                                    placeholder="Escanee el código de barras o ingrese manualmente..."
                                    autofocus
                                >
                                <button 
                                    @click="scanProduct"
                                    class="btn btn-success btn-lg"
                                    type="button"
                                >
                                    <i class="bi bi-upc-scan me-2"></i>
                                    Escanear
                                </button>
                                <button 
                                    @click="openSearchModal"
                                    class="btn btn-outline-primary btn-lg"
                                    type="button"
                                >
                                    <i class="bi bi-search me-2"></i>
                                    Buscar
                                </button>
                            </div>
                        </div>

                        <!-- Cart Items -->
                        <div class="cart-section">
                            <h5 class="mb-3">
                                <i class="bi bi-cart me-2"></i>
                                Productos en Carrito
                            </h5>
                            
                            <div v-if="cart.length === 0" class="text-center text-muted py-4">
                                <i class="bi bi-cart-x display-4"></i>
                                <p class="mt-2">No hay productos en el carrito</p>
                            </div>

                            <div v-else class="cart-items">
                                <div 
                                    v-for="(item, index) in cart" 
                                    :key="index"
                                    class="cart-item card mb-2"
                                >
                                    <div class="card-body py-2">
                                        <div class="row align-items-center">
                                            <div class="col-md-4">
                                                <strong>{{ item.name }}</strong>
                                                <br>
                                                <small class="text-muted">{{ item.brand }}</small>
                                            </div>
                                            <div class="col-md-2">
                                                <span class="fw-bold">{{ formatCLP(item.price) }}</span>
                                            </div>
                                            <div class="col-md-3">
                                                <div class="input-group input-group-sm">
                                                    <button 
                                                        @click="decreaseQuantity(index)"
                                                        class="btn btn-outline-secondary"
                                                        type="button"
                                                    >
                                                        <i class="bi bi-dash"></i>
                                                    </button>
                                                    <input 
                                                        type="number" 
                                                        v-model.number="item.quantity"
                                                        @change="updateItemTotal(index)"
                                                        class="form-control text-center"
                                                        min="1"
                                                        style="max-width: 80px;"
                                                    >
                                                    <button 
                                                        @click="increaseQuantity(index)"
                                                        class="btn btn-outline-secondary"
                                                        type="button"
                                                    >
                                                        <i class="bi bi-plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="col-md-2">
                                                <span class="fw-bold text-success">
                                                    {{ formatCLP(item.total) }}
                                                </span>
                                            </div>
                                            <div class="col-md-1">
                                                <button 
                                                    @click="removeFromCart(index)"
                                                    class="btn btn-outline-danger btn-sm"
                                                    type="button"
                                                >
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Side - Totals and Checkout -->
            <div class="col-md-4 d-flex">
                <div class="card flex-fill sticky-top" style="top: 20px;">
                    <div class="card-header text-white" style="background-color: #022e6b;">
                        <h5 class="mb-0">
                            <i class="bi bi-calculator me-2"></i>
                            Resumen de Venta
                        </h5>
                    </div>
                    <div class="card-body">
                        <!-- Totals -->
                        <div class="totals-section mb-4">
                            <div class="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <span>{{ formatCLP(subtotal) }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>IVA (19%):</span>
                                <span>{{ formatCLP(tax) }}</span>
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="fw-bold fs-5">Total:</span>
                                <span class="fw-bold fs-5 text-success">{{ formatCLP(total) }}</span>
                            </div>
                        </div>

                        <!-- Payment Methods -->
                        <div class="payment-methods mb-4">
                            <h6 class="mb-3">Método de Pago</h6>
                            <div class="btn-group w-100 mb-3" role="group">
                                <input type="radio" class="btn-check" name="paymentMethod" id="cash" value="cash" v-model="paymentMethod">
                                <label class="btn btn-outline-primary" for="cash">
                                    <i class="bi bi-cash-coin me-2"></i>Efectivo
                                </label>
                                
                                <input type="radio" class="btn-check" name="paymentMethod" id="card" value="card" v-model="paymentMethod">
                                <label class="btn btn-outline-primary" for="card">
                                    <i class="bi bi-credit-card me-2"></i>Tarjeta
                                </label>
                                
                                <input type="radio" class="btn-check" name="paymentMethod" id="transfer" value="transfer" v-model="paymentMethod">
                                <label class="btn btn-outline-primary" for="transfer">
                                    <i class="bi bi-bank me-2"></i>Transferencia
                                </label>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="action-buttons">
                            <button 
                                @click="completeSale"
                                :disabled="cart.length === 0 || !paymentMethod"
                                class="btn btn-success btn-lg w-100 mb-2"
                            >
                                <i class="bi bi-check-circle me-2"></i>
                                Completar Venta
                            </button>
                            
                            <button 
                                @click="clearCart"
                                :disabled="cart.length === 0"
                                class="btn btn-outline-secondary w-100 mb-2"
                            >
                                <i class="bi bi-trash me-2"></i>
                                Limpiar Carrito
                            </button>
                            
                            <!-- Print Receipt Button - Hidden -->
                            <!-- <button 
                                @click="printReceipt"
                                :disabled="cart.length === 0"
                                class="btn btn-outline-info w-100"
                            >
                                <i class="bi bi-printer me-2"></i>
                                Imprimir Ticket
                            </button> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Product Search Modal -->
        <div v-if="showSearchModal" class="modal-overlay" @click="showSearchModal = false">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="bi bi-search me-2"></i>
                        Buscar Producto
                    </h5>
                    <button type="button" class="btn-close" @click="showSearchModal = false"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <input 
                            type="text" 
                            v-model="searchQuery"
                            @input="searchProducts"
                            class="form-control form-control-lg"
                            placeholder="Buscar por nombre, marca o código..."
                            autofocus
                        >
                    </div>
                    
                    <div v-if="searching" class="text-center py-4">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Buscando...</span>
                        </div>
                        <p class="mt-2">Buscando productos...</p>
                    </div>
                    
                    <div v-else-if="searchResults.length > 0" class="search-results">
                        <div 
                            v-for="product in searchResults" 
                            :key="product.id"
                            class="product-result card mb-2 cursor-pointer"
                            @click="selectProduct(product)"
                        >
                            <div class="card-body py-2">
                                <div class="row align-items-center">
                                    <div class="col-md-6">
                                        <strong>{{ product.name }}</strong>
                                        <br>
                                        <small class="text-muted">{{ product.brand }}</small>
                                        <br>
                                        <small class="text-info">{{ product.category }}</small>
                                    </div>
                                    <div class="col-md-3 text-center">
                                        <span class="fw-bold text-success">{{ formatCLP(product.price) }}</span>
                                    </div>
                                    <div class="col-md-3 text-center">
                                        <span class="badge" :class="product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'">
                                            Stock: {{ product.stock }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div v-else-if="searchQuery && !searching" class="text-center text-muted py-4">
                        <i class="bi bi-search display-4"></i>
                        <p class="mt-2">No se encontraron productos</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="showSearchModal = false">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import productService from '@/services/productService'

// Reactive data
const scannedCode = ref('')
const cart = ref([])
const paymentMethod = ref('')
const searchQuery = ref('')
const searchResults = ref([])
const searching = ref(false)
const showSearchModal = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Computed properties
const subtotal = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.total, 0)
})

const tax = computed(() => {
    return Math.round(subtotal.value * 0.19) // 19% IVA redondeado hacia arriba desde 0.5
})

const total = computed(() => {
    return subtotal.value + tax.value
})

// Utility function to format currency as CLP
const formatCLP = (amount) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount)
}

// Methods
const scanProduct = async () => {
    if (!scannedCode.value.trim()) return
    
    try {
        const product = await productService.getProductByCode(scannedCode.value.trim())
        
        if (product) {
            if (product.stock > 0) {
                addToCart(product)
                scannedCode.value = ''
                showSuccessMessage(`Producto agregado: ${product.name}`)
            } else {
                showErrorMessage('Producto sin stock disponible')
            }
        } else {
            // If not found by code, open search modal
            searchQuery.value = scannedCode.value
            showSearchModal.value = true
            searchProducts()
            scannedCode.value = ''
        }
    } catch (error) {
        showErrorMessage('Error al escanear producto')
        console.error('Scan error:', error)
    }
}

const addToCart = (product) => {
    const existingItem = cart.value.find(item => item.id === product.id)
    
    if (existingItem) {
        existingItem.quantity++
        updateItemTotal(cart.value.indexOf(existingItem))
    } else {
        cart.value.push({
            ...product,
            quantity: 1,
            total: product.price
        })
    }
}

const removeFromCart = (index) => {
    cart.value.splice(index, 1)
}

const increaseQuantity = (index) => {
    cart.value[index].quantity++
    updateItemTotal(index)
}

const decreaseQuantity = (index) => {
    if (cart.value[index].quantity > 1) {
        cart.value[index].quantity--
        updateItemTotal(index)
    }
}

const updateItemTotal = (index) => {
    cart.value[index].total = cart.value[index].price * cart.value[index].quantity
}

const clearCart = () => {
    cart.value = []
    paymentMethod.value = ''
}

const completeSale = () => {
    if (cart.value.length === 0 || !paymentMethod.value) return
    
    // Here you would typically send the sale data to your backend
    const saleData = {
        items: cart.value,
        subtotal: subtotal.value,
        tax: tax.value,
        total: total.value,
        paymentMethod: paymentMethod.value,
        timestamp: new Date().toISOString()
    }
    
    console.log('Sale completed:', saleData)
    
    // Show success message and clear cart
    alert(`Venta completada exitosamente!\nTotal: ${formatCLP(total.value)}`)
    clearCart()
}

const printReceipt = () => {
    if (cart.value.length === 0) return
    
    const receiptContent = `
        === TICKET DE VENTA ===
        Fecha: ${new Date().toLocaleString()}
        
        Productos:
        ${cart.value.map(item => 
            `${item.name} x${item.quantity} - ${formatCLP(item.total)}`
        ).join('\n')}
        
        Subtotal: ${formatCLP(subtotal.value)}
        IVA (19%): ${formatCLP(tax.value)}
        Total: ${formatCLP(total.value)}
        
        Método de pago: ${paymentMethod.value}
        
        ¡Gracias por su compra!
    `
    
    // In a real app, you'd send this to a printer service
    console.log('Printing receipt:', receiptContent)
    alert('Ticket enviado a impresora')
}

const openSearchModal = () => {
    showSearchModal.value = true
    searchProducts()
}

const searchProducts = async () => {
    if (!searchQuery.value.trim()) {
        searchResults.value = []
        return
    }
    
    searching.value = true
    
    try {
        const results = await productService.searchProducts(searchQuery.value)
        searchResults.value = results
    } catch (error) {
        showErrorMessage('Error al buscar productos')
        console.error('Search error:', error)
        searchResults.value = []
    } finally {
        searching.value = false
    }
}

const selectProduct = (product) => {
    if (product.stock > 0) {
        addToCart(product)
        showSuccessMessage(`Producto agregado: ${product.name}`)
        // Close modal
        showSearchModal.value = false
        searchQuery.value = ''
        searchResults.value = []
    } else {
        showErrorMessage('Producto sin stock disponible')
    }
}

// Message handling
const showSuccessMessage = (message) => {
    successMessage.value = message
    setTimeout(() => {
        successMessage.value = ''
    }, 3000)
}

const showErrorMessage = (message) => {
    errorMessage.value = message
    setTimeout(() => {
        errorMessage.value = ''
    }, 5000)
}

// Keyboard shortcuts
const handleKeydown = (event) => {
    // F1 - Focus scanner
    if (event.key === 'F1') {
        event.preventDefault()
        const scannerInput = document.getElementById('productScanner')
        if (scannerInput) {
            scannerInput.focus()
        }
    }
    
    // F2 - Open search modal
    if (event.key === 'F2') {
        event.preventDefault()
        showSearchModal.value = true
    }
    
    // F3 - Complete sale
    if (event.key === 'F3') {
        event.preventDefault()
        if (cart.value.length > 0 && paymentMethod.value) {
            completeSale()
        }
    }
    
    // Escape - Close search modal
    if (event.key === 'Escape' && showSearchModal.value) {
        showSearchModal.value = false
    }
}

// Focus scanner input on mount
onMounted(() => {
    const scannerInput = document.getElementById('productScanner')
    if (scannerInput) {
        scannerInput.focus()
    }
    
    // Add keyboard event listener
    document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    // Remove keyboard event listener
    document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.cart-item {
    transition: all 0.2s ease;
}

.cart-item:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.cursor-pointer {
    cursor: pointer;
}

.cursor-pointer:hover {
    background-color: #f8f9fa;
}

.sticky-top {
    z-index: 1020;
}

/* Custom scrollbar for cart */
.cart-items {
    max-height: 400px;
    overflow-y: auto;
}

.cart-items::-webkit-scrollbar {
    width: 6px;
}

.cart-items::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.cart-items::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.cart-items::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* Custom Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
}

.modal-content {
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 800px;
    max-height: 80vh;
    overflow: hidden;
}

.modal-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #dee2e6;
    background-color: #f8f9fa;
}

.modal-body {
    padding: 1.5rem;
    max-height: 60vh;
    overflow-y: auto;
}

.modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #dee2e6;
    background-color: #f8f9fa;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .sticky-top {
        position: static !important;
    }
    
    .modal-content {
        width: 95%;
        margin: 1rem;
    }
}

/* Equal height cards */
.row {
    align-items: stretch;
}

.card {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.card-body {
    flex: 1;
}
</style>