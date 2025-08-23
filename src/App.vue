<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { RouterLink, RouterView, useRouter } from "vue-router";
const route = useRouter();
const isLoading = ref(false);
const isSkeleton = ref(true);
const dialogMessage = ref();
const refToFunMenu = ref();

const msg = ref("Something error.");
onMounted(() => {
  try {
    axios.interceptors.request.use((config) => {
      const hasKeyShowLoading = Object.keys(config).includes("showLoading");
      if (hasKeyShowLoading) {
        isLoading.value = config.showLoading;
      } else {
        isLoading.value = true;
      }
      return config;
    });
    axios.interceptors.response.use(
      (response) => {
        isLoading.value = false;
        isSkeleton.value = false;
        return response;
      },
      (error) => {
        if (error.response?.status >= 400 && error.response?.status <= 500) {
          const { message } = error.response.data;
          if (typeof message === "string") {
            msg.value = message;
          }
          openDialogMessage();
          setTimeout(() => {
            closeDialogMessage();
          }, 10000); // Delay of 10000 milliseconds (10 seconds) before clearing progress
        }
        isLoading.value = false;
        return Promise.reject(error);
      }
    );
  } catch (error) {
    console.error("Error", error);
    isLoading.value = false;
  }
});
const openDialogMessage = () => {
  dialogMessage.value.openDialog();
};
const closeDialogMessage = () => {
  dialogMessage.value.closeDialog();
};
// Functions
const openMenu = () => {
  refToFunMenu.value.openMenu();
};
</script>

<template>
  <div>
    <div v-show="true" class="sticky top-0 z-1 text-white">
      <div class="container-menu">
        <PriButton
          class="bg-transparent icon-bars"
          icon="pi pi-bars"
          @click="openMenu"
          v-if="$route.path !=='/' && $route.path !=='/signup'"
        />
        <div class="register absolute right-0 top-0 p-2"
          v-else
        >
          <PriButton
            type="button"
            label="ការចុះឈ្មោះ"
            class="p-0 px-2"
            @click="route.push('/signup')"
          />
        </div>
      </div>
    </div>
    <CustomMenu ref="refToFunMenu" />
    <CustomDialog
      ref="dialogMessage"
      :modalHeader="'Error message'"
      @onClickDialogSubmit="openDialogMessage"
      @onClickCloseDialog="closeDialogMessage"
      :secondary="true"
      :hideBtnSubmit="true"
    >
      <template #bodyDialog>
        <p class="text-center pt-3 text-red-500">
          {{ msg }}
          <i class="pi pi-exclamation-triangle text-red-500 font-bold"></i>
        </p>
      </template>
    </CustomDialog>
    <div class="flex justify-content-center flex-wrap gap-3"></div>
    <RouterView />
  </div>
</template>

<style scoped>
h3 {
  color: #fff;
}
.container-menu {
  /* background: #000; */
  /* display: flex;
  justify-content: space-between;
  padding: 0.3rem; */
}
.menu {
  display: flex;
}
.menu p {
  color: #fff;
  /* border: 1px solid var(--p2-color); */
  border-radius: 0.2rem;
  padding: 0.3rem;
  width: 100px;
  text-align: center;
  transition: all 0.3s ease-in-out;
}
.menu p:hover {
  background: #ffffff;
  color: var(--p2-color);
}
/* --- Smartphones (landscape) and Small Tablets (portrait) --- */
/* (e.g., min-width of 576px) */

@media (min-width: 360px) and (max-width: 768px) {
  .menu {
    display: none;
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
  .icon-bars {
    /* display: none; */
  }
}
</style>
