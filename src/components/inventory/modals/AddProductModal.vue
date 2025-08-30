<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2>Agregar Nuevo Producto</h2>
        <button @click="$emit('close')" class="close-btn">x</button>
      </div>
      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-row">
          <div class="form-group">
            <label>Código</label>
            <input v-model="formData.code" type="text" required>
          </div>
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="formData.name" type="text" required>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Marca</label>
            <input v-model="formData.brand" type="text" required>
          </div>
          <div class="form-group">
            <label>Categoría</label>
            <select v-model="formData.category" required>
              <option value="">Seleccionar categoría</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Precio de Compra</label>
            <input v-model="formData.buyPrice" type="number" min="0" step="100" required>
          </div>
          <div class="form-group">
            <label>Precio de Venta</label>
            <input v-model="formData.sellPrice" type="number" min="0" step="100" required>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Proveedor</label>
            <select v-model="formData.supplier" required>
              <option value="">Seleccionar proveedor</option>
              <option v-for="supplier in suppliers" :key="supplier" :value="supplier">
                {{ supplier }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Stock Inicial</label>
            <input v-model="formData.stock" type="number" min="0" required>
          </div>
        </div>
        
        <div class="form-group">
          <label>Descripción</label>
          <textarea v-model="formData.description" rows="3"></textarea>
        </div>
        
        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary">
            Agregar Producto
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddProductModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    categories: {
      type: Array,
      default: () => []
    },
    suppliers: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close', 'submit'],
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
  
  watch: {
    show(newVal) {
      if (!newVal) {
        this.resetForm()
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 25px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  color: #022e6b;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background-color: #f0f0f0;
  color: #333;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 25px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #022e6b;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #022e6b;
  color: white;
}

.btn-primary:hover {
  background-color: #1a4a8a;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: #e6a71e;
  color: white;
}

.btn-secondary:hover {
  background-color: #d19a1a;
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
