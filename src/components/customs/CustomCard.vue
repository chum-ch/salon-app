<template>
  <div class="card-container">
    <div
      class="rounded border card"
      v-if="items.length === 0"
      v-for="i in 4"
      :key="i"
    >
      <PriSkeleton width="100%" height="200px"> </PriSkeleton>
      <div class="p-4">
        <PriSkeleton width="90%" class="mb-3"></PriSkeleton>
        <PriSkeleton width="70%" height=".5rem" class="mb-3"></PriSkeleton>
        <PriSkeleton width="80%" height=".5rem" class="mb-2"></PriSkeleton>
        <PriSkeleton width="90%" height=".5rem" class="mb-2"></PriSkeleton>
        <PriSkeleton width="100%" height=".5rem" class="mb-2"></PriSkeleton>
      </div>
      <div class="p-3 w-full flex justify-content-between align-items-center">
        <PriSkeleton width="5rem" height="1rem" class=""></PriSkeleton>
        <PriSkeleton width="5rem" height="2rem" class=""></PriSkeleton>
      </div>
    </div>
    <PriCard
      v-else
      class="card"
      style="overflow: hidden"
      v-for="item in items"
      :key="item.Content"
    >
      <template #header>
        <div class="relative mx-auto">
          <PriTag
            v-if="item.Price.Discount"
            :value="`${item.Price.Discount}% OFF`"
            severity="success"
            class="absolute top-0 left-0"
            style="color: #f98600; background: #fff9e5"
          />
          <img
            src="/imgs/placeholder-image.png"
            alt="img"
            width="100"
            class="w-full rounded"
          />
        </div>
      </template>
      <template #title> {{ item.Name }} </template>
      <template #subtitle>
        <span class="discount-value flex">
          <i
            class="pi pi-clock mr-1 mt-1"
            style="font-size: 1rem; color: #f98600"
          >
          </i>
          <span class="amount">{{ item.Duration }} mins</span>
        </span>
      </template>
      <template #content>
        <p
          class="truncate-text overflow-scroll m-0 text-justify"
          style="height: 50px"
        >
          {{ item.Description }}
        </p>
      </template>
      <template #footer>
        <div class="flex justify-content-between flex-wrap items-center">
          <div class="price flex">
            <h2 class="mt-0 font-semibold text-xl">
              {{ item.Price.Currency === "USD" ? "$" : "៛" }}
              {{ calculatePriceAfterDiscount(item.Price) }}
            </h2>
            <del
              v-if="item.Price.Discount"
              class="mt-0 original-price mx-1 text-red-500"
            >
              {{ item.Price.Currency === "USD" ? "$" : "៛" }}
              {{ item.Price.Original }}</del
            >
          </div>
          <CustomButton
            class="p-0 px-2 m-0"
            :label="'កក់សេវាកម្ម'"
            @onClick="onClickBooking(item)"
          />
        </div>
      </template>
    </PriCard>
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  additionalData : {
    type: Object,
    default: () => ({}),
  },
});
// console.log("additionalData", props.additionalData);

const $api = inject("$api");
const $constanceVariable = inject("$constanceVariable");
const $helperFun = inject("$helperFun");
const route = useRouter();
const items = ref([]);
const userInfo = $helperFun.getSessionItem(
  $constanceVariable.SessionStorageKey.UserInfo
);
const calculatePriceAfterDiscount = (priceObject) => {
  const originalPrice = priceObject.Amount;
  const discountPercentage = priceObject.Discount || 0; // Assuming this is a percentage

  if (
    typeof originalPrice !== "number" ||
    typeof discountPercentage !== "number"
  ) {
    return "Invalid input: Original price and discount must be numbers.";
  }
  if (discountPercentage < 0 || discountPercentage > 100) {
    return "Invalid input: Discount percentage must be between 0 and 100.";
  }

  const discountAmount = originalPrice * (discountPercentage / 100);
  const priceAfterDiscount = originalPrice - discountAmount;

  return priceAfterDiscount;
};
const onClickBooking = (item) => {
  $helperFun.setSessionItem(
    $constanceVariable.SessionStorageKey.ServiceItmeInfo,
    item
  );
  route.push("/calendar");
};
onMounted(async () => {
  try {
    if (userInfo) {
      const services = await $api.salon.listServices(
        userInfo.TenantId,
        userInfo.EntityItemId
      );
      items.value = services.data;
      $helperFun.setSessionItem(
        $constanceVariable.SessionStorageKey.AllServicesItems,
        services.data
      );
    }
  } catch (error) {
    console.error("List services error:", error);
  }
});
</script>
<style scoped>
.card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.card {
  box-shadow: #63636333 0px 2px 8px 0px;
  background: transparent;
  border-radius: 0.5rem;
  width: 20%;
  margin: 1rem;
}
.btn {
  width: 50%;
  /* border-radius: 10px; */
  /* background: #fff9e5; */
  /* color: #f98600; */
}
.truncate-text {
  /* overflow: scroll; */
  /* display: -webkit-box; */
  /* -webkit-box-orient: vertical; */
  /* The number of lines to show before truncating */
  /* -webkit-line-clamp: 4;  */
  /* white-space: nowrap; */
  /* text-overflow: ellipsis; */
}
/* --- Smartphones (landscape) and Small Tablets (portrait) --- */
@media (max-width: 768px) {
  /* .card-container {
    justify-Content: center
  } */
  .card {
    margin: 1rem 0px 0px 0px;
    width: 80%;
  }
}

/* --- Tablets (landscape) and Laptops --- */
/* (e.g., min-width of 768px) */
@media (min-width: 768px) and (max-width: 992px) {
  .card-container {
    justify-content: space-evenly;
  }
  .card {
    margin: 1rem 0px 0px 0px;
    width: 40%;
  }
}
</style>
