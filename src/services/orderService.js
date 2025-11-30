// Order Service for Inventory System
// This service handles all order-related operations matching the backend DTOs

import authService from './authService'

class OrderService {
    constructor() {
        // Get API URL from environment variables
        this.apiUrl = import.meta.env.BACKEND_API_URL
    }

    // Generic API call method (same pattern as productService)
    async apiCall(endpoint, options = {}) {
        // Use proxy in development, direct URL in production (same pattern as productService)
        // Check if endpoint already starts with /api to avoid double /api/api
        let url
        if (import.meta.env.DEV) {
            // In development, use proxy. Only prepend /api if endpoint doesn't already start with it
            url = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`
        } else {
            // In production, use full API URL
            url = `${import.meta.env.VITE_API_URL}${endpoint}`
        }
        
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

    // Create a new order - matches CreateOrderDto
    // DTO structure:
    // {
    //     type: 'SELL' | 'BUY', // OrderType enum
    //     paymentMethod: 'CASH' | 'CREDIT' | 'TRANSFER' | 'OTHER', // OrderPaymentMethod enum
    //     amountPaid: number,
    //     amountDue: number,
    //     productOrders: Array<{ productId: number, quantity: number, unitPrice: number }>,
    //     userId: number // Required UserId
    // }
    async createOrder(orderData) {
        return this.apiCall('/api/Orders/create-order', {
            method: 'POST',
            body: JSON.stringify(orderData)
        })
    }
}

// Create and export a singleton instance
const orderService = new OrderService()
export default orderService

