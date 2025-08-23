<script setup>
import { ref } from "vue";
import Dialog from "primevue/dialog";
defineProps({
  msg: String,
  disabledSubmitBtn: Boolean,
  showDialog: Boolean,
  modalHeader: String,
  dialogWidth: String,
  positionDialog: String,
  hideFooter: Boolean,
  footerLabel: String,
  danger: Boolean,
  isDelete: Boolean,
  hideBtnSubmit: Boolean,
  secondary: Boolean,
});

// Functions
const openDialog = () => {
  displayModal.value = true;
};
const closeDialog = () => {
  displayModal.value = false;
};
defineEmits(["onClickDialogSubmit", "onClickCloseDialog", "update:visible"]);
defineExpose({ openDialog, closeDialog });
// Variables
const displayModal = ref(false);
const position = ref("top");
</script>

<template>
  <div class="">
    <Dialog
      :header="modalHeader ? modalHeader : 'Modal'"
      v-model:visible="displayModal"
      :positionDialog="position"
      :style="{ width: dialogWidth ? dialogWidth : '45vw' }"
      :modal="true"
      :breakpoints="{ '960px': '75vw', '641px': '92vw' }"
      @update:visible="$emit('update:visible', displayModal)"
    >
      <div class="text-center" v-if="isDelete">
        <span class="mr-1 font-bold">Delete</span>
        <i
          class="pi pi-exclamation-triangle text-center text-red-500 font-bold"
        ></i>
      </div>
      <slot name="bodyDialog"> </slot>

      <template #footer v-if="hideFooter ? !hideFooter : true">
        <div class="flex justify-content-end flex-wrap">
          <CustomButton
            @onClick="$emit('onClickCloseDialog')"
            :label="'Cancel'"
            class="mr-2"
            :outlined="true"
            :secondary="secondary"
          />
          <CustomButton
            :hide="hideBtnSubmit"
            :label="footerLabel ? footerLabel : 'Submit'"
            :disabled="disabledSubmitBtn"
            :danger="danger"
            @onClick="($event) => $emit('onClickDialogSubmit', $event)"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .p-dialog .p-dialog-header-icon {
  display: none;
  align-items: center;
} */
</style>
