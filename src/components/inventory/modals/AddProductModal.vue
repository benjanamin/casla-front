<template>
  
  <!-- Bootstrap Modal -->
  <div class="modal fade" id="addProductModal" tabindex="-1" aria-labelledby="addProductModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addProductModalLabel">Agregar Nuevo Producto</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        
        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Código de Barras</label>
                <input v-model="formData.barcode" type="text" class="form-control">
              </div>
              <div class="col-md-6">
                <label class="form-label">Nombre <span class="text-danger">*</span></label>
                <input v-model="formData.name" type="text" class="form-control" required>
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Marca <span class="text-danger">*</span></label>
                <input v-model="formData.brand" type="text" class="form-control" required>
              </div>
              <div class="col-md-6">
                <label class="form-label">Precio de Venta Unitario <span class="text-danger">*</span></label>
                <input 
                  :value="formattedPrice" 
                  @input="handlePriceInput"
                  type="text" 
                  class="form-control" 
                  placeholder="0"
                  required>
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Stock Inicial <span class="text-danger">*</span></label>
                <input 
                  :value="formattedStock" 
                  @input="handleStockInput"
                  type="text" 
                  class="form-control" 
                  placeholder="0"
                  required>
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Descripción</label>
              <textarea v-model="formData.description" class="form-control" rows="3"></textarea>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-primary">Agregar Producto</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddProductModal',
  emits: ['submit'],
  data() {
    return {
      formData: {
        barcode: '',
        name: '',
        brand: '',
        unitSellPrice: 0,
        stock: 0,
        description: ''
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
      if (!this.formData.stock || this.formData.stock === 0) {
        return ''
      }
      return Number(this.formData.stock).toLocaleString('es-CL')
    }
  },
  methods: {
    handlePriceInput(event) {
      // Remove all non-digit characters
      const rawValue = event.target.value.replace(/\D/g, '')
      // Convert to integer and store
      this.formData.unitSellPrice = rawValue === '' ? 0 : parseInt(rawValue, 10)
    },
    
    handleStockInput(event) {
      // Remove all non-digit characters
      const rawValue = event.target.value.replace(/\D/g, '')
      // Convert to integer and store
      this.formData.stock = rawValue === '' ? 0 : parseInt(rawValue, 10)
    },
    
    handleSubmit() {
      // Prepare data matching CreateProductDto structure
      const productData = {
        barcode: this.formData.barcode || '',
        brand: this.formData.brand,
        name: this.formData.name,
        description: this.formData.description || '',
        unitSellPrice: parseInt(this.formData.unitSellPrice) || 0,
        stock: parseInt(this.formData.stock) || 0,
        enabled: true, // Always true by default
        showInPOS: true, // Always true as per requirements
        showInStore: false // Always false as per requirements
      }
      
      this.$emit('submit', productData)
      this.resetForm()
      // Close the modal using Bootstrap's modal API
      this.closeModal()
    },
    
    closeModal() {
      const modalElement = document.getElementById('addProductModal')
      if (!modalElement) return
      
      // Try multiple methods to close the modal
      // Method 1: Try window.bootstrap (Bootstrap 5)
      if (window.bootstrap) {
        const modal = window.bootstrap.Modal.getInstance(modalElement)
        if (modal) {
          modal.hide()
          return
        }
      }
      
      // Method 2: Try to get Bootstrap from the element's data
      if (modalElement._bootstrap) {
        modalElement._bootstrap.hide()
        return
      }
      
      // Method 3: Trigger the close button click
      const closeButton = modalElement.querySelector('[data-bs-dismiss="modal"]')
      if (closeButton) {
        closeButton.click()
        return
      }
      
      // Method 4: Manually hide using Bootstrap classes and events
      modalElement.classList.remove('show')
      modalElement.style.display = 'none'
      document.body.classList.remove('modal-open')
      const backdrop = document.querySelector('.modal-backdrop')
      if (backdrop) {
        backdrop.remove()
      }
    },
    
    resetForm() {
      this.formData = {
        barcode: '',
        name: '',
        brand: '',
        unitSellPrice: 0,
        stock: 0,
        description: ''
      }
    }
  },
  
  mounted() {
    // Reset form when modal is hidden
    const modal = document.getElementById('addProductModal')
    modal.addEventListener('hidden.bs.modal', () => {
      this.resetForm()
    })
  }
}
</script>

<style scoped>
/* Custom styling for Bootstrap modal if needed */
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

.btn-primary:hover {
  background-color: #1a4a8a;
  border-color: #1a4a8a;
}

.btn-secondary {
  background-color: #e6a71e;
  border-color: #e6a71e;
}

.btn-secondary:hover {
  background-color: #d19a1a;
  border-color: #d19a1a;
}
</style>
