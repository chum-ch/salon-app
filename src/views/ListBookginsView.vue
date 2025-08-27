<script setup>
import { inject, onMounted, ref } from 'vue';

const $api = inject('$api')
const $constanceVariable = inject('$constanceVariable')
const $helperFun = inject('$helperFun')
const userInfo = $helperFun.getSessionItem(
  $constanceVariable.SessionStorageKey.UserInfo
);
const selectedBookings = ref([]);
const tableDataBookings = ref([]);
const columnsUser = ref([
  {
    field: "GuestName",
    header: "ឈ្មោះ",
  },
  {
    field: "Phone",
    header: "លេខទូរស័ព្ទ",
  },
  {
    field: "Service.Name",
    header: "ឈ្មោះសេវាកម្ម",
  },
  {
    field: "StartDateTime",
    header: "ពេលចាប់ផ្ដើម",
  },
  {
    field: "EndDateTime",
    header: "ពេលបញ្ចប់",
  },
  {
    field: "Status",
    header: "ស្ថានភាព",
  },
]);

const selectedRowData = (data) => {
  selectedBookings.value = data;
};
onMounted( async() => {
  try {
    if (userInfo) {
      const bookings = await $api.salon.listBookings(
        userInfo.TenantId,
        userInfo.EntityItemId
      );
      tableDataBookings.value = bookings.data.map((item) => ({
        ...item,
        StartDateTime: $helperFun.convertISODateToLocalTime(
          item.StartDateTime
        ),
        EndDateTime: $helperFun.convertISODateToLocalTime(
          item.EndDateTime
        ),
      }));
    }
  } catch (error) {
    console.error('Error list bookings', error)
  }
})
</script>

<template>
  <div class="list-bookings">
    <CustomTable
      ref="refToChildCustomTable"
      :tableData="tableDataBookings"
      :columns="columnsUser"
      @update:selection="selectedRowData"
      :isShowAction="false"
    />
      <!-- @onClickCreate="onClickCreateGeneration"
      :ColumnWidth="'25%'"
      @onClickEdit="onClickEditGeneration"
      @onClickDelete="openDialogDeleteGeneration"
      @onClickDetails="onClickDetailsGeneration" -->
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
