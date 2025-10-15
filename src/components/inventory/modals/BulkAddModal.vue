<template>
  <!-- Bootstrap Modal -->
  <div class="modal fade" id="bulkAddModal" tabindex="-1" aria-labelledby="bulkAddModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="bulkAddModalLabel">Agregar Múltiples Productos</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        
        <div class="modal-body">
          <div class="bulk-add-instructions mb-3">
            <h6>Instrucciones:</h6>
            <p class="text-muted mb-2">Ingresa los productos en el siguiente formato, uno por línea:</p>
            <code>código|nombre|marca|categoría|precio_compra|precio_venta|proveedor|stock|descripción</code>
            <p class="text-muted mt-2">Ejemplo:</p>
            <code>PROD001|Laptop HP|HP|Electrónicos|500000|750000|Proveedor A|10|Laptop HP Pavilion</code>
          </div>
          
          <div class="mb-3">
            <label class="form-label">Productos (uno por línea)</label>
            <textarea 
              v-model="bulkProductsText" 
              class="form-control bulk-textarea" 
              rows="10" 
              placeholder="Ingresa los productos aquí..."
            ></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-primary" @click="handleSubmit">Agregar Productos</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BulkAddModal',
  emits: ['submit'],
  data() {
    return {
      bulkProductsText: ''
    }
  },
  methods: {
    handleSubmit() {
      if (!this.bulkProductsText.trim()) {
        alert('Por favor ingresa al menos un producto')
        return
      }
      
      const lines = this.bulkProductsText.trim().split('\n')
      const products = []
      
      for (const line of lines) {
        if (line.trim()) {
          const [code, name, brand, category, buyPrice, sellPrice, supplier, stock, description] = line.split('|')
          if (code && name) {
            products.push({
              code: code.trim(),
              name: name.trim(),
              brand: brand?.trim() || '',
              category: category?.trim() || '',
              buyPrice: parseFloat(buyPrice) || 0,
              sellPrice: parseFloat(sellPrice) || 0,
              supplier: supplier?.trim() || '',
              stock: parseInt(stock) || 0,
              description: description?.trim() || ''
            })
          }
        }
      }
      
      if (products.length === 0) {
        alert('No se encontraron productos válidos. Verifica el formato.')
        return
      }
      
      // Emit the products data
      this.$emit('submit', products)
      
      // Reset the form
      this.bulkProductsText = ''
      
      // Close the modal using Bootstrap's modal API
      const modal = bootstrap.Modal.getInstance(document.getElementById('bulkAddModal'))
      if (modal) {
        modal.hide()
      }
    }
  },
  
  mounted() {
    // Reset form when modal is hidden
    const modal = document.getElementById('bulkAddModal')
    modal.addEventListener('hidden.bs.modal', () => {
      this.bulkProductsText = ''
    })
  }
}
</script>

<style scoped>
.bulk-add-instructions {
  margin-bottom: 20px;
}

.bulk-textarea {
  width: 100%;
  font-family: monospace;
  font-size: 12px;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  resize: vertical;
}

.bulk-textarea:focus {
  outline: none;
  border-color: #022e6b;
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
