<script setup>
import { ref } from "vue";
defineProps({
  badge: {
    type: String,
  },
  style: {
    type: Object,
  },
  normal: {
    type: Boolean,
  },
  large: {
    type: Boolean,
  },
  hide: {
    type: Boolean,
  },
  label: {
    type: String,
  },
  barsIcon: {
    type: Boolean,
  },
  timesIcon: {
    type: Boolean,
  },
  checkIcon: {
    type: Boolean,
  },
  userIcon: {
    type: Boolean,
  },
  searchIcon: {
    type: Boolean,
  },
  spinnerIcon: {
    type: Boolean,
  },
  rightIcon: {
    type: Boolean,
  },
  emailIcon: {
    type: Boolean,
  },
  deleteIcon: {
    type: Boolean,
  },
  cancelIcon: {
    type: Boolean,
  },
  plusIcon: {
    type: Boolean,
  },
  imageIcon: {
    type: Boolean,
  },
  cloudIcon: {
    type: Boolean,
  },
  isLink: {
    type: Boolean,
  },
  disabled: {
    type: Boolean,
  },
  secondary: {
    type: Boolean,
  },
  success: {
    type: Boolean,
  },
  loading: {
    type: Boolean,
  },
  info: {
    type: Boolean,
  },
  warning: {
    type: Boolean,
  },
  help: {
    type: Boolean,
  },
  danger: {
    type: Boolean,
  },
  raised: {
    type: Boolean,
  },
  rounded: {
    type: Boolean,
  },
  text: {
    type: Boolean,
  },
  outlined: {
    type: Boolean,
  },
  type: {
    type: String,
  },
});
defineEmits(["onClick"]);

// Variable
const objectStyleCSS = ref({
  cursor: "not-allowed",
});
</script>

<template>
  <div class="p-fluid text-white">
    <PriButton
      @click="($event) => $emit('onClick', $event)"
      :style="disabled ? objectStyleCSS : style"
      :badge="badge"
      :type="type ? type : 'button'"
      v-show="hide ? false : true"
      :raised="raised"
      :label="label"
      :rounded="rounded"
      :loading="loading"
      :link="isLink"
      :iconPos="rightIcon ? 'right' : ''"
      :disabled="disabled"
      :text="text"
      :fluid="true"
      :outlined="outlined"
      :size="normal ? 'normal' : large ? 'large' : 'small'"
      :severity="
        secondary
          ? 'secondary'
          : success
          ? 'success'
          : info
          ? 'info'
          : warning
          ? 'warning'
          : help
          ? 'help'
          : danger
          ? 'danger'
          : ''
      "
      :icon="
        checkIcon
          ? 'pi pi-check'
          : userIcon
          ? 'pi pi-user'
          : searchIcon
          ? 'pi pi-search'
          : spinnerIcon
          ? 'pi pi-spin pi-spinner'
          : emailIcon
          ? 'pi pi-envelope'
          : deleteIcon
          ? 'pi pi-trash'
          : cancelIcon
          ? 'pi pi-times'
          : plusIcon
          ? 'pi pi-plus'
          : imageIcon
          ? 'pi pi-images'
          : cloudIcon
          ? 'pi pi-cloud-upload'
          : timesIcon
          ? 'pi pi-times'
          : barsIcon
          ? 'pi pi-bars'
          : ''
      "
    />
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.p-button {
  margin: 0;
}
</style>
