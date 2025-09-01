<script setup>
import { ref } from "vue";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from 'primevue/tab';
// import TabPanels from 'primevue/tabpanels';
// import TabPanel from 'primevue/tabpanel';
const items = ref([]);
</script>

<template>
  <div class="card">
    <Tabs value="/home">
      <TabList>
        <Tab v-for="tab in items" :key="tab.label" :value="tab.route">
          <router-link
            v-if="tab.route"
            v-slot="{ href, navigate }"
            :to="tab.route"
            custom
          >
            <a
              :href="href"
              @click="navigate"
              class="flex items-center gap-2 text-inherit"
            >
              <i :class="tab.icon" />
              <span>{{ tab.label }}</span>
            </a>
          </router-link>
        </Tab>
      </TabList>
    </Tabs>
  </div>
</template>

<style scoped></style>
