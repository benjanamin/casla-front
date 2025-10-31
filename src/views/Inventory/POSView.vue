<template>
    <div class="container-fluid">
        <div class="row mt-3 mb-3">
            <!-- Left Side - Product Scanning and Cart -->
            <div class="col-12 col-lg-8 mb-3">
                <div class="card h-100">
                    <div class="card-header text-white" style="background-color: #022e6b;">
                        <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                            <h4 class="mb-2 mb-md-0">
                                <i class="bi bi-cash-register me-2"></i>
                                Punto de Venta
                            </h4>
                            <div class="text-white-50 small">
                                <i class="bi bi-keyboard me-1"></i>
                                <span class="d-none d-md-inline">F1: Scanner | F2: Buscar | F3: Vender</span>
                                <span class="d-md-none">Toca para escanear o buscar productos</span>
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
                            <div class="d-flex flex-column flex-md-row gap-2">
                                <input 
                                    type="text" 
                                    id="productScanner"
                                    v-model="scannedCode"
                                    @keyup.enter="scanProduct"
                                    class="form-control form-control-lg flex-fill"
                                    placeholder="Escanee el código de barras o ingrese manualmente..."
                                    autofocus
                                >
                                <div class="d-flex gap-2">
                                    <button 
                                        @click="scanProduct"
                                        class="btn btn-success btn-lg flex-fill"
                                        type="button"
                                    >
                                        <i class="bi bi-upc-scan me-2"></i>
                                        <span class="d-none d-sm-inline">Escanear</span>
                                        <span class="d-sm-none">✓</span>
                                    </button>
                                    <button 
                                        @click="openSearchModal"
                                        class="btn btn-outline-primary btn-lg flex-fill"
                                        type="button"
                                    >
                                        <i class="bi bi-search me-2"></i>
                                        <span class="d-none d-sm-inline">Buscar</span>
                                        <span class="d-sm-none">🔍</span>
                                    </button>
                                </div>
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
                                    class="cart-item card mb-3"
                                >
                                    <div class="card-body p-3">
                                        <div class="row g-3">
                                            <div class="col-12 col-md-4">
                                                <div class="product-info">
                                                    <strong class="d-block">{{ item.name }}</strong>
                                                    <small class="text-muted">{{ item.brand }}</small>
                                                </div>
                                            </div>
                                            <div class="col-6 col-md-2 text-center text-md-start">
                                                <div class="price-display">
                                                    <span class="fw-bold">{{ formatCLP(item.price) }}</span>
                                                    <small class="d-block d-md-none text-muted">Precio unitario</small>
                                                </div>
                                            </div>
                                            <div class="col-6 col-md-3">
                                                <div class="quantity-controls">
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
                                                    <small class="d-block d-md-none text-muted text-center">Cantidad</small>
                                                </div>
                                            </div>
                                            <div class="col-6 col-md-2 text-center text-md-start">
                                                <div class="total-display">
                                                    <span class="fw-bold text-success">{{ formatCLP(item.total) }}</span>
                                                    <small class="d-block d-md-none text-muted">Total</small>
                                                </div>
                                            </div>
                                            <div class="col-6 col-md-1 text-center">
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
            <div class="col-12 col-lg-4">
                <div class="card h-100">
                    <div class="card-header text-white" style="background-color: #022e6b;">
                        <h5 class="mb-0">
                            <i class="bi bi-calculator me-2"></i>
                            Resumen de Venta
                        </h5>
                    </div>
                    <div class="card-body d-flex flex-column">
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
                        <div class="action-buttons mt-auto">
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
                            <div class="card-body py-3">
                                <div class="row g-2">
                                    <div class="col-12 col-md-6">
                                        <strong class="d-block">{{ product.name }}</strong>
                                        <small class="text-muted d-block">{{ product.brand }}</small>
                                        <small class="text-info d-block">{{ product.category }}</small>
                                    </div>
                                    <div class="col-6 col-md-3 text-center">
                                        <span class="fw-bold text-success d-block">{{ formatCLP(product.price) }}</span>
                                        <small class="text-muted d-md-none">Precio</small>
                                    </div>
                                    <div class="col-6 col-md-3 text-center">
                                        <span class="badge d-block" :class="product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'">
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
                    <button type="button" class="btn btn-secondary w-100 w-md-auto" @click="showSearchModal = false">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Floating Action Button -->
        <div class="mobile-fab d-lg-none">
            <button 
                @click="openSearchModal"
                class="btn btn-primary rounded-circle"
                title="Buscar Producto"
            >
                <i class="bi bi-search"></i>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import productService from '@/services/productService'
import authService from '@/services/authService'
import Swal from 'sweetalert2'

const router = useRouter()

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
        Swal.fire({
            title: 'Ups',
            icon: 'warning',
            text: 'No se pudo obtener el producto. Inténtalo de nuevo.'
        })
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

// Focus scanner input on mount and check authentication
onMounted(async () => {
    // Check authentication (any logged-in user can access POS)
    if (!authService.isAuthenticated()) {
        // No token found, redirect to login
        router.push('/login')
        return
    }
    
    // If authentication is valid, focus the scanner input
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
    padding: 1rem;
}

.modal-content {
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
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

/* Touch-friendly improvements */
.btn {
    min-height: 44px; /* Minimum touch target size */
}

.form-control {
    min-height: 44px;
}

/* Product info styling */
.product-info strong {
    color: #022e6b;
    font-size: 1rem;
}

.product-info small {
    color: #666;
    font-size: 0.875rem;
}

.price-display,
.total-display,
.quantity-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
}

@media (min-width: 768px) {
    .price-display,
    .total-display,
    .quantity-controls {
        align-items: flex-start;
    }
}

/* Search results improvements */
.search-results .product-result {
    transition: all 0.2s ease;
    border: 1px solid #dee2e6;
}

.search-results .product-result:hover {
    border-color: #022e6b;
    box-shadow: 0 2px 8px rgba(2, 46, 107, 0.1);
}

.search-results .product-result .badge {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
}

/* Mobile-first responsive design */
@media (max-width: 768px) {
    .container-fluid {
        padding: 0.5rem;
    }
    
    .card-header h4 {
        font-size: 1.25rem;
    }
    
    .card-header h5 {
        font-size: 1.1rem;
    }
    
    .form-control-lg {
        font-size: 1rem;
        padding: 0.75rem;
    }
    
    .btn-lg {
        padding: 0.75rem 1rem;
        font-size: 1rem;
    }
    
    .cart-item .card-body {
        padding: 1rem;
    }
    
    .cart-item .row {
        margin: 0;
    }
    
    .cart-item .col-6 {
        padding: 0.5rem;
    }
    
    .quantity-controls .input-group {
        justify-content: center;
    }
    
    .quantity-controls .input-group .btn {
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
    }
    
    .quantity-controls .form-control {
        text-align: center;
        font-size: 0.875rem;
        padding: 0.5rem;
    }
    
    .payment-methods .form-check {
        padding: 0.75rem;
        border: 1px solid #dee2e6;
        border-radius: 0.375rem;
        margin-bottom: 0.5rem;
    }
    
    .payment-methods .form-check:hover {
        background-color: #f8f9fa;
    }
    
    .payment-methods .form-check-input {
        margin-top: 0.25rem;
    }
    
    .action-buttons .btn {
        padding: 1rem;
        font-size: 1.1rem;
        font-weight: 600;
    }
    
    .modal-content {
        margin: 0;
        border-radius: 0;
        height: 100vh;
        max-height: 100vh;
    }
    
    .modal-header,
    .modal-body,
    .modal-footer {
        padding: 1rem;
    }
    
    .search-results .product-result {
        margin-bottom: 0.75rem;
    }
    
    .search-results .product-result .card-body {
        padding: 1rem;
    }
    
    /* Mobile cart improvements */
    .cart-items {
        max-height: 60vh;
    }
    
    .cart-item {
        border-left: 4px solid #022e6b;
    }
    
    .cart-item .product-info strong {
        font-size: 1.1rem;
        line-height: 1.3;
    }
    
    .cart-item .product-info small {
        font-size: 0.8rem;
        opacity: 0.8;
    }
    
    /* Mobile button improvements */
    .btn-icon {
        min-width: 44px;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    /* Mobile search improvements */
    .search-results .product-result {
        border-left: 4px solid #e0e0e0;
    }
    
    .search-results .product-result:hover {
        border-left-color: #022e6b;
    }
    
    /* Button group payment method mobile improvements */
    .payment-methods .btn-group {
        flex-direction: column;
    }
    
    .payment-methods .btn-group .btn {
        border-radius: 0.375rem !important;
        margin-bottom: 0.5rem;
        padding: 0.75rem;
        border: 1px solid #dee2e6;
    }
    
    .payment-methods .btn-group .btn:hover {
        background-color: #f8f9fa;
    }
}

@media (max-width: 576px) {
    .container-fluid {
        padding: 0.25rem;
    }
    
    .card-header {
        padding: 0.75rem 1rem;
    }
    
    .card-body {
        padding: 1rem;
    }
    
    .cart-item .card-body {
        padding: 0.75rem;
    }
    
    .cart-item .col-6 {
        padding: 0.25rem;
    }
    
    .btn-lg {
        padding: 0.625rem 0.875rem;
        font-size: 0.9rem;
    }
    
    .form-control-lg {
        padding: 0.625rem;
        font-size: 0.9rem;
    }
    
    .modal-content {
        border-radius: 0;
    }
    
    .modal-header,
    .modal-body,
    .modal-footer {
        padding: 0.75rem;
    }
    
    /* Extra small screen improvements */
    .cart-item .product-info strong {
        font-size: 1rem;
    }
    
    .cart-item .product-info small {
        font-size: 0.75rem;
    }
    
    .quantity-controls .input-group {
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .quantity-controls .input-group .form-control {
        order: 2;
        margin: 0.25rem 0;
    }
    
    .quantity-controls .input-group .btn {
        order: 1;
        flex: 1;
        min-height: 40px;
    }
    
    .payment-methods .form-check {
        padding: 0.5rem;
        margin-bottom: 0.25rem;
    }
    
    .action-buttons .btn {
        padding: 0.875rem;
        font-size: 1rem;
    }
}

/* Mobile Floating Action Button */
.mobile-fab {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 1040;
}

.mobile-fab .btn {
    width: 56px;
    height: 56px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
}

.mobile-fab .btn:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

@media (max-width: 576px) {
    .mobile-fab {
        bottom: 1.5rem;
        right: 1.5rem;
    }
    
    .mobile-fab .btn {
        width: 48px;
        height: 48px;
    }
}


</style>