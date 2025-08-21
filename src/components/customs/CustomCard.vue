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

          <PriTag
            v-if="item.Price.Discount"
            :value="`${item.Price.Discount}% OFF`"
            severity="success"
            class="absolute top-0 left-0"
            style="color: #f98600; background: #fff9e5;"
          />
          <img
            src="/imgs/placeholder-image.png"
            alt="img"
            width="100"
            class="w-full rounded"
          />
        </div>
      </template>
      <template #title> {{ item.Title }} </template>
      <template #subtitle>
        <span class="discount-value flex">
          <i
            class="pi pi-clock mr-1 mt-1"
            style="font-size: 1rem; color: #f98600"
          >
          </i>
          <span class="amount">30 mins</span>
        </span>
      </template>
      <template #content>
        <p class="truncate-text overflow-scroll m-0 text-justify" style="height: 50px;">
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
            <del 
              v-if="item.Price.Discount"
             class="mt-0 original-price mx-1 text-red-500">
              {{ item.Price.Currency === "USD" ? "$" : "៛" }}
              {{ item.Price.Original }}</del
            >
          </div>
          <PriButton class="p-0 px-2 m-0"
            :label="'កក់ឥឡូវ'"
           />
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
    Content: "ម៉ូដសក់កំពុងពេញនិយម",
    Price: {
      Currency: "USD",
      Original: 20,
      Discount: 5,
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
