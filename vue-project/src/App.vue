<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navigationbar from "./views/Navigationbar.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div>
    <Navigationbar></Navigationbar>
    <div v-if="route.path === '/pet/map'" class="full-width">
      <RouterView />
    </div>

    <div v-else class="container">
      <RouterView />
    </div>
  </div>
</template>

<style>
/* 全域樣式 */
.container {
  background-color: #ffffff;
  padding: 0 100px;
  margin: 0 auto;
}

/* 當 `route.path === '/pet/map'`，則讓 `.container` 變成全寬 */
.full-width {
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100vh; /* ✅ 讓 `/pet/map` 頁面占滿全畫面 */
  max-width: 100%;
  max-height: 100%;
  overflow: hidden; /* ✅ 隱藏 `map` 頁面的滾動條 */
}
</style>
