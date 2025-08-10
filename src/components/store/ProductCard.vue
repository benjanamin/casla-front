<script setup>
const props = defineProps({
  brand: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})
</script>

<template>
    <div class="card">
        <img src="https://picsum.photos/200" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title product-brand"><b>{{ brand }}</b></h5>
            <h5 class="card-title"><b>
                {{ name }}
            </b></h5>
            <a href="https://wa.me/5491112345678?text=Hola,%20me%20interesa%20consultar%20el%20precio%20de%20este%20producto" 
               class="btn btn-cta w-100" 
               target="_blank" rel="noopener noreferrer">
                <i class="bi bi-whatsapp me-2"></i>Consultar precio
            </a>
        </div>
    </div>
</template>

 <style scoped>
 .product-brand {
   color: #022e6b;
 }

 .btn-cta {
   --btn-color: #0f5132; /* deep green text */
   --btn-bg: #e9f7ef;    /* very light green background */
   --btn-border: #57c28b; /* mint border */

   color: var(--btn-color);
   background-color: var(--btn-bg);
   border: 1px solid var(--btn-border);
   border-radius: 10px;
   padding: 0.6rem 1rem;
   font-weight: 600;
   display: inline-flex;
   align-items: center;
   justify-content: center;
   gap: 0.35rem;
   transition: all 160ms ease-in-out;
 }

 .btn-cta:hover,
 .btn-cta:focus {
   background-color: #d8f2e4;
   border-color: #47b57d;
   color: #0b3d25;
   text-decoration: none;
   box-shadow: 0 2px 8px rgba(0,0,0,0.08);
 }

 .btn-cta:active {
   transform: translateY(1px);
 }
 </style>