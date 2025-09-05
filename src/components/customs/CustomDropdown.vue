<script setup>
import Dropdown from "primevue/dropdown";
import { ref, getCurrentInstance, watch } from "vue";
const props = defineProps({
  msg: String,
  placeholder: String,
  options: Array,
  required: Boolean,
  messageError: String,
  label: String,
  modelValue: [String, Object, Number],
  showClear: {
    type: Boolean,
    default: () => false,
  },
  disabled: {
    type: Boolean,
    default: () => false,
  }
});

const selectedValue = ref();
const filterValue = ref();
const instance = getCurrentInstance();
defineEmits(["update:modelValue", "addNewDropdown"]);

const handleFilterChange = (event) => {
  filterValue.value = event.value;
};
const updateModelValue = (value) => {
  selectedValue.value = value;
  instance.emit("update:modelValue", value);
};

watch(
  [() => props.modelValue],
  ([newPropModelValue]) => {
    if (newPropModelValue) {
      selectedValue.value = newPropModelValue;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="mb-1 p-fluid">
    <section class="flex flex-column">
      <div>
        <label v-if="label !== ''">{{ label }} </label>
        <span v-if="required" class="text-red-500"> *</span>
      </div>
      <Dropdown
        v-model="selectedValue"
        :options="options"
        filter
        :showClear="showClear"
        @filter="handleFilterChange"
        :placeholder="placeholder"
        :filterPlaceholder="'ស្វែងរក'"
        optionLabel="Value"
        :invalid="required && !selectedValue && messageError ? true : false"
        @update:modelValue="updateModelValue"
        :resetFilterOnHide="true"
        :disabled="disabled"
      >
        <template #content> </template>
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex align-items-center">
            <div>{{ slotProps.value.Value }}</div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #option="slotProps">
          <div class="flex align-items-center">
            <div>{{ slotProps.option.Value }}</div>
          </div>
        </template>

        <template #emptyfilter>
          <small v-show="filterValue" class="flex justify-content-between">
            <span
              > ឈ្មោះសេវាកម្ម <span class="fw-bolder text-primary">{{ filterValue }}</span> គ្មានទេ!</span
            >
            <!-- <span
              class="text-white customEmpty"
              @click="$emit('addNewDropdown', filterValue)"
              >Add New</span
            > -->
          </small>
        </template>
        <template #empty>
          <small class="flex justify-content-between">
            <span>មិនមានទិន្នន័យដែលត្រូវជ្រើសរើសទេ។</span>
            <!-- <span
              class="text-white customEmpty"
              @click="$emit('addNewDropdown', filterValue)"
              >Add New</span
            > -->
          </small>
        </template>
      </Dropdown>
      <small
        v-if="messageError !== '' && !selectedValue"
        class="flex text-red-500"
        style="margin: 4px 0px 0px 0px"
      >
        <i
          :class="messageError ? 'pi pi-times-circle' : ''"
          style="margin: 1px 4px 0px 0px"
        />
        {{ messageError }}
      </small>
    </section>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
.customEmpty {
  padding: 3px;
  border-radius: 4px;
  /* background: #007bff; */
  background: var(--primary-color);
  cursor: pointer;
}
.customEmpty:hover {
  /* background: #006adc; */
  background: var(--primary-color-hover);
}
</style>
