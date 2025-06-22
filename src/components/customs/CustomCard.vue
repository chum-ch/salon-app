<template>
  <div class="card-container">
    <PriCard
      class="card"
      style="overflow: hidden"
      v-for="item in items"
      :key="item.Content"
    >
      <template #header>
        <div class="relative mx-auto">
          <img src="../../assets/p1.jpeg" alt="img" class="w-full rounded" />
          <PriTag
            :value="`${item.Price.Discount}% OFF`"
            severity="success"
            class="absolute top-0 right-0"
          />
        </div>
      </template>
      <template #title> {{ item.Title }} </template>
      <!-- <template #subtitle>{{ item.Subtitle }}</template> -->
      <template #content>
        <p class="m-0 text-justify">
          {{ item.Content }}
        </p>
      </template>
      <template #footer>
        <div class="flex justify-content-between flex-wrap items-center">
          <div class="price flex">
            <h2 class="mt-0 font-semibold text-xl">
              {{ item.Price.Currency === "USD" ? "$" : "៛" }}
              {{ calculatePriceAfterDiscount(item.Price) }}
            </h2>
            <del class="mt-0 original-price mx-1 text-red-500">
              {{ item.Price.Currency === "USD" ? "$" : "៛" }}
              {{ item.Price.Original }}</del
            >
          </div>
          <span>
            <PriButton icon="pi pi-shopping-cart" class="ml-2" />
          </span>
        </div>
      </template>
    </PriCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const items = [
  {
    Image: "../../assets/p1.jpeg",
    Title: "Advanced Card",
    Subtitle: "Card subtitle",
    Content: "Lorem ipsum dolor sit amet, ",
    Price: {
      Currency: "USD",
      Original: 20,
      Discount: 12,
    },
  },

  {
    Image: "../../assets/p1.jpeg",
    Title: "Advanced Card",
    Subtitle: "Card subtitle",
    Content: "Lorem ipsum dolor sit amet, ",
    Price: {
      Currency: "USD",
      Original: 20,
      Discount: 10,
    },
  },
  {
    Image: "../../assets/p1.jpeg",
    Title: "Advanced Card",
    Subtitle: "Card subtitle",
    Content: "Lorem ipsum dolor sit amet.",
    Price: {
      Currency: "USD",
      Original: 20,
      Discount: 10,
    },
  },
  {
    Image: "../../assets/p1.jpeg",
    Title: "Advanced Card",
    Subtitle: "Card subtitle",
    Content: "Lorem ipsum dolor sit amet, ",
    Price: {
      Currency: "USD",
      Original: 20,
      Discount: 10,
    },
  },
];
const calculatePriceAfterDiscount = (priceObject) => {
  const originalPrice = priceObject.Original;
  const discountPercentage = priceObject.Discount; // Assuming this is a percentage

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
  width: 25%;
  margin: 1rem;
}

/* --- Smartphones (landscape) and Small Tablets (portrait) --- */
/* (e.g., min-width of 576px) */
@media (min-width: 360px) and (max-width: 768px) {
  /* .card-container {
    justify-Content: centerP
  } */
  .card {
    margin: 1rem 0px 0px 0px;
    width: 80%;
  }
}
</style>
