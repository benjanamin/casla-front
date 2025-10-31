<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  brand: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false,
    default: ''
  },
  largeImage: {
    type: String,
    required: false,
    default: ''
  },
  category: {
    type: String,
    required: false,
    default: ''
  }
})

// Resolve image: if it's an external URL, use it; otherwise try to load from src/assets/products
const defaultPlaceholder = 'https://picsum.photos/300/200?random=999'

const imageSrc = computed(() => {
  if (!props.image) return defaultPlaceholder
  if (/^https?:\/\//.test(props.image)) return props.image
  if (props.image.startsWith('/products/')) return encodeURI(props.image)

  try {
    // from this file (src/components/store) to src/assets/products -> ../../assets/products
    return new URL(`../../assets/products/${props.image}`, import.meta.url).href
  } catch (e) {
    return defaultPlaceholder
  }
})

const largeImageSrc = computed(() => {
  const src = props.largeImage || props.image
  if (!src) return defaultPlaceholder
  if (/^https?:\/\//.test(src)) return src
  if (src.startsWith('/products/')) return encodeURI(src)

  try {
    return new URL(`../../assets/products/${src}`, import.meta.url).href
  } catch (e) {
    return defaultPlaceholder
  }
})

const showLightbox = ref(false)

const openLightbox = () => { showLightbox.value = true }
const closeLightbox = () => { showLightbox.value = false }

const onKeydown = (e) => {
  if (e.key === 'Escape' && showLightbox.value) closeLightbox()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

const whatsappHref = computed(() => {
  const text = `Hola, me interesa consultar el precio del producto: ${props.name}`
  const encoded = encodeURIComponent(text)
  // Put your real phone number here or keep the existing one
  return `https://wa.me/56983557025?text=${encoded}`
})
</script>

<template>
  <div>
    <div class="card">
      <img :src="imageSrc" class="card-img-top" :alt="name" @click="openLightbox" />
      <div class="card-body">
  <h6 class="text-muted mb-1 small">{{ category.replaceAll('-', ' ') }}</h6>
        <h5 class="card-title product-brand"><b>{{ brand }}</b></h5>
        <h5 class="card-title mb-3"><b>{{ name }}</b></h5>
        <a :href="whatsappHref" 
           class="btn btn-cta w-100" 
           target="_blank" rel="noopener noreferrer">
          <i class="bi bi-whatsapp me-2"></i>Consultar precio
        </a>
      </div>
    </div>

    <!-- Lightbox overlay (teleported to body so it isn't clipped by parent containers) -->
    <teleport to="body" v-if="showLightbox">
      <div class="lightbox-overlay" role="dialog" aria-modal="true" @click="closeLightbox">
        <div class="lightbox-content" @click.stop>
          <button class="lightbox-close" @click="closeLightbox" aria-label="Cerrar">×</button>
          <img :src="largeImageSrc" class="lightbox-img" :alt="name" />
        </div>
      </div>
    </teleport>
  </div>
</template>

<style scoped>
/* Make card layout fill its parent and keep image sizes consistent */
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-img-top {
  width: 100%;
  height: 260px; /* uniform image height for all cards - adjust as needed */
  object-fit: cover; /* cover keeps image centered and cropped without distortion */
  object-position: center;
  display: block;
  cursor: pointer;
}

.card-body {
  flex: 0 0 auto;
}

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

/* Lightbox styles */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.lightbox-content {
  position: relative;
  max-width: 95%;
  max-height: 95%;
  padding: 12px;
}

/* Show the image at its original size when possible; scale down only when it exceeds the viewport. */
.lightbox-img {
  width: auto;            /* let the image keep its intrinsic width */
  height: auto;           /* let the image keep its intrinsic height */
  max-width: calc(100vw - 48px);  /* leave a comfortable gap around image */
  max-height: calc(100vh - 48px);
  display: block;
  border-radius: 6px;
  box-shadow: 0 6px 30px rgba(0,0,0,0.4);
  cursor: zoom-out; /* indicate clicking will close/zoom out */
}

/* Mobile adjustments: slightly larger padding & fit to viewport */
@media (max-width: 576px) {
  .lightbox-content {
    padding: 8px;
  }
  .lightbox-img {
    max-width: calc(100vw - 24px);
    max-height: calc(100vh - 24px);
  }
}

.lightbox-close {
  position: absolute;
  top: -8px;
  right: -8px;
  background: white;
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
</style>