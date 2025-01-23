<template>
    <div>
      <!-- line登入又分為已經註冊過的用戶(有memberId，要記得從token取出傳給後端)，跟沒註冊過的用戶(沒有memberId) -->
      <a :href="lineLoginUrl" v-if="lineLoginUrl">
        <img src="@/assets/lineLogin.png" alt="LINE 登入" />
      </a>
      <p v-else>正在加載 LINE 登入連結...</p>
    </div>
</template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import useUserStore from "@/stores/user";
  
 
  const userStore = useUserStore();
  const lineLoginUrl = ref(""); // 儲存 LINE 登入的 URL
  const memberId = ref(""); // 示例用戶 ID，可動態更新
  

// 登入過的用戶可從 localStorage的 user中解析出Token並提取memberId (token有可能被竄改? 因此盡量不要在前端解析數據來用)
function getMemberIdFromToken() {
  const user = localStorage.getItem("user");  
  if (!user) return null; 
  try {
    const parsedUser = JSON.parse(user); 
    const token = parsedUser.token; 
    if (!token) return null;

    // 解析 JWT Payload
    const payload = JSON.parse(atob(token.split(".")[1])); // 解碼 Base64 Payload
    const subject = payload.sub; // 提取 `subject` 字段
    if (!subject) return null; // 如果 `subject` 不存在，返回 null

    // 解析 `subject` 中的 JSON，提取 `memberId`
    const subjectData = JSON.parse(subject); // `subject` 是存放 JSON 的字符串
    return subjectData.memberId; // 返回 `memberId`
  } catch (error) {
    console.error("無法解析 Token: ", error);
    return null; 
  }
}

  // 在組件掛載時，從後端獲取 LINE 授權 URL
  onMounted(async () => {
    
    //嘗試解析memberId
    memberId.value = getMemberIdFromToken(); // 解析出 memberId
    console.log(11111);
    console.log(memberId.value);
    try {
      const response = await axios.get("http://localhost:8080/line/authorize", {
      params: { memberId: memberId.value },   // 如果有 memberId，將其作為查詢參數傳給後端
    });
      lineLoginUrl.value = response.data;
    } catch (error) {
      console.error("無法獲取 LINE 登入連結: ", error);
  
      // 登入完嘗試從 URL 中解析 Token 並存儲
    //   const params = new URLSearchParams(window.location.search);
    //   const token = params.get("token");
    //   if (token) {
    //     localStorage.setItem("Authorization", `Bearer ${token}`);
    //   }
    }
  });
  </script>
  
  <style scoped>
  
  </style>