// Product Service for Inventory System
// This service handles all product-related operations including buy/sell prices and history

class ProductService {
    constructor() {
        // Get API URL from environment variables
        this.apiUrl = import.meta.env.BACKEND_API_URL
        
        // In a real application, this would come from your backend API
        this.products = [
            { 
                id: '001', 
                code: '123456789', 
                name: 'Laptop HP Pavilion', 
                brand: 'HP', 
                sellPrice: 899990, 
                buyPrice: 650000,
                supplier: 'Distribuidora TechMax',
                stock: 15,
                category: 'Computadoras',
                description: 'Laptop HP Pavilion 15.6" Intel Core i5',
                priceHistory: [
                    { date: '2024-01-15', type: 'buy', price: 650000, supplier: 'Distribuidora TechMax', quantity: 20 },
                    { date: '2024-01-20', type: 'sell', price: 899990, quantity: 5 }
                ]
            },
            { 
                id: '002', 
                code: '987654321', 
                name: 'Mouse Inalámbrico', 
                brand: 'Logitech', 
                sellPrice: 29990, 
                buyPrice: 18000,
                supplier: 'Electronics Pro',
                stock: 50,
                category: 'Periféricos',
                description: 'Mouse inalámbrico Logitech M185',
                priceHistory: [
                    { date: '2024-01-10', type: 'buy', price: 18000, supplier: 'Electronics Pro', quantity: 100 },
                    { date: '2024-01-18', type: 'sell', price: 29990, quantity: 50 }
                ]
            },
            { 
                id: '003', 
                code: '456789123', 
                name: 'Teclado Mecánico', 
                brand: 'Corsair', 
                sellPrice: 149990, 
                buyPrice: 95000,
                supplier: 'Gaming Gear Co',
                stock: 25,
                category: 'Periféricos',
                description: 'Teclado mecánico Corsair K70 RGB',
                priceHistory: [
                    { date: '2024-01-12', type: 'buy', price: 95000, supplier: 'Gaming Gear Co', quantity: 30 },
                    { date: '2024-01-22', type: 'sell', price: 149990, quantity: 5 }
                ]
            },
            { 
                id: '004', 
                code: '789123456', 
                name: 'Monitor 24"', 
                brand: 'Samsung', 
                sellPrice: 199990, 
                buyPrice: 140000,
                supplier: 'Display Solutions',
                stock: 30,
                category: 'Monitores',
                description: 'Monitor Samsung 24" Full HD',
                priceHistory: [
                    { date: '2024-01-08', type: 'buy', price: 140000, supplier: 'Display Solutions', quantity: 40 },
                    { date: '2024-01-25', type: 'sell', price: 199990, quantity: 10 }
                ]
            },
            { 
                id: '005', 
                code: '321654987', 
                name: 'Auriculares Gaming', 
                brand: 'Razer', 
                sellPrice: 79990, 
                buyPrice: 52000,
                supplier: 'Audio Masters',
                stock: 40,
                category: 'Audio',
                description: 'Auriculares gaming Razer Kraken X',
                priceHistory: [
                    { date: '2024-01-14', type: 'buy', price: 52000, supplier: 'Audio Masters', quantity: 60 },
                    { date: '2024-01-21', type: 'sell', price: 79990, quantity: 20 }
                ]
            }
        ]
        
        this.suppliers = [
            'Distribuidora TechMax',
            'Electronics Pro', 
            'Gaming Gear Co',
            'Display Solutions',
            'Audio Masters',
            'Storage Plus',
            'Network Solutions'
        ]
    }

    // Get all products
    getAllProducts() {
        return Promise.resolve([...this.products])
    }

    // Get product by barcode/code
    getProductByCode(code) {
        const product = this.products.find(p => p.code === code)
        return Promise.resolve(product || null)
    }

    // Search products by query (name, brand, or code)
    searchProducts(query) {
        if (!query || query.trim() === '') {
            return Promise.resolve([])
        }

        const searchTerm = query.toLowerCase().trim()
        const results = this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm) ||
            product.code.includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.supplier.toLowerCase().includes(searchTerm)
        )

        return Promise.resolve(results)
    }

    // Get products by category
    getProductsByCategory(category) {
        const results = this.products.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        )
        return Promise.resolve(results)
    }

    // Get low stock products (stock < 10)
    getLowStockProducts() {
        const results = this.products.filter(product => product.stock < 10)
        return Promise.resolve(results)
    }

    // Update product stock (for inventory management)
    updateStock(productId, newStock) {
        const product = this.products.find(p => p.id === productId)
        if (product) {
            product.stock = Math.max(0, newStock) // Ensure stock doesn't go negative
            return Promise.resolve(product)
        }
        return Promise.reject(new Error('Product not found'))
    }

    // Add new product
    addProduct(productData) {
        const newProduct = {
            id: Date.now().toString(), // Simple ID generation
            code: productData.code,
            name: productData.name,
            brand: productData.brand,
            sellPrice: parseFloat(productData.sellPrice),
            buyPrice: parseFloat(productData.buyPrice),
            supplier: productData.supplier,
            stock: parseInt(productData.stock),
            category: productData.category,
            description: productData.description,
            priceHistory: [
                { 
                    date: new Date().toISOString().split('T')[0], 
                    type: 'buy', 
                    price: parseFloat(productData.buyPrice), 
                    supplier: productData.supplier, 
                    quantity: parseInt(productData.stock) 
                }
            ]
        }

        this.products.push(newProduct)
        return Promise.resolve(newProduct)
    }

    // Update existing product
    updateProduct(productId, updates) {
        const productIndex = this.products.findIndex(p => p.id === productId)
        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...updates }
            return Promise.resolve(this.products[productIndex])
        }
        return Promise.reject(new Error('Product not found'))
    }

    // Record a purchase (buy transaction)
    recordPurchase(productId, quantity, buyPrice, supplier) {
        const product = this.products.find(p => p.id === productId)
        if (product) {
            product.stock += quantity
            product.buyPrice = buyPrice
            product.supplier = supplier
            
            product.priceHistory.push({
                date: new Date().toISOString().split('T')[0],
                type: 'buy',
                price: buyPrice,
                supplier: supplier,
                quantity: quantity
            })
            
            return Promise.resolve(product)
        }
        return Promise.reject(new Error('Product not found'))
    }

    // Record a sale (sell transaction)
    recordSale(productId, quantity, sellPrice) {
        const product = this.products.find(p => p.id === productId)
        if (product && product.stock >= quantity) {
            product.stock -= quantity
            
            product.priceHistory.push({
                date: new Date().toISOString().split('T')[0],
                type: 'sell',
                price: sellPrice,
                quantity: quantity
            })
            
            return Promise.resolve(product)
        }
        return Promise.reject(new Error('Product not found or insufficient stock'))
    }

    // Get price history for a product
    getPriceHistory(productId) {
        const product = this.products.find(p => p.id === productId)
        if (product) {
            return Promise.resolve([...product.priceHistory].sort((a, b) => new Date(b.date) - new Date(a.date)))
        }
        return Promise.reject(new Error('Product not found'))
    }

    // Delete product
    deleteProduct(productId) {
        const productIndex = this.products.findIndex(p => p.id === productId)
        if (productIndex !== -1) {
            const deletedProduct = this.products.splice(productIndex, 1)[0]
            return Promise.resolve(deletedProduct)
        }
        return Promise.reject(new Error('Product not found'))
    }

    // Get product categories
    getCategories() {
        const categories = [...new Set(this.products.map(p => p.category))]
        return Promise.resolve(categories)
    }

    // Get suppliers
    getSuppliers() {
        return Promise.resolve([...this.suppliers])
    }

    // Get products with pagination
    getProductsWithPagination(page = 1, limit = 10, search = '') {
        let filteredProducts = this.products

        if (search) {
            filteredProducts = this.products.filter(product => 
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.brand.toLowerCase().includes(search.toLowerCase()) ||
                product.supplier.toLowerCase().includes(search.toLowerCase())
            )
        }

        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

        return Promise.resolve({
            products: paginatedProducts,
            total: filteredProducts.length,
            page,
            limit,
            totalPages: Math.ceil(filteredProducts.length / limit)
        })
    }

    // Get inventory summary
    getInventorySummary() {
        const totalProducts = this.products.length
        const totalValue = this.products.reduce((sum, product) => sum + (product.buyPrice * product.stock), 0)
        const lowStockCount = this.products.filter(p => p.stock < 10).length
        const categories = [...new Set(this.products.map(p => p.category))]

        return Promise.resolve({
            totalProducts,
            totalValue,
            lowStockCount,
            categories
        })
    }

    // ===== REAL API METHODS FOR BACKEND INTEGRATION =====
    
    // Generic API call method
    async apiCall(endpoint, options = {}) {
        const url = `${this.apiUrl}${endpoint}`
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        
        const config = { ...defaultOptions, ...options }
        
        try {
            const response = await fetch(url, config)
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error(`API call failed for ${endpoint}:`, error)
            throw error
        }
    }

    // Get all products from backend
    async getAllProductsFromAPI() {
        return this.apiCall('/products')
    }

    // Get product by ID from backend
    async getProductByIdFromAPI(id) {
        return this.apiCall(`/products/${id}`)
    }

    // Create new product via API
    async createProductAPI(productData) {
        return this.apiCall('/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        })
    }

    // Update product via API
    async updateProductAPI(id, productData) {
        return this.apiCall(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        })
    }

    // Delete product via API
    async deleteProductAPI(id) {
        return this.apiCall(`/products/${id}`, {
            method: 'DELETE'
        })
    }

    // Search products via API
    async searchProductsAPI(query) {
        return this.apiCall(`/products/search?q=${encodeURIComponent(query)}`)
    }

    // Get products with pagination via API
    async getProductsWithPaginationAPI(page = 1, limit = 10, search = '') {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(search && { search })
        })
        return this.apiCall(`/products?${params}`)
    }
}

// Create and export a singleton instance
const productService = new ProductService()
export default productService
