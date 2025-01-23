<template>
    <div>
      <!-- LINE 登入按鈕 -->
      <a :href="lineLoginUrl" v-if="lineLoginUrl">
        <img src="@/assets/lineLogin.png" alt="LINE 登入" />
      </a>
      <p v-else>正在加載 LINE 登入連結...</p>
  
      <br /><br /><br />
  
      <!-- 綁定通知按鈕 -->
      <a :href="generateRedirectUrl()" target="_blank">
        <img
          height="36"
          border="0"
          alt="加入好友"
          src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png"
        />
      </a>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import useUserStore from "@/stores/user";
  
  // 使用者的 Vuex 狀態
  const userStore = useUserStore();
  const lineLoginUrl = ref(""); // 儲存 LINE 登入的 URL
  const memberId = ref("12345"); // 示例用戶 ID，可動態更新
  
  // 生成綁定通知的超連結
  const generateRedirectUrl = () => {
    const baseUrl = "http://localhost:8080/line"; // 後端 API 路徑
    return `${baseUrl}?memberId=${encodeURIComponent(memberId.value)}`;
  };
  
  // 在組件掛載時，從後端獲取 LINE 授權 URL
  onMounted(async () => {
    try {
      const response = await axios.get("http://localhost:8080/line/authorize");
      lineLoginUrl.value = response.data;
    } catch (error) {
      console.error("無法獲取 LINE 登入連結: ", error);
  
      // 嘗試從 URL 中解析 Token 並存儲
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (token) {
        localStorage.setItem("Authorization", `Bearer ${token}`);
      }
    }
  });
  </script>
  
  <style scoped>
  /* 根據需要添加樣式 */
  </style>