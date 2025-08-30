<template>
  <div class="summary-cards">
    <div class="summary-card primary-background">
      <h3>Total Productos</h3>
      <p class="number">{{ summary.totalProducts }}</p>
    </div>
    <div class="summary-card secondary-background">
      <h3>Valor Total</h3>
      <p class="number">${{ formatCurrency(summary.totalValue) }}</p>
    </div>
    <div class="summary-card danger-background">
      <h3>Stock Bajo</h3>
      <p class="number warning">{{ summary.lowStockCount }}</p>
    </div>
    <div class="summary-card primary-background">
      <h3>Categorías</h3>
      <p class="number">{{ summary.categories.length }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SummaryCards',
  props: {
    summary: {
      type: Object,
      required: true,
      default: () => ({
        totalProducts: 0,
        totalValue: 0,
        lowStockCount: 0,
        categories: []
      })
    }
  },
  methods: {
    formatCurrency(amount) {
      return amount.toLocaleString('es-CL')
    }
  }
}
</script>

<style scoped>
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  padding: 25px;
  border-radius: 12px;
  color: white;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.summary-card h3 {
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.summary-card .number {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
}

.summary-card.warning {
  color: #ff6b6b;
}

/* Responsive Design */
@media (max-width: 768px) {
  .summary-cards {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }
  
  .summary-card {
    padding: 20px;
  }
  
  .summary-card .number {
    font-size: 2rem;
  }
}
</style>
