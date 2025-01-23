import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const useUserStore = defineStore("user", () => {
    const token = ref("");
    const email = ref("");
     
    // 設置 Email
    function setEmail(data) {
        email.value = data;
    }

     // 設置 Token，於用戶成功登入後調用
     function setToken(data) {
        token.value = data;
      }

      // 清除用戶信息（登出）
    function logout() {
        email.value = "";
        token.value = "";
      }


    // 判斷是否已登入（根據 token 判斷） 驗證token是否有效邏輯放在後端，從前端傳request時就會被驗證
    const isLogin = computed(() => {
        return token.value !== null && token.value !== "";
    });

    return {
        email,
        setEmail,
        isLogin,
        token,
        setToken,
        logout,
    }
},
    {
        persist: {
            storage: localStorage, paths: ["email","token"]    // 持久化 email 和 token
        }
    });
export default useUserStore;    