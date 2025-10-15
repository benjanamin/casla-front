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
                <label class="form-label">Código</label>
                <input v-model="formData.code" type="text" class="form-control" required>
              </div>
              <div class="col-md-6">
                <label class="form-label">Nombre</label>
                <input v-model="formData.name" type="text" class="form-control" required>
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Marca</label>
                <input v-model="formData.brand" type="text" class="form-control" required>
              </div>
              <div class="col-md-6">
                <label class="form-label">Categoría</label>
                <select v-model="formData.category" class="form-select" required>
                  <option value="">Seleccionar categoría</option>
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Precio de Compra</label>
                <input v-model="formData.buyPrice" type="number" min="0" step="100" class="form-control" required>
              </div>
              <div class="col-md-6">
                <label class="form-label">Precio de Venta</label>
                <input v-model="formData.sellPrice" type="number" min="0" step="100" class="form-control" required>
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Proveedor</label>
                <select v-model="formData.supplier" class="form-select" required>
                  <option value="">Seleccionar proveedor</option>
                  <option v-for="supplier in suppliers" :key="supplier" :value="supplier">
                    {{ supplier }}
                  </option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Stock Inicial</label>
                <input v-model="formData.stock" type="number" min="0" class="form-control" required>
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
  props: {
    categories: {
      type: Array,
      default: () => []
    },
    suppliers: {
      type: Array,
      default: () => []
    }
  },
  emits: ['submit'],
  data() {
    return {
      formData: {
        code: '',
        name: '',
        brand: '',
        category: '',
        buyPrice: '',
        sellPrice: '',
        supplier: '',
        stock: '',
        description: ''
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', { ...this.formData })
      this.resetForm()
      // Close the modal using Bootstrap's modal API
      const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'))
      if (modal) {
        modal.hide()
      }
    },
    
    resetForm() {
      this.formData = {
        code: '',
        name: '',
        brand: '',
        category: '',
        buyPrice: '',
        sellPrice: '',
        supplier: '',
        stock: '',
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
