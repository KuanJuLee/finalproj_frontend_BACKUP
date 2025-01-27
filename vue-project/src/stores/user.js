import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios";

const useUserStore = defineStore("user", () => {
    const token = ref("");
    const email = ref("");
    const isTokenValid = ref(true); // 標記 token 是否有效
     
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
        isTokenValid.value = false;
      }

      // 從後端驗證 token 是否有效
    async function validateToken() {
        if (!token.value) {
        isTokenValid.value = false;
        return false;
        }

        try {
        const response = await axios.post(
            "http://localhost:8080/validateToken",
            {},
            {
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
            }
        );

        // 根據後端返回的結果更新有效性
        isTokenValid.value = response.data.valid;
        return response.data.valid;
        } catch (error) {
        console.error("Token validation failed:", error);
        isTokenValid.value = false;
        return false;
        }
    }

    //從token中解析memberId

    // 判斷是否已登入且在時效內（根據 token 判斷） 驗證token是否有效邏輯放在後端，從前端傳request時就會被驗證
    const isLogin = computed(() => {
        return token.value !== null && token.value !== "" && isTokenValid.value;;
    });

    return {
        email,
        setEmail,
        isLogin,
        token,
        setToken,
        logout,
        validateToken,
    }
},
    {
        persist: {
            storage: localStorage, paths: ["email","token"]    // 持久化 email 和 token
        }
    });
export default useUserStore;    