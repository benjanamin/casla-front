// Product Service for POS System
// This service handles all product-related operations

class ProductService {
    constructor() {
        // In a real application, this would come from your backend API
        this.products = [
            { 
                id: '001', 
                code: '123456789', 
                name: 'Laptop HP Pavilion', 
                brand: 'HP', 
                price: 899990, 
                stock: 15,
                category: 'Computadoras',
                description: 'Laptop HP Pavilion 15.6" Intel Core i5'
            },
            { 
                id: '002', 
                code: '987654321', 
                name: 'Mouse Inalámbrico', 
                brand: 'Logitech', 
                price: 29990, 
                stock: 50,
                category: 'Periféricos',
                description: 'Mouse inalámbrico Logitech M185'
            },
            { 
                id: '003', 
                code: '456789123', 
                name: 'Teclado Mecánico', 
                brand: 'Corsair', 
                price: 149990, 
                stock: 25,
                category: 'Periféricos',
                description: 'Teclado mecánico Corsair K70 RGB'
            },
            { 
                id: '004', 
                code: '789123456', 
                name: 'Monitor 24"', 
                brand: 'Samsung', 
                price: 199990, 
                stock: 30,
                category: 'Monitores',
                description: 'Monitor Samsung 24" Full HD'
            },
            { 
                id: '005', 
                code: '321654987', 
                name: 'Auriculares Gaming', 
                brand: 'Razer', 
                price: 79990, 
                stock: 40,
                category: 'Audio',
                description: 'Auriculares gaming Razer Kraken X'
            },
            { 
                id: '006', 
                code: '147258369', 
                name: 'Webcam HD', 
                brand: 'Logitech', 
                price: 59990, 
                stock: 35,
                category: 'Periféricos',
                description: 'Webcam Logitech C270 HD'
            },
            { 
                id: '007', 
                code: '963852741', 
                name: 'Impresora Láser', 
                brand: 'HP', 
                price: 299990, 
                stock: 20,
                category: 'Impresoras',
                description: 'Impresora láser HP LaserJet Pro'
            },
            { 
                id: '008', 
                code: '852963741', 
                name: 'SSD 500GB', 
                brand: 'Samsung', 
                price: 89990, 
                stock: 45,
                category: 'Almacenamiento',
                description: 'SSD Samsung 870 EVO 500GB'
            }
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
            product.category.toLowerCase().includes(searchTerm)
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
            price: parseFloat(productData.price),
            stock: parseInt(productData.stock),
            category: productData.category,
            description: productData.description
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

    // Get products with pagination
    getProductsWithPagination(page = 1, limit = 10, search = '') {
        let filteredProducts = this.products

        if (search) {
            filteredProducts = this.products.filter(product => 
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.brand.toLowerCase().includes(search.toLowerCase())
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
}

// Create and export a singleton instance
const productService = new ProductService()
export default productService
