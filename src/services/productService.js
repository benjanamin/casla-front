// Product Service for Inventory System
// This service handles all product-related operations matching the backend DTOs

import authService from './authService'

class ProductService {
    constructor() {
        // Get API URL from environment variables
        this.apiUrl = import.meta.env.BACKEND_API_URL
        
        // Mock data matching ProductResponseDto structure
        this.products = [
            { 
                id: 1, 
                barcode: '123456789', 
                name: 'Laptop HP Pavilion', 
                brand: 'HP', 
                unitSellPrice: 899990, 
                stock: 15,
                description: 'Laptop HP Pavilion 15.6" Intel Core i5',
                unit: 'unidad',
                enabled: true,
                showInPOS: true,
                showInStore: false,
                createdAt: '2024-01-15T00:00:00Z',
                updatedAt: '2024-01-20T00:00:00Z'
            },
            { 
                id: 2, 
                barcode: '987654321', 
                name: 'Mouse Inalámbrico', 
                brand: 'Logitech', 
                unitSellPrice: 29990, 
                stock: 50,
                description: 'Mouse inalámbrico Logitech M185',
                unit: 'unidad',
                enabled: true,
                showInPOS: true,
                showInStore: true,
                createdAt: '2024-01-10T00:00:00Z',
                updatedAt: '2024-01-18T00:00:00Z'
            },
            { 
                id: 3, 
                barcode: '456789123', 
                name: 'Teclado Mecánico', 
                brand: 'Corsair', 
                unitSellPrice: 149990, 
                stock: 25,
                description: 'Teclado mecánico Corsair K70 RGB',
                unit: 'unidad',
                enabled: true,
                showInPOS: true,
                showInStore: true,
                createdAt: '2024-01-12T00:00:00Z',
                updatedAt: '2024-01-22T00:00:00Z'
            },
            { 
                id: 4, 
                barcode: '789123456', 
                name: 'Monitor 24"', 
                brand: 'Samsung', 
                unitSellPrice: 199990, 
                stock: 30,
                description: 'Monitor Samsung 24" Full HD',
                unit: 'unidad',
                enabled: true,
                showInPOS: true,
                showInStore: false,
                createdAt: '2024-01-08T00:00:00Z',
                updatedAt: '2024-01-25T00:00:00Z'
            },
            { 
                id: 5, 
                barcode: '321654987', 
                name: 'Auriculares Gaming', 
                brand: 'Razer', 
                unitSellPrice: 79990, 
                stock: 40,
                description: 'Auriculares gaming Razer Kraken X',
                unit: 'unidad',
                enabled: true,
                showInPOS: true,
                showInStore: true,
                createdAt: '2024-01-14T00:00:00Z',
                updatedAt: '2024-01-21T00:00:00Z'
            }
        ]
    }

    // Get all products
    getAllProducts() {
        return Promise.resolve([...this.products])
    }

    // Get product by barcode/code
    async getProductByCode(code) {
        // Use proxy in development, direct URL in production (same pattern as LoginView)
        const url = import.meta.env.DEV 
            ? `/api/Product/get-by-barcode/${code}` 
            : `${import.meta.env.VITE_API_URL}/api/Product/get-by-barcode/${code}`
        
        // Get auth token for authenticated requests
        const token = authService.getAuthToken()
        const headers = {
            'Content-Type': 'application/json',
        }
        
        // Add Authorization header if token exists
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
            })
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error(`Failed to get product by barcode ${code}:`, error)
            throw error
        }
    }

    // Search products by query (name, brand, or barcode)
    searchProducts(query) {
        if (!query || query.trim() === '') {
            return Promise.resolve([])
        }

        const searchTerm = query.toLowerCase().trim()
        const results = this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm) ||
            product.barcode.includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        )

        return Promise.resolve(results)
    }

    // Get products that are enabled and shown in POS
    getProductsForPOS() {
        const results = this.products.filter(product => 
            product.enabled && product.showInPOS
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
            product.updatedAt = new Date().toISOString()
            return Promise.resolve(product)
        }
        return Promise.reject(new Error('Product not found'))
    }

    // Add new product - matches CreateProductDto
    addProduct(productData) {
        const now = new Date().toISOString()
        const newProduct = {
            id: Date.now(), // Simple ID generation
            barcode: productData.barcode || '',
            name: productData.name,
            brand: productData.brand,
            unitSellPrice: parseInt(productData.unitSellPrice),
            stock: parseInt(productData.stock),
            description: productData.description || '',
            unit: productData.unit || 'unidad',
            enabled: productData.enabled !== undefined ? productData.enabled : true,
            showInPOS: productData.showInPOS !== undefined ? productData.showInPOS : true,
            showInStore: productData.showInStore !== undefined ? productData.showInStore : false,
            createdAt: now,
            updatedAt: now
        }

        this.products.push(newProduct)
        return Promise.resolve(newProduct)
    }

    // Update existing product
    updateProduct(productId, updates) {
        const productIndex = this.products.findIndex(p => p.id === productId)
        if (productIndex !== -1) {
            this.products[productIndex] = { 
                ...this.products[productIndex], 
                ...updates,
                updatedAt: new Date().toISOString()
            }
            return Promise.resolve(this.products[productIndex])
        }
        return Promise.reject(new Error('Product not found'))
    }

    // Record a purchase (buy transaction) - updates stock only
    recordPurchase(productId, quantity) {
        const product = this.products.find(p => p.id === productId)
        if (product) {
            product.stock += quantity
            product.updatedAt = new Date().toISOString()
            return Promise.resolve(product)
        }
        return Promise.reject(new Error('Product not found'))
    }

    // Record a sale (sell transaction) - updates stock only
    recordSale(productId, quantity) {
        const product = this.products.find(p => p.id === productId)
        if (product && product.stock >= quantity) {
            product.stock -= quantity
            product.updatedAt = new Date().toISOString()
            return Promise.resolve(product)
        }
        return Promise.reject(new Error('Product not found or insufficient stock'))
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

    // Get product categories (if needed for legacy support)
    getCategories() {
        // Categories are no longer part of the DTO, return empty array
        return Promise.resolve([])
    }

    // Get suppliers (if needed for legacy support)
    getSuppliers() {
        // Suppliers are no longer part of the DTO, return empty array
        return Promise.resolve([])
    }

    // Get products with pagination
    getProductsWithPagination(page = 1, limit = 10, search = '') {
        let filteredProducts = this.products

        if (search) {
            const searchLower = search.toLowerCase()
            filteredProducts = this.products.filter(product => 
                product.name.toLowerCase().includes(searchLower) ||
                product.brand.toLowerCase().includes(searchLower) ||
                product.barcode.includes(search) ||
                product.description.toLowerCase().includes(searchLower)
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
        // Calculate total value using sell price (since buyPrice is no longer in DTO)
        const totalValue = this.products.reduce((sum, product) => sum + (product.unitSellPrice * product.stock), 0)
        const lowStockCount = this.products.filter(p => p.stock < 10).length
        // Categories no longer exist in the DTO
        const categories = []

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
        // Use proxy in development, direct URL in production (same pattern as getProductByCode)
        const url = import.meta.env.DEV 
            ? `/api${endpoint}` 
            : `${import.meta.env.VITE_API_URL}${endpoint}`
        
        // Get auth token for authenticated requests
        const token = authService.getAuthToken()
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        
        // Add Authorization header if token exists
        if (token) {
            defaultOptions.headers['Authorization'] = `Bearer ${token}`
        }
        
        const config = { 
            ...defaultOptions, 
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...(options.headers || {})
            }
        }
        
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
        return this.apiCall('/api/Product')
    }

    // Get product by ID from backend
    async getProductByIdFromAPI(id) {
        return this.apiCall(`/api/Product/${id}`)
    }

    // Create new product via API - matches CreateProductDto
    async createProductAPI(productData) {
        // Map to CreateProductDto structure
        const createDto = {
            barcode: productData.barcode || '',
            brand: productData.brand,
            name: productData.name,
            description: productData.description || '',
            unitSellPrice: parseInt(productData.unitSellPrice),
            stock: parseInt(productData.stock),
            enabled: productData.enabled !== undefined ? productData.enabled : true,
            showInPOS: productData.showInPOS !== undefined ? productData.showInPOS : true,
            showInStore: productData.showInStore !== undefined ? productData.showInStore : false
        }
        return this.apiCall('/api/Product', {
            method: 'POST',
            body: JSON.stringify(createDto)
        })
    }

    // Update product via API
    async updateProductAPI(id, productData) {
        return this.apiCall(`/api/Product/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        })
    }

    // Delete product via API
    async deleteProductAPI(id) {
        return this.apiCall(`/api/Product/${id}`, {
            method: 'DELETE'
        })
    }

    // Search products via API
    async searchProductsAPI(query) {
        return this.apiCall(`/api/Product/search?q=${encodeURIComponent(query)}`)
    }

    // Get products with pagination via API
    async getProductsWithPaginationAPI(page = 1, limit = 10, search = '') {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(search && { search })
        })
        return this.apiCall(`/api/Product?${params}`)
    }
}

// Create and export a singleton instance
const productService = new ProductService()
export default productService
