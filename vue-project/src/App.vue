<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navigationbar from "./views/Navigationbar.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();



// 定義需要全螢幕顯示的路徑
const fullWidthRoutes = ["/pet/map", "/advanced-settings"];

// 判斷是否應該應用 `full-width` 樣式
const isFullWidth = computed(() => fullWidthRoutes.includes(route.path));
</script>

<template>
  <div>
    <Navigationbar />
    <div :class="isFullWidth ? 'full-width' : 'container'">
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

/* 當 `isFullWidth` 為 true，讓 `.container` 變成全寬 */
.full-width {
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100vh; /* ✅ 讓 `/pet/map` 和 `/advanced-settings` 頁面占滿全畫面 */
  max-width: 100%;
  max-height: 100%;
  overflow: hidden; /* ✅ 隱藏滾動條 */
}
</style>
