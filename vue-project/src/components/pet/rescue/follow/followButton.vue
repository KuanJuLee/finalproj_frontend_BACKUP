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

   // **切換追蹤狀態並更新數量**
   if (isFollowing.value) {
      followCount.value -= 1;
    } else {
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
</style>
