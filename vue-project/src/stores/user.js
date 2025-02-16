import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {axiosapi2} from "@/plugins/axios.js";

const useUserStore = defineStore("user", () => {
    const token = ref("");
    const isTokenValid = ref(true); // 標記 token 是否有效
        

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
        console.log("檢查token不存在");
        return false;
        }

        try {
        const response = await axiosapi2.post(
            `/validateToken`,
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

    // 從 token 解析 memberId
    const memberId = computed(() => {
        if (!token.value) {
            console.log("❌ Token 不存在");
            return null;
        }
    
        try {
            const payload = JSON.parse(atob(token.value.split('.')[1])); // 解析 JWT payload
            console.log("✅ 解析出的 Token Payload:", payload);
    
            // `sub` 是 JSON 字串，需要再解析一次  sub : "{\"email\":\"alice@lab.com\",\"memberId\":3}"
            if (payload.sub) {
                const subData = JSON.parse(payload.sub); // 解析 `sub` 內的 JSON
                console.log("🔍 解析出的 subData:", subData);
                return subData.memberId || null; // 提取 memberId
            }
    
            return null;
        } catch (error) {
            console.error("❌ 解析 token 失敗:", error);
            return null;
        }
    });
    
    //從token解析出role
    const role = computed(() => {
        if (!token.value) {
            console.log("❌ Token 不存在");
            return null;
        }
        try {
            const payload = JSON.parse(atob(token.value.split('.')[1])); // 解析 JWT payload
            console.log("✅ 解析出的 Token Payload:", payload);

            // `sub` 是 JSON 字串，需要再解析一次  sub : "{\"email\":\"alice@lab.com\",\"memberId\":3,\"role\":\"admin\"}"
            if (payload.sub) {
                const subData = JSON.parse(payload.sub); // 解析 `sub` 內的 JSON
                console.log("🔍 解析出的 subData:", subData);
                return subData.role || null; // 提取 role
            }
            return null;
        } catch (error) {
            console.error("❌ 解析 token 失敗:", error);
            return null;
        }
    });
        
    // 判斷是否為管理員
    const isAdmin = computed(() => {
        return role.value === "admin";
    });    

    // 判斷是否已登入且在時效內（根據 token 判斷） 驗證token是否有效邏輯放在後端，從前端傳request時就會被驗證
    const isLogin = computed(() => {
        return token.value !== null && token.value !== "" && isTokenValid.value;;
    });


    return {
        isLogin,
        token,
        setToken,
        logout,
        validateToken,
        memberId,
        role,
        isAdmin
    }
},
    { 
        persist: { //預設存到 localStorage，整個 Store 會被持久化，當頁面刷新，這些數據會自動從 localStorage 讀取
            storage: localStorage, paths: ["token" ]    // 當token被更新時會自動存入 localStorage
        }
    });
export default useUserStore;    