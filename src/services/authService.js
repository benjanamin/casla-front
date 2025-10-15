import axios from 'axios'

class AuthService {
  constructor() {
    this.baseURL = import.meta.env.DEV ? '/api/Auth' : `${import.meta.env.VITE_API_URL}/api/Auth`
  }

  // Get the auth token from cookies
  getAuthToken() {
    const cookies = document.cookie.split(';')
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='))
    
    if (authCookie) {
      const token = authCookie.split('=')[1]
      if (token && token !== 'undefined' && token !== 'null') {
        return token
      }
    }
    return null
  }

  // Check if user is authenticated (has valid token)
  isAuthenticated() {
    return this.getAuthToken() !== null
  }

  // Get current user info and role from /api/Auth/me
  async getCurrentUser() {
    try {
      const token = this.getAuthToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await axios.get(`${this.baseURL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      return response.data
    } catch (error) {
      console.error('Error fetching user info:', error)
      throw error
    }
  }

  // Check if user has Admin role
  async isAdmin() {
    try {
      const user = await this.getCurrentUser()
      return user.role === 'Admin'
    } catch (error) {
      console.error('Error checking admin role:', error)
      return false
    }
  }

  // Clear authentication (logout)
  logout() {
    // Clear the auth token cookie
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }

  // Validate authentication and role
  async validateAuthAndRole() {
    try {
      // First check if token exists
      if (!this.isAuthenticated()) {
        return { isValid: false, reason: 'no_token' }
      }

      // Then check if user is admin
      const isAdmin = await this.isAdmin()
      if (!isAdmin) {
        return { isValid: false, reason: 'not_admin' }
      }

      return { isValid: true, reason: 'valid' }
    } catch (error) {
      console.error('Error validating authentication:', error)
      return { isValid: false, reason: 'error' }
    }
  }
}

// Export a singleton instance
export default new AuthService()
