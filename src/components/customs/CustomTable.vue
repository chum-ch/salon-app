<script setup>
import { onMounted, ref, getCurrentInstance, watch } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { FilterMatchMode } from "@primevue/core/api";
const instance = getCurrentInstance();

const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
  selectionMode: {
    type: String,
    default: () => "multiple",
  },
  isHideAddBtn: {
    type: Boolean,
    required: false,
  },
  isHideVoice: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  isShowAction: {
    type: Boolean,
    required: false,
    default: () => true,
  },
  isShowPaginator: {
    type: Boolean,
    required: false,
    default: () => true,
  },
  isShowHeaderAction: {
    type: Boolean,
    required: false,
    default: () => true,
  },

  isHideEditBtn: {
    type: Boolean,
    required: false,
  },
  isHideDeleteBtn: {
    type: Boolean,
    required: false,
  },
  isShowFileMenu: {
    type: Boolean,
    required: false,
  },
  tableStyle: {
    type: String,
    default: () => "min-width: 50rem",
  },
  showGridlines: {
    type: Boolean,
    default: () => false,
  },
  hasImage: {
    type: Boolean,
    default: () => true,
  },
  ColumnWidth: {
    type: String,
    default: () => "",
  },
});
defineEmits([
  "onClickCreate",
  "onClickEdit",
  "onClickDelete",
  "update:selection",
  "onClickDetails",
  "downloadAllDataInTable",
  "downloadTemplateExcel",
  "uploadedExcelFile",
]);
onMounted(() => {
  // initFilters()
});
// Variables
const selection = ref([]);
const globalFilterFields = ref([]);
const filters = ref();
const toChildCustomVoiceSearch = ref();

// Button
const disabledDelete = ref(true);
const disabledEdit = ref(true);
const isGo = ref(true);
const menuItems = ref([
  {
    label: "File",
    icon: "pi pi-file",
    items: [
      {
        label: "Download",
        disabled: true,
        icon: "pi pi-download",
        command: async () => {
          instance.emit("downloadAllDataInTable");
        },
      },
      {
        label: "Get template",
        icon: "pi pi-cloud-download",
        command: async () => {
          instance.emit("downloadTemplateExcel");
        },
      },
      {
        label: "Upload",
        icon: "pi pi-cloud-upload",
        command: async () => {
          instance.emit("uploadedExcelFile");
        },
      },
    ],
  },
]);
// Function
const onRowClick = (data) => {
  if (isGo.value) {
    instance.emit("onClickDetails", [data.data]);
  } else {
    isGo.value = true;
  }
};
const selectedRow = () => {
  emitSelectedRowData("selectRow");
};
const unSelectedRow = () => {
  isGo.value = false;
  emitSelectedRowData("unSelectRow");
};
const unSelectedAllRows = () => {
  disabledEdit.value = true;
  disabledDelete.value = true;
  selection.value = [];
  emitSelectedRowData("unSelectAllRow");
};
const selectedAllRows = (event) => {
  selection.value = event.data;
  emitSelectedRowData("selectAllRow");
};
const emitSelectedRowData = (checked) => {
  if (
    checked === "selectRow" ||
    checked === "unSelectRow" ||
    checked === "selectAllRow"
  ) {
    instance.emit("update:selection", selection.value);
    disabledAction(selection.value);
  } else {
    instance.emit("update:selection", []);
  }
};
const disabledAction = (data) => {
  if (data.length === 0) {
    disabledDelete.value = true;
    disabledEdit.value = true;
  } else {
    disabledDelete.value = false;
    if (data.length > 1) {
      disabledEdit.value = true;
    } else {
      disabledEdit.value = false;
    }
  }
};
const initFilters = () => {
  globalFilterFields.value = props.columns.map((item) => item.field);
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
};
const getTextFromVoice = (text) => {
  filters.value = {
    global: { value: text, matchMode: FilterMatchMode.CONTAINS },
  };
};
const openDialogVoice = () => {
  toChildCustomVoiceSearch.value.openDialogVoice();
};
// Watcher function
watch(
  () => props.tableData,
  (data) => {
    for (const obj of menuItems.value) {
      obj.items.forEach((item) => {
        const hasPropertyDisabled = Object.prototype.hasOwnProperty.call(
          item,
          "disabled"
        );
        if (hasPropertyDisabled) {
          item.disabled = true;
          if (data.length > 0) {
            item.disabled = false;
          }
        }
        return item;
      });
    }
  }
);
initFilters();
defineExpose({
  unSelectedAllRows,
});
</script>

<template>
  <div class="table mt-2">
    <div
      class="flex justify-content-between sm:flex-row-reverse flex-wrap"
      v-if="isShowHeaderAction"
    >
      <div class="flex">
        <PriInputText
          v-model="filters['global'].value"
          placeholder="ស្វែងរក..."
          class="search"
        />
        <!-- <div class="flex flex-wrap justify-content-center m-2" v-if="isHideVoice">
          <div
            @click="openDialogVoice"
            class="border-circle w-2rem h-2rem bg-primary cursor-pointer text-white font-bold flex align-items-center justify-content-center"
          >
            <i class="pi pi-microphone" />
            <CustomVoiceSearch
              ref="toChildCustomVoiceSearch"
              @update:voiceInput="getTextFromVoice"
              :listening="'Listening'"
            />
          </div>
        </div> -->
      </div>
      <div class="flex flex-wrap" v-if="isShowAction">
        <CustomButton
          :label="'Add'"
          class="mr-2 mb-2"
          @onClick="($event) => $emit('onClickCreate', $event)"
          v-if="!isHideAddBtn"
        />
        <CustomButton
          :label="'Edit'"
          class="mr-2"
          @onClick="() => $emit('onClickEdit', selection)"
          :outlined="true"
          :disabled="disabledEdit"
          v-if="!isHideEditBtn"
        />
        <CustomButton
          :label="'Delete'"
          class="mr-2"
          @onClick="() => $emit('onClickDelete', selection)"
          :danger="true"
          :outlined="true"
          :disabled="disabledDelete"
          v-if="!isHideDeleteBtn"
        />
        <!-- <CustomTieredMenu :menuItems="menuItems" v-if="isShowFileMenu" /> -->
      </div>
    </div>
    <DataTable
      v-model:filters="filters"
      v-model:selection="selection"
      @row-click="onRowClick($event)"
      @row-select="selectedRow"
      @row-unselect="unSelectedRow"
      @row-select-all="selectedAllRows"
      @row-unselect-all="unSelectedAllRows"
      :rowHover="true"
      :rows="20"
      :rowsPerPageOptions="[20, 50, 100]"
      :globalFilterFields="globalFilterFields"
      :value="tableData"
      columnResizeMode="fit"
      :showGridlines="showGridlines"
      resizableColumns
      scrollable
      scrollHeight="545px"
      class="p-datatable-sm mt-2 z-0"
      :tableStyle="tableStyle"
      :paginator="isShowPaginator"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="Show from {first} to {last} of {totalRecords}"
    >
      <template #empty>
        <div v-if="tableData.length !== 0 || tableData.length === 0" class="">
          <span class="text-red-500 font-bold">
            {{ filters["global"].value }}</span
          > មិនទាន់មានទិន្នន័យ!
        </div>
      </template>
      <Column
        :selectionMode="selectionMode"
        :headerStyle="selectionMode === '' ? 'width: 0rem' : 'width: 3rem'"
      >
      </Column>
      <Column
        v-for="(item, index) in columns"
        :key="index"
        :field="item.field"
        :header="item.header"
        :style="`width:${ColumnWidth};`"
      >
      </Column>
    </DataTable>
  </div>
</template>
<style>
.p-paginator.p-component {
  padding: 0;
  border-radius: 0;
}

.p-paginator-content span.p-select-label {
  padding: 0 .5rem;
}
@media (max-width: 600px) {
  button.p-paginator-first,
  button.p-paginator-last {
    display: none;
  }
  .flex {
    display: block;
  }
  .search {
    width: 100%;
  }
  div.p-datatable-table-container {
    height: 450px;
  }
  div.p-select.p-component.p-inputwrapper.p-inputwrapper-filled.p-paginator-rpp-dropdown {
    display: none;
  }
}
</style>
