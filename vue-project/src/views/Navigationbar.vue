<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <RouterLink class="navbar-brand logo-container" aria-current="page" to="/"
        ><img src="../assets/logo.png" alt="logo"
      /></RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <span
              class="nav-link dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              >通報案件</span
            >
            <ul class="dropdown-menu">
              <li>
                <RouterLink class="dropdown-item" to="/pet/rescue/search"
                  >流浪救援</RouterLink
                >
              </li>
              <li>
                <RouterLink class="dropdown-item" to="/pages/products"
                  >動物認養</RouterLink
                >
              </li>
              <li>
                <RouterLink class="dropdown-item" to="/pages/products"
                  >遺失協尋</RouterLink
                >
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link active"
              aria-current="page"
              to="/pages/products"
              >寵物商城</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link active"
              aria-current="page"
              to="/pages/products"
              >救援活動</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link active"
              aria-current="page"
              to="/pet/map"
              >地圖</RouterLink
            >
          </li>
          <li class="nav-item">
            <!-- 根據是否已登入顯示不同的 RouterLink -->
            <RouterLink v-if="isLoggedIn" class="nav-link" to="/member-center"
              >會員中心</RouterLink
            >
            <RouterLink v-else class="nav-link" to="/secure/login">
              會員登入
            </RouterLink>
          </li>
          <li class="nav-item" v-if="userStore.isAdmin()">
            <RouterLink class="nav-link active" aria-current="page" to="/admin"
              >管理員中心</RouterLink
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import useUserStore from "@/stores/user.js";

// 使用 Pinia 的 userStore
const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLogin); // 直接從 Store 獲取
</script>

<style>
.logo-container img {
  margin-left: 40px;
  width: 60px; /* 設定固定寬度 */
  height: auto; /* 保持圖片比例 */
}
</style>
