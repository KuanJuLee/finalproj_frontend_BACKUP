<template>
  <div @click="toggleFollow" class="follow-button" :class="{ following: isFollowing }">
    <font-awesome-icon icon="fa-solid fa-heart" class="heart-icon" />
    <span>{{ isFollowing ? "已追蹤" : "追蹤" }} ({{ followCount }})</span>
  </div>
</template>

<script setup>
import { ref, onMounted  } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import Swal from 'sweetalert2';

const baseUrl = import.meta.env.VITE_API_BASE_URL;


const props = defineProps({
  follow: {
    type: Number,
    required: true,
  },
  caseId: {
    type: Number,
    required: true,
  },
  caseType: {
    type: String,
    required: true,
  },
});

const followCount = ref(props.follow);
const isFollowing = ref(false);
const route = useRoute();


// 顯示彈窗訊息
const showAlert = (message, icon) => {
  Swal.fire({
    title: "追蹤狀態",
    text: message,
    imageUrl: "http://localhost:8080/upload/final/pet/images/follow-icon.png",
    // icon: icon,
    imageWidth: 150, // 設定寬度
    imageHeight: 120, // 設定高度
    confirmButtonText: "確認",
    timer: 1000, // 設定 1 秒自動關閉
    timerProgressBar: true, // 顯示進度條
    customClass: {
      popup: "custom-swal-popup",
    },
  });
};


// 取得會員登入資訊
const getAuthToken = () => {
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  return parsedUser ? parsedUser.token : null;
};

// **初始化時檢查是否已追蹤**
const checkIfFollowing = async () => {
  const token = getAuthToken();
  if (!token) return; // 沒登入直接返回

  try {
    const response = await axios.get(`${baseUrl}/Case/follow/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        caseId: props.caseId,
        caseType: props.caseType,   
      },
    });

    isFollowing.value = response.data.isFollowing; // 設定是否已追蹤，決定顯示追蹤或已追蹤
  } catch (error) {
    console.error("檢查追蹤狀態失敗:", error);
  }
};


// 切換追蹤狀態
const toggleFollow = async () => {
    
  const token = getAuthToken();
  if (!token) {
    alert("請先登入才能追蹤案件！");
    return;
  }



  try {
    const response = await axios.put(
      `${baseUrl}/Case/follow/add`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          caseId: props.caseId,
          caseType: props.caseType,
        },
      }
    );
    
    console.log(response.data.message);

   // 切換畫面追蹤狀態並更新數量(後端在送api時就會隨著更新資料表中的追蹤數量了，這裡只變化前端顯示，不重抓)
  // 顯示不同的訊息
  if (isFollowing.value) {
      showAlert("已取消追蹤", "info");
      followCount.value -= 1;
    } else {
      showAlert("成功追蹤！", "success");
      followCount.value += 1;
    }
    isFollowing.value = !isFollowing.value;
  } catch (error) {
    console.error("追蹤請求失敗:", error);
    alert("追蹤失敗，請稍後再試！");
  }
};

onMounted(() => {
  checkIfFollowing();
});



</script>

<style scoped>

.follow-button {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.follow-button:hover {
  color:#ed6c6c
}

/* 已追蹤的樣式 */
.following {
  color: #ed6c6c;
}

.heart-icon {
  margin-right: 3px;
  font-size: 20px;
}

.following .heart-icon {
  color: #ed6c6c;
}

.custom-swal-popup {
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
