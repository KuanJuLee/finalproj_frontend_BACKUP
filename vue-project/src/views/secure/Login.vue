<template>
  <h3>Login</h3>
  <table>
    <tbody>
      <tr>
        <td>ID :</td>
        <td><input type="text" v-model="email" @keyup.enter="login" /></td>
        <td>
          <span class="error">{{ message }}</span>
        </td>
      </tr>
      <tr>
        <td>PWD :</td>
        <td><input type="text" v-model="password" @keyup.enter="login" /></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td align="right">
          <button type="button" @click="login">login</button>
        </td>
      </tr>
    </tbody>
  </table>

  <div><LineLogin /></div>
</template>
<script setup>
import { axiosapi } from "@/plugins/axios.js";
import Swal from "sweetalert2";
import { ref } from "vue";
import { useRouter } from "vue-router";
import useUserStore from "@/stores/user.js";
import LineLogin from "@/components/member/login/LineLogin.vue";

const email = ref("");
const password = ref("");
const message = ref("");
const router = useRouter();
const userStore = useUserStore();

async function login() {
  document.querySelector(".error").innerHTML = "";
  message.value = "";
  if (email.value == "") {
    email.value = null;
  }
  if (password.value == "") {
    password.value = null;
  }
  const body = {
    email: email.value,
    password: password.value,
  };

  //每次嘗試登入都要先把header中清空一次
  axiosapi.defaults.headers.authorization = "";
  userStore.setEmail("");
  userStore.setToken("");

  console.log(body);

  try {
    const response = await axiosapi.post(`${baseUrl}/ajax/secure/login`, body);
    console.log("response", response);
    if (response.data.success) {
      await Swal.fire({
        title: response.data.message,
        icon: "success",
      });
      axiosapi.defaults.headers.authorization = "Bearer " + response.data.token;
      //設定 Axios 的 Authorization 預設標頭，這樣後續所有 使用 axiosapi 發送的請求 都會自動攜帶這個 Token。每次用{axiosapi2}發送 API 請求時，這個 Token 會自動附加到 HTTP Header 中，不需要手動添加
      userStore.setEmail(response.data.user);
      userStore.setToken(response.data.token); //記得增添這一條!!!!!!!!!!!!!!!

      console.log(response.data.message);
      router.push({ path: "/" }); //跳轉回首頁
    } else {
      document.querySelector(".error").innerHTML = response.data.message;
      Swal.fire({
        title: response.data.message,
        icon: "warning",
      });
    }
  } catch (error) {
    console.log("error", error);
    Swal.fire({
      title: "執行失敗:" + error.message,
      icon: "error",
    });
  }
}
</script>
