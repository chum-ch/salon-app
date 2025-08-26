<script setup>
import { inject, onMounted, ref } from 'vue';

const $api = inject('$api')
const $constanceVariable = inject('$constanceVariable')
const $helperFun = inject('$helperFun')
const userInfo = $helperFun.getSessionItem(
  $constanceVariable.SessionStorageKey.UserInfo
);
const selectedUsers = ref([]);
const tableDataUsers = ref([]);
const columnsUser = ref([
  {
    field: "FullName",
    header: "ឈ្មោះ",
  },
  {
    field: "Phone",
    header: "លេខទូរស័ព្ទ",
  },
]);

const selectedRowData = (data) => {
  selectedUsers.value = data;
};
onMounted( async() => {
  try {
    if (userInfo) {
      const users = await $api.user.listUsers(
        userInfo.TenantId,
        userInfo.EntityItemId
      );
      tableDataUsers.value = users.data;
    }
  } catch (error) {
    console.error('Error list users', error)
  }
})
</script>

<template>
  <div class="list-users">
    <CustomTable
      ref="refToChildCustomTable"
      :tableData="tableDataUsers"
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
