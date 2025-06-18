<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header class="p-3">
      <h1 class="font-bold text-green-600">G5</h1>

    <div class="wrapper text-center">
      <section class="logo">
        <img src="./assets/p2.jpeg" alt="logo">
      </section>
      <!-- <PriButton >Login</PriButton> -->
      <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav> -->
    </div>
  </header>

  <RouterView />
</template>

<style>
header {
  line-height: 1.5;
  max-height: 100vh;
  /* border-radius: 1rem; */
  /* border: 2px solid var(--color-background-soft); */
}

.logo img {
  width: 100%;
}
/* --- Smartphones (landscape) and Small Tablets (portrait) --- */
/* (e.g., min-width of 576px) */

@media (min-width: 360px) and (max-width: 768px) {
  .logo img {
    width: 70%;
  }
  
}

/* --- Tablets (landscape) and Laptops --- */
/* (e.g., min-width of 768px) */
@media (min-width: 768px) and (max-width: 992px) {
  
}

/* --- Laptops and Desktops --- */
/* (e.g., min-width of 992px) */
@media (min-width: 992px) and (max-width: 1200px) {
  
  
}

/* --- Large Desktops --- */
/* (e.g., min-width of 1200px) */
@media (min-width: 1200px) {
  
  
}

</style>
