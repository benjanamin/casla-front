<script setup>
import FeaturedProducts from '../components/store/FeaturedProducts.vue'
</script>

<template>
  <div>
    <div id="homeCarouselControls" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="https://picsum.photos/200" class="d-block w-100" alt="...">
        </div>
        <div class="carousel-item">
          <img src="https://picsum.photos/200" class="d-block" alt="...">
        </div>
        <div class="carousel-item">
          <img src="https://picsum.photos/200" class="d-block" alt="...">
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#homeCarouselControls"
        data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#homeCarouselControls"
        data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
    <div class="container-fluid mt-4 mb-5">
      <div class="row row-cols-12 mb-4">
        <div class="col text-center">
          <h2><b>PRODUCTOS DESTACADOS</b></h2>
        </div>
      </div>
      <FeaturedProducts />
    </div>

  </div>
</template>
<style scoped>
#homeCarouselControls {
  width: 100%;
  height: 450px; /* fixed height; change as needed */
}

#homeCarouselControls .carousel-inner,
#homeCarouselControls .carousel-item {
  height: 100%;
}

#homeCarouselControls .carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* fill the box without distortion */
}

.carousel-control-next-icon {
  background-color: #c0c0c05d;
}

.carousel-control-prev-icon {

  background-color: #c0c0c05d;
}
</style>
