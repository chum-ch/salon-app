<template>
  <div class="card flex justify-center">
    <PriDrawer v-model:visible="visible" :showCloseIcon="true"
    >
      <template #header>
        <div class="w-full text-center flex justify-content-between items-center gap-2 bg-500">
          <!-- <PriAvatar
            icon="pi pi-user"
            class="mr-2"
            size="large"
            style="background-color: #ece9fc; color: #2a1261"
            shape="circle"
          /> -->
          <!-- <img src="../../../public/imgs/salon.png" alt="logo" width="50" /> -->
          <span class="font-bold mt-2 text-center">{{ userInfo?.FullName ? userInfo.FullName : 'អ៊ែលលី~Ellie Salon' }}</span>
        </div>
      </template>
      <hr
        class="mb-4 border-t border-0 border-surface-200"
      />
      <div class="menu">
        <router-link to="/product" @click="visible = false">
          <p>Products
          </p>
        </router-link>
        <router-link to="/product" @click="visible = false">
          <p>Products
          </p>
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
            @click="userLogout"
          />
        </div>
      </template>
    </PriDrawer>
  </div>
</template>

<script setup>
import { ref, inject, onUpdated } from "vue";
import { useRouter } from "vue-router";

onUpdated(() => {
  // console.log('onBeforeUpdate: The component is about to re-render.');
  userInfo.value = $helperFun.getSessionItem($constanceVariable.SessionStorageKey.UserInfo);
});

const visible = ref(false);
const openMenu = () => {
  visible.value = true;
};
const closeMenu = () => {
  visible.value = false;
};
defineExpose({ closeMenu, openMenu });
const userLogout = () => {
  $helperFun.clearSession();
  visible.value = false;
  route.push("/");
};
// Variables
const $constanceVariable = inject("$constanceVariable");
const $helperFun = inject("$helperFun");
const route = useRouter();
const userInfo = ref({});
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
}
 .menu p {
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
