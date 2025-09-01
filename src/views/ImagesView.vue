<template>
  <div class="service-filter flex sticky top-0 z-1 ml-7">
    <div class="flex justify-content-center align-items-center">
      <label for="">ច្រោះតាម:</label>
      <CustomDropdown
        :options="serviceOptions"
        :placeholder="'សេវាកម្ម'"
        class="mx-3 p-0"
        style="width: 150px"
        v-model="serviceSelection"
        @update:modelValue="getSelectOptionChange"
        :showClear="true"
      />
      <PriButton
        class="icon-bars color-primary mx-2"
        icon="pi pi-cloud-upload"
        @click="openDialogUploadImg"
        :disabled="isAllowUploadImg"
        :style="isAllowUploadImg ? objectStyleCSS : ''"
      />
    </div>
  </div>
  <div v-if="loading" class="photo-grid-status">Loading images...</div>
  <div v-else-if="error" class="photo-grid-status photo-grid-error">
    {{ error }}
  </div>
  <div v-else class="photo-grid">
    <img
      v-for="(image, index) in images"
      :key="index"
      :src="image.Url"
      :alt="image.OriginalName"
      :class="{ 'photo-grid-large': image.isLarge }"
      @click="openModal(image)"
    />
  </div>

  <div v-if="showModal" class="image-modal-overlay" @click="closeModal">
    <div class="image-modal-content">
      <div class="close-button" @click.stop="closeModal">
        <span>&times;</span>
      </div>
      <img
        :src="currentImage.Url"
        :alt="currentImage.alt"
        class="modal-image"
        :style="{
          transform: `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`,
        }"
        @click.stop
        @wheel.prevent="handleZoom"
        @mousedown.prevent="startPan"
        @mousemove="panImage"
        @mouseup="stopPan"
        @mouseleave="stopPan"
      />
    </div>
  </div>

  <CustomDialog
      ref="dialogUploadImg"
      :modalHeader="'Upload image'"
      @onClickDialogSubmit="openDialogUploadImg"
      @onClickCloseDialog="closeDialogUploadImg"
      :secondary="true"
      :hideBtnSubmit="true"
    >
      <template #bodyDialog>
        <CustomUploadImage
          @update:modelValue="closeDialogUploadImg"
        />
      </template>
    </CustomDialog>
</template>

<script setup>
import { onMounted, ref, inject } from "vue";
const $api = inject("$api");
const $constanceVariable = inject("$constanceVariable");
const $helperFun = inject("$helperFun");

const userInfo = $helperFun.getSessionItem(
  $constanceVariable.SessionStorageKey.UserInfo
);

const dialogUploadImg = ref();
const images = ref([]);
const loading = ref(true);
const error = ref(null);

let allServiceItems = $helperFun.getSessionItem(
  $constanceVariable.SessionStorageKey.AllServicesItems
);
if (allServiceItems) {
  allServiceItems = allServiceItems.map((item) => ({
    Value: item.Name,
    ID: item.EntityItemId,
    Duration: item.Duration,
  }));
}
const serviceOptions = ref(allServiceItems);
const serviceSelection = ref();
const isAllowUploadImg = ref(false);
const objectStyleCSS = ref({
  cursor: "not-allowed",
});
const getSelectOptionChange = async () => {
  isAllowUploadImg.value = true;
  images.value = await listImagesByservice();
  if (serviceSelection.value?.ID) {
    images.value = images.value.filter((item) => item.ServiceId === serviceSelection.value.ID);
  } else if (!serviceSelection.value) {
    isAllowUploadImg.value = false;
  }
};

// Modal state
const showModal = ref(false);
const currentImage = ref(null);
const zoomLevel = ref(1);

// Panning state
const isPanning = ref(false);
const startX = ref(0);
const startY = ref(0);
const panX = ref(0);
const panY = ref(0);

// Open the modal with the selected image
const openModal = (image) => {
  currentImage.value = image;
  showModal.value = true;
  zoomLevel.value = 1; // Reset zoom
  panX.value = 0; // Reset pan
  panY.value = 0;
};

// Close the modal
const closeModal = () => {
  showModal.value = false;
  currentImage.value = null;
};

// Handle zoom with mouse wheel
const handleZoom = (event) => {
  if (event.deltaY < 0) {
    zoomLevel.value = Math.min(zoomLevel.value + 0.1, 3);
  } else {
    zoomLevel.value = Math.max(zoomLevel.value - 0.1, 1);
  }
};

// Start panning on mouse down
const startPan = (event) => {
  if (zoomLevel.value > 1) {
    isPanning.value = true;
    startX.value = event.clientX - panX.value;
    startY.value = event.clientY - panY.value;
  }
};

// Pan image on mouse move
const panImage = (event) => {
  if (!isPanning.value) return;
  panX.value = event.clientX - startX.value;
  panY.value = event.clientY - startY.value;
};

// Stop panning on mouse up or leave
const stopPan = () => {
  isPanning.value = false;
};

const listImagesByservice = async () => {
  try {
    const servicesImg = await $api.salon.listImages(
      userInfo.TenantId,
      userInfo.EntityItemId
    );
    images.value = servicesImg.data.map((img, index) => ({
      ...img,
      isLarge: Math.random() > 0.8,
    }));
    return servicesImg.data;
  } catch (err) {
    error.value = "Failed to load images. Please try again later.";
    console.error("Error listing service images:", err);
  } finally {
    loading.value = false;
  }
};

const openDialogUploadImg = async () => {
  dialogUploadImg.value.openDialog();
  await listImagesByservice();
};
const closeDialogUploadImg = ($event) => {
  if ($event?.length > 0) {
    images.value = $event;
  }
  setTimeout(() => {
    dialogUploadImg.value.closeDialog();
  }, 700);
};
onMounted(async () => {
  await listImagesByservice();
});
</script>

<style scoped>
/* Previous CSS styles for photo-grid, modal-overlay, etc. go here */
.photo-grid {
  margin: 2rem auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  grid-auto-rows: 150px;
  gap: 1.5rem;
}

.photo-grid img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
  border-radius: 10px;
}

.photo-grid img:hover {
  transform: scale(1.03);
}

.photo-grid-large {
  grid-column: span 2;
  grid-row: span 2;
}

.photo-grid-status {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
  color: #555;
}

.photo-grid-error {
  color: #d9534f;
}

/* Modal styles */
.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: zoom-out;
}

.image-modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  overflow: hidden; /* This is crucial for preventing overflow during pan */
}

.modal-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transform-origin: 0 0; /* Ensures transform scales from the top-left corner */
  transition: transform 0.2s ease-in-out;
  cursor: grab;
}

.modal-image:active {
  cursor: grabbing;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 30px;
  color: var(--vt-c-white);
  width: 45px;
  height: 45px;
  background: var(--p2-color);
  font-size: 40px;
  cursor: pointer;
  z-index: 1001;
  border-radius: 50%;
  transition: all 0.3s ease-in-out;
}
.close-button:hover {
  background: #059460;
}
.close-button span {
  position: absolute;
  top: 50%;
  left: 50%;
  font-weight: bold;
  transform: translate(-50%, -55%);
}
</style>
