<template>
  <!-- Bootstrap Modal -->
  <div class="modal fade" id="editProductModal" tabindex="-1" aria-labelledby="editProductModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editProductModalLabel">Editar Producto</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="modal-body text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3">Cargando información del producto...</p>
        </div>
        
        <!-- Form -->
        <form v-else @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Código de Barras</label>
                <input 
                  v-model="formData.barcode" 
                  type="text" 
                  class="form-control"
                  maxlength="100">
              </div>
              <div class="col-md-6">
                <label class="form-label">Nombre</label>
                <input 
                  v-model="formData.name" 
                  type="text" 
                  class="form-control"
                  maxlength="100">
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Marca</label>
                <input 
                  v-model="formData.brand" 
                  type="text" 
                  class="form-control"
                  maxlength="100">
              </div>
              <div class="col-md-6">
                <label class="form-label">Precio de Venta Unitario</label>
                <input 
                  :value="formattedPrice" 
                  @input="handlePriceInput"
                  type="text" 
                  class="form-control" 
                  placeholder="0">
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Stock</label>
                <input 
                  :value="formattedStock" 
                  @input="handleStockInput"
                  type="text" 
                  class="form-control" 
                  placeholder="0">
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="saving">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditProductModal',
  emits: ['submit'],
  props: {
    productId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      saving: false,
      formData: {
        barcode: '',
        name: '',
        brand: '',
        unitSellPrice: null,
        stock: null
      }
    }
  },
  computed: {
    formattedPrice() {
      if (!this.formData.unitSellPrice || this.formData.unitSellPrice === 0) {
        return ''
      }
      return Number(this.formData.unitSellPrice).toLocaleString('es-CL')
    },
    formattedStock() {
      if (this.formData.stock === null || this.formData.stock === undefined || this.formData.stock === 0) {
        return ''
      }
      return Number(this.formData.stock).toLocaleString('es-CL')
    }
  },
  methods: {
    
    setProductData(product) {
      this.formData = {
        barcode: product.barcode || '',
        name: product.name || '',
        brand: product.brand || '',
        unitSellPrice: product.unitSellPrice || null,
        stock: product.stock !== undefined ? product.stock : null
      }
    },
    
    handlePriceInput(event) {
      // Remove all non-digit characters
      const rawValue = event.target.value.replace(/\D/g, '')
      // Convert to integer and store
      this.formData.unitSellPrice = rawValue === '' ? null : parseInt(rawValue, 10)
    },
    
    handleStockInput(event) {
      // Remove all non-digit characters
      const rawValue = event.target.value.replace(/\D/g, '')
      // Convert to integer and store
      this.formData.stock = rawValue === '' ? null : parseInt(rawValue, 10)
    },
    
    async handleSubmit() {
      this.saving = true
      
      try {
        // Prepare data matching UpdateProductDto structure
        const updateData = {
          barcode: this.formData.barcode || null,
          name: this.formData.name || null,
          brand: this.formData.brand || null,
          unitSellPrice: this.formData.unitSellPrice !== null ? this.formData.unitSellPrice : null,
          stock: this.formData.stock !== null ? this.formData.stock : null
        }
        
        // Remove null/undefined/empty values
        Object.keys(updateData).forEach(key => {
          if (updateData[key] === null || updateData[key] === undefined || updateData[key] === '') {
            delete updateData[key]
          }
        })
        
        await this.$emit('submit', updateData)
      } catch (error) {
        console.error('Error submitting form:', error)
        this.saving = false
      }
    },
    
    resetForm() {
      this.formData = {
        barcode: '',
        name: '',
        brand: '',
        unitSellPrice: null,
        stock: null
      }
      this.saving = false
      this.loading = false
    },
    
    openModal() {
      // Wait a tick to ensure DOM is ready
      this.$nextTick(() => {
        const modalElement = document.getElementById('editProductModal')
        if (!modalElement) {
          console.error('EditProductModal: Modal element not found')
          return
        }
        
        // Try to access Bootstrap Modal - Bootstrap 5 bundle should expose it
        // Since bootstrap is imported in main.js, try accessing it
        try {
          // Method 1: window.bootstrap (if exposed globally)
          if (window.bootstrap && window.bootstrap.Modal) {
            const modal = window.bootstrap.Modal.getInstance(modalElement) || 
                         new window.bootstrap.Modal(modalElement)
            modal.show()
            return
          }
          
          // Method 2: Try importing bootstrap dynamically
          import('bootstrap').then(bootstrap => {
            const modal = bootstrap.Modal.getInstance(modalElement) || 
                         new bootstrap.Modal(modalElement)
            modal.show()
          }).catch(() => {
            // Fallback if import fails
            this.manualShowModal(modalElement)
          })
        } catch (error) {
          console.warn('Could not access Bootstrap Modal, using fallback:', error)
          this.manualShowModal(modalElement)
        }
      })
    },
    
    manualShowModal(modalElement) {
      modalElement.classList.add('show')
      modalElement.style.display = 'block'
      modalElement.setAttribute('aria-hidden', 'false')
      modalElement.setAttribute('aria-modal', 'true')
      document.body.classList.add('modal-open')
      const backdrop = document.createElement('div')
      backdrop.className = 'modal-backdrop fade show'
      document.body.appendChild(backdrop)
    },
    
    closeModal() {
      const modalElement = document.getElementById('editProductModal')
      if (!modalElement) return
      
      // Try multiple methods to close the modal
      if (window.bootstrap) {
        const modal = window.bootstrap.Modal.getInstance(modalElement)
        if (modal) {
          modal.hide()
          return
        }
      }
      
      if (modalElement._bootstrap) {
        modalElement._bootstrap.hide()
        return
      }
      
      const closeButton = modalElement.querySelector('[data-bs-dismiss="modal"]')
      if (closeButton) {
        closeButton.click()
        return
      }
      
      modalElement.classList.remove('show')
      modalElement.style.display = 'none'
      document.body.classList.remove('modal-open')
      const backdrop = document.querySelector('.modal-backdrop')
      if (backdrop) {
        backdrop.remove()
      }
    }
  },
  
  mounted() {
    // Reset form when modal is hidden
    const modal = document.getElementById('editProductModal')
    if (modal) {
      modal.addEventListener('hidden.bs.modal', () => {
        this.resetForm()
      })
    }
  }
}
</script>

<style scoped>
.modal-lg {
  max-width: 800px;
}

.form-label {
  font-weight: 600;
  color: #333;
}

.btn-primary {
  background-color: #022e6b;
  border-color: #022e6b;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1a4a8a;
  border-color: #1a4a8a;
}

.btn-secondary {
  background-color: #e6a71e;
  border-color: #e6a71e;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #d19a1a;
  border-color: #d19a1a;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>

