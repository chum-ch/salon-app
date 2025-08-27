
<template>
    <div class="card">
        <DataTable :value="products">
            <Column field="code" header="">
                <template #body>
                    <PriSkeleton></PriSkeleton>
                </template>
            </Column>
            <Column field="name" header="">
                <template #body>
                    <PriSkeleton></PriSkeleton>
                </template>
            </Column>
            <Column field="category" header="">
                <template #body>
                    <PriSkeleton></PriSkeleton>
                </template>
            </Column>
            <Column field="quantity" header="">
                <template #body>
                    <PriSkeleton></PriSkeleton>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import DataTable from "primevue/datatable";
import Column from "primevue/column";
const products = ref(new Array(1));
</script>
