<template lang="">
    <div>
        <div>
    <div v-if="!isBound">
      <p>您尚未綁定 LINE，請先進行 LINE 登入：</p>
      <a :href="lineLoginUrl" class="btn btn-primary">LINE 登入</a>
    </div>
    <div v-else>
      <p>您的 LINE 帳戶已綁定，請點擊下方按鈕追蹤商家：</p>
      <a href="https://line.me/R/ti/p/@310pndih" class="btn btn-success"><img height="36" border="0" alt="加入好友" src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png"></a>
    </div>
</div>
</div>
</template>

<script setup>
import axios from "axios";
import Swal from "sweetalert2";

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