<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-card">
        <!-- Logo/Brand Section -->
        <div class="brand-section">
          <div class="brand-logo">
            <i class="bi bi-shield-check"></i>
          </div>
          <h2 class="brand-title">Casla</h2>
          <p class="brand-subtitle">Inicia sesión en tu cuenta</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Username input -->
          <div class="form-group">
            <div class="input-wrapper">
              <i class="bi bi-person input-icon"></i>
              <input 
                v-model="formData.username"
                type="text" 
                id="username" 
                class="form-input" 
                :class="{ 'error': errors.username }"
                placeholder="Usuario"
                required
              />
            </div>
            <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
          </div>

          <!-- Password input -->
          <div class="form-group">
            <div class="input-wrapper">
              <i class="bi bi-lock input-icon"></i>
              <input 
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                class="form-input" 
                :class="{ 'error': errors.password }"
                placeholder="Contraseña"
                required
              />
              <button 
                type="button" 
                class="password-toggle"
                @click="togglePassword"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <!-- Remember me and Forgot password -->
          <div class="form-options">
            <label class="checkbox-wrapper">
              <input 
                v-model="formData.rememberMe"
                type="checkbox" 
                class="checkbox-input"
              />
              <span class="checkbox-custom"></span>
              <span class="checkbox-label">Recordarme</span>
            </label>
            <a href="#" class="forgot-link">¿Olvidaste tu contraseña?</a>
          </div>

          <!-- Submit button -->
          <button 
            type="submit" 
            class="submit-btn"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="loading-spinner"></span>
            <span v-else>{{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}</span>
          </button>

          <!-- Divider -->
          <!-- <div class="divider">
            <span class="divider-text"></span>
          </div> -->

          <!-- Register link -->
          <!-- <div class="register-section">
            <p class="register-text">
              ¿No tienes una cuenta? 
              <a href="#" class="register-link">Regístrate aquí</a>
            </p>
          </div> -->
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'

// Form data
const formData = reactive({
  username: '',
  password: '',
  rememberMe: false
})

// Form state
const showPassword = ref(false)
const isLoading = ref(false)
const errors = reactive({
  username: '',
  password: ''
})

// Methods
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const validateForm = () => {
  errors.username = ''
  errors.password = ''
  
  if (!formData.username.trim()) {
    errors.username = 'El usuario es requerido'
  }
  
  if (!formData.password) {
    errors.password = 'La contraseña es requerida'
  } else if (formData.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
  }
  
  return !errors.username && !errors.password
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Here you would typically make your actual login API call
    let body = {
      "usernameOrEmail": formData.username,
      "password": formData.password
    }
    // Use proxy in development, direct URL in production
    let url = import.meta.env.DEV ? '/api/Auth/login' : `${import.meta.env.VITE_API_URL}/api/Auth/login`
    let response = await axios.post(url, body)
    console.log(response)

    
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1rem;
}

.login-wrapper {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #57c28b, #022e6b);
}

/* Brand Section */
.brand-section {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-logo {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #57c28b, #47b57d);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 8px 20px rgba(87, 194, 139, 0.3);
}

.brand-logo i {
  font-size: 1.8rem;
  color: white;
}

.brand-title {
  color: #022e6b;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.brand-subtitle {
  color: #6c757d;
  font-size: 1rem;
  margin: 0;
}

/* Form Styles */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #6c757d;
  font-size: 1.1rem;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-input:focus {
  outline: none;
  border-color: #57c28b;
  background: white;
  box-shadow: 0 0 0 4px rgba(87, 194, 139, 0.1);
}

.form-input.error {
  border-color: #dc3545;
  background: #fff5f5;
}

.form-input::placeholder {
  color: #adb5bd;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.password-toggle:hover {
  background: #e9ecef;
  color: #495057;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-left: 0.5rem;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #e9ecef;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
}

.checkbox-input:checked + .checkbox-custom {
  background: #57c28b;
  border-color: #57c28b;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
}

.checkbox-label {
  color: #495057;
  font-size: 0.9rem;
}

.forgot-link {
  color: #57c28b;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: #47b57d;
  text-decoration: underline;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #57c28b, #47b57d);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(87, 194, 139, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Divider */
.divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e9ecef;
}

.divider-text {
  background: white;
  padding: 0 1rem;
  color: #6c757d;
  font-size: 0.9rem;
}

/* Social Buttons */
.social-buttons {
  display: flex;
  gap: 1rem;
}

.social-btn {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  background: white;
  color: #495057;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.google-btn:hover {
  border-color: #db4437;
  color: #db4437;
}

.facebook-btn:hover {
  border-color: #4267B2;
  color: #4267B2;
}

.social-btn i {
  font-size: 1.1rem;
}

/* Register Section */
.register-section {
  text-align: center;
  margin-top: 1.5rem;
}

.register-text {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
}

.register-link {
  color: #57c28b;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.register-link:hover {
  color: #47b57d;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-container {
    padding: 0.5rem;
  }
  
  .login-card {
    padding: 2rem 1.5rem;
    border-radius: 16px;
  }
  
  .brand-title {
    font-size: 1.75rem;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .social-buttons {
    flex-direction: column;
  }
  
  .social-btn {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem 1rem;
    border-radius: 12px;
  }
  
  .brand-logo {
    width: 50px;
    height: 50px;
  }
  
  .brand-logo i {
    font-size: 1.5rem;
  }
  
  .brand-title {
    font-size: 1.5rem;
  }
  
  .form-input {
    padding: 0.875rem 0.875rem 0.875rem 2.5rem;
    font-size: 0.9rem;
  }
  
  .input-icon {
    font-size: 1rem;
    left: 0.875rem;
  }
  
  .submit-btn {
    padding: 0.875rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 360px) {
  .login-card {
    padding: 1rem 0.75rem;
  }
  
  .brand-section {
    margin-bottom: 1.5rem;
  }
  
  .login-form {
    gap: 1rem;
  }
  
  .form-input {
    padding: 0.75rem 0.75rem 0.75rem 2.25rem;
  }
  
  .input-icon {
    left: 0.75rem;
  }
}
</style>