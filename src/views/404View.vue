<script setup>
import { gsap } from "gsap";
import { onMounted } from "vue";

onMounted(() => {
  // Use a single timeline for all animations
  const tl = gsap.timeline({ repeat: -1 });

  // Add the cog animations to the timeline
  tl.to(
    ".cog1",
    {
      rotation: "+=360",
      transformOrigin: "50% 50%",
      ease: "none",
      duration: 8,
    },
    0
  ) // The '0' here makes this start at the beginning of the timeline
    .to(
      ".cog2",
      {
        rotation: "-=360",
        transformOrigin: "50% 50%",
        ease: "none",
        duration: 8,
      },
      0
    ); // This also starts at the beginning

  // Create a separate, yoyo-ing tween for the text
  gsap.fromTo(
    ".wrong-para",
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    }
  );
});
</script>

<template>
  <div class="not-found">
    <div class="container">
      <h1 class="first-four">4</h1>
      <div class="cog-wheel1">
        <div class="cog1">
          <div class="top"></div>
          <div class="down"></div>
          <div class="left-top"></div>
          <div class="left-down"></div>
          <div class="right-top"></div>
          <div class="right-down"></div>
          <div class="left"></div>
          <div class="right"></div>
        </div>
      </div>

      <div class="cog-wheel2">
        <div class="cog2">
          <div class="top"></div>
          <div class="down"></div>
          <div class="left-top"></div>
          <div class="left-down"></div>
          <div class="right-top"></div>
          <div class="right-down"></div>
          <div class="left"></div>
          <div class="right"></div>
        </div>
      </div>
      <h1 class="second-four">4</h1>
      <p class="wrong-para">Uh Oh! Page not found! <router-link to="/home">Go back to home</router-link></p>
    </div>
  </div>
</template>

<style scoped>
/* Assuming fonts are imported elsewhere (e.g., in index.html) */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overflow: hidden;
  background-color: #f4f6ff;
}
.not-found {
    position: fixed;
    margin-left: 1.5rem;
}
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Poppins", sans-serif;
  position: relative;
  text-align: center;
}

.cog-wheel1,
.cog-wheel2 {
  transform: scale(0.7);
}

.cog1,
.cog2 {
  width: 40vmin;
  height: 40vmin;
  border-radius: 50%;
  border: 6vmin solid #f3c623;
  position: relative;
}

.cog2 {
  border: 6vmin solid #4f8a8b;
  position: relative;
  left: -10.2vmin;
  bottom: 10vmin;
}

.top,
.down,
.left,
.right,
.left-top,
.left-down,
.right-top,
.right-down {
  width: 10vmin;
  height: 10vmin;
  background-color: #f3c623;
  position: absolute;
}

.cog2 .top,
.cog2 .down,
.cog2 .left,
.cog2 .right,
.cog2 .left-top,
.cog2 .left-down,
.cog2 .right-top,
.cog2 .right-down {
  background-color: #4f8a8b;
}

.top {
  top: -14vmin;
  left: 9vmin;
}

.down {
  bottom: -14vmin;
  left: 9vmin;
}

.left {
  left: -14vmin;
  top: 9vmin;
}

.right {
  right: -14vmin;
  top: 9vmin;
}

.left-top {
  transform: rotateZ(-45deg);
  left: -8vmin;
  top: -8vmin;
}

.left-down {
  transform: rotateZ(45deg);
  left: -8vmin;
  top: 25vmin;
}

.right-top {
  transform: rotateZ(45deg);
  right: -8vmin;
  top: -8vmin;
}

.right-down {
  transform: rotateZ(-45deg);
  right: -8vmin;
  top: 25vmin;
}

h1 {
  color: #142833;
}

.first-four {
  position: relative;
  left: 6vmin;
  font-size: 40vmin;
}

.second-four {
  position: relative;
  right: 18vmin;
  z-index: -1;
  font-size: 40vmin;
}

.wrong-para {
  font-family: "Montserrat", sans-serif;
  position: absolute;
  bottom: 15vmin;
  padding: 3vmin 12vmin 3vmin 3vmin;
  font-weight: 600;
  color: #092532;
}
@media (min-width: 360px) and (max-width: 768px) {
  .wrong-para {
      bottom: 40vmin;
  }
}
</style>
