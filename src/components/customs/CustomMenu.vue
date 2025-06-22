<template>
  <div class="card flex justify-center">
    <PriDrawer v-model:visible="visible">
      <template #header>
        <div class="flex items-center gap-2">
          <PriAvatar
            icon="pi pi-user"
            class="mr-2"
            size="large"
            style="background-color: #ece9fc; color: #2a1261"
            shape="circle"
          />
          <span class="font-bold mt-2">Hello!</span>
        </div>
      </template>
        <hr />
      <div class="menu">
        <router-link to="/product" @click="visible = false">
          <p>Products</p>
        </router-link>
      </div>
      <template #footer>
        <div class="w-min">
          <CustomButton
            label="Logout"
            :signOutIcon="true"
            class="flex-auto"
            :danger="true"
            :outlined="true"
            @click="visible = false"
          />
        </div>
      </template>
    </PriDrawer>
  </div>
</template>

<script setup>
import { ref } from "vue";

const visible = ref(false);
const openMenu = () => {
  visible.value = true;
};
const closeMenu = () => {
  visible.value = false;
};
defineExpose({ closeMenu, openMenu });
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
}
.menu p {
  color: var(--vt-c-black);
  padding: 0.5rem;
  margin-top: 0.5rem;
  list-style: none;
  transition: all 0.3s ease;
  border-radius: 5px;
}
.menu p:hover {
  background: #6362621a;
  color: var(--p2-color);
}
</style>
