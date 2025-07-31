<template>
  <div class="login-form p-3">
    <div class="logo text-center">
      <img src="/imgs/salon.png" alt="logo" />
    </div>

    <div class="w-full mb-2 mt-4 flex">
      <div
        v-for="category in categories"
        :key="category.key"
        class="mxl-0 mr-5"
      >
        <PriRadioButton
          v-model="selectedCategory"
          :inputId="category.key"
          name="dynamic"
          :value="category.name"
          class="mr-1"
        />
        <label :for="category.key">{{ category.kh }}</label>
      </div>
    </div>
    <GuestSignInForm v-if="selectedCategory === 'Guest'" />
    <ShopOwnerSignInForm v-else />
  </div>
</template>

<script setup>
import { ref } from "vue";
import ShopOwnerSignInForm from "./ShopOwnerSignInForm.vue";
import GuestSignInForm from "./GuestSignInForm.vue";
const selectedCategory = ref("Guest");
const categories = ref([
  { name: "Guest", key: "G", kh: "ភ្ញៀវ" },
  { name: "ShopOwner", key: "S", kh: "ម្ចាស់ហាង" },
]);
</script>
<style scoped>
.login-form {
  margin: auto;
  width: 25%;
  box-shadow: #63636333 0px 2px 8px 0px;
  border-radius: 0.5rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
img {
  width: 70%;
  border-radius: 50%;
}
/* --- Smartphones (landscape) and Small Tablets (portrait) --- */
/* (e.g., min-width of 576px) */
@media (min-width: 360px) and (max-width: 768px) {
  .login-form {
    width: 90%;
  }
}
</style>
