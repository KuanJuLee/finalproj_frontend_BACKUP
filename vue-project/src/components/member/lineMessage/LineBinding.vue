<template lang="">
    <!-- 沒註冊過也沒有用line登入的，根本看不到此畫面，因為此畫面只在會員中心中，表示一定有memberid -->
    <!-- 目前已限制必須是有LINEID的用戶才能使用message api通知功能，因此只有網站註冊的要先進行line綁定，而沒註冊但使用Line登入的可直接追蹤商家 -->
    <div>
    <!-- 判斷是否已綁定 LineID -->
    <div v-if="!isBound">
      <p>您尚未綁定 LINE，請先進行 LINE 登入：</p>
      <LineLogin @bindingSuccess="checkBindingStatus" />
    </div>
    <div v-else>
      <p>您的 LINE 帳戶已綁定，請點擊下方按鈕追蹤商家：</p>
      <a
        href="https://line.me/R/ti/p/@310pndih"
        class="btn btn-success"
      >
        <img
          height="36"
          border="0"
          alt="加入好友"
          src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png"
        />
      </a>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import Swal from "sweetalert2";
import LineLogin from "../login/LineLogin.vue";
import { ref, onMounted } from "vue";

const isBound = ref(false);   // 狀態標誌，用於控制顯示按鈕類型

onMounted(() => {
  checkBindingStatus(); // 頁面初始化時檢查綁定狀態
});


//用於判斷此用戶的memberId有無綁定一個lineId，有才能直接顯示linebot按鈕，沒有則顯示line登入按鈕
async function checkBindingStatus() {
  //從token中拿memberId
  try {  
  const user = localStorage.getItem("user");  
  if (!user) return null; 
    const parsedUser = JSON.parse(user); 
    const token = parsedUser.token; 
    if (!token) {
      Swal.fire("錯誤", "請重新登入", "error");
      isBound.value = false;
      return;
    }

    // 呼叫後端 API，檢查是否已綁定 LINE
    const response = await axios.get("http://localhost:8080/line/checkBinding", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
     // 根據後端回應更新狀態
     isBound.value = response.data.success;
  } catch (error) {
    console.error("檢查綁定狀態失敗: ", error);
    isBound.value = false;
  }
}




// 綁定請求
async function sendBindingRequest() {
    
  try {
    //先驗證有無token
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("錯誤", "請重新登入", "error");
      return;
    }

    //請求後端API做綁定
    const response = await axios.post("/line", null, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 將 Token 動態加入標頭
      },
    });

    Swal.fire("成功", "綁定信息發送成功: " + response.data.message, "success");
  } catch (error) {
    Swal.fire(
      "綁定失敗",
      error.response ? error.response.data.message : error.message,
      "error"
    );
  }
}

</script>
<style lang="">
    
</style>