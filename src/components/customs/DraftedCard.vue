<template>
  <div class="container">
    <div class="card flex justify-content-center align-items-center">
      <div class="side-left">
        <img src="/imgs/placeholder-image.png" alt="" />
      </div>
      <div class="side-right w-full">
        <div class="title-discount flex justify-content-between px-2">
          <h3>Haircut</h3>
          <div class="discount">
            <span class="discount-value">
              <i class="pi pi-tag mx-2" style="font-size: 1rem"> </i>
              <span class="amount">$10</span>
            </span>
          </div>
        </div>
        <div class="title-discount flex px-2 my-2">
          <span class="discount-value" style="color: #156778">
            <span class="currency">$</span>
            <span class="amount">10</span>
          </span>
          <span class="discount-value flex ml-2">
            <i
              class="pi pi-clock mr-1 mt-1"
              style="font-size: 1rem; color: #f98600"
            >
            </i>
            <span class="amount">30 mins</span>
          </span>
        </div>
        <div class="title-discount flex justify-content-between px-2">
          <span class="amount"> ម៉ូដសក់កំពុងពេញនិយម </span>
          <i
            class="pi pi-plus-circle p-2 flex justify-content-between align-items-center cursor-pointer"
            style="
              font-size: 1rem;
              color: #f98600;
              background: #fff9e5;
              border-radius: 50%;
            "
          >
          </i>
        </div>
      </div>
    </div>
  </div>
</template>
<script></script>
<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.container {
  width: 343px;
  height: 114px;
  flex-shrink: 0;
  border-radius: 8px;
  background: #fff;

  /* Card Shadow */
  box-shadow: #63636333 0px 2px 8px 0px;
}
.side-left {
  width: 114px;
  height: 114px;
  flex-shrink: 0;
}
.side-left img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.discount {
  width: 30%;
  border-radius: 50px;
  background: #fff9e5;
  color: #f98600;
}
</style>
