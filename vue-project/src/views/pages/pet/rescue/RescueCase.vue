<template lang="">
  <div class="rescue-page">
    <CaseTitle></CaseTitle>
    <div class="second-container">
      <div class="main-content">
        <CaseItem :caseItem="CaseData"> </CaseItem>
        <div class="edit-button">
          <button>要求共同編輯權限</button>
        </div>
        <div class="share-buttons">
          <a href="#">分享至 Facebook</a>
          <a href="#">分享至 Line</a>
          <a href="#">分享至 Twitter</a>
        </div>
        <div class="rescue-details">
          <div class="rescue-reason">
            <h3>救援原因</h3>
            <div class="rescue-reason-p">
              <p>
                母貓12/7出現無食慾現象，8日再出現已經掛著黏稠口水，胸前毛都濕了，嘗試濕食但咬了一口就掉出來且會用前腳撥嘴巴，9日嘴上依然掛著濃稠口水。
                以前用誘捕籠抓過她去絕育，嘗試再用似乎效益不彰，希望能夠幫忙
              </p>
            </div>
          </div>
          <div class="rescue-progress">
            <h3>救援進度</h3>
          </div>
        </div>
        <div class="comments-section">
          <h3>留言區</h3>
          <textarea placeholder="新增留言..."></textarea>
          <button>提交留言</button>
        </div>
      </div>

      <div class="sidebar">
        <div class="support-button">
          <RouterLink to="/pet/rescue/add" class="button-link">
            新增救援資訊
          </RouterLink>
        </div>
        <div class="advertisement">
          <p>工商</p>
          <!-- <img src="@" alt="廣告圖片" /> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import CaseTitle from "@/components/pet/rescue/case/CaseTitle.vue";
import CaseItem from "../../../../components/pet/rescue/search/CaseItem.vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const route = useRoute();
const CaseData = ref({});

// 根據案件 ID 請求後端數據
const fetchCaseData = async () => {
  try {
    const response = await axios.get(
      `${VITE_API_BASE_URL}/RescueCase/search/${route.params.id}`
    );
    CaseData.value = response.data;
  } catch (error) {
    console.error("無法獲取案件資料:", error);
  }
};

onMounted(() => {
  fetchCaseData();
});
</script>

<style scoped>
.rescue-page {
  margin: 0 auto;
  max-width: 1200px;
}

.sidebar {
  flex: 1 1 20%;
  max-width: 100%;
  margin-top: 30px;
  margin-left: 80px;
  text-align: center;
  flex-direction: column; /* 垂直排列 */
  align-items: center; /* 元素居中對齊 */
  display: flex; /* 使用 Flexbox */
}

.sidebar .support-button {
  margin-bottom: 40px;
  width: 200px;
}

.button-link {
  display: inline-block;
  font-weight: 500;
  letter-spacing: 2px; /* 增加字元之間的距離 */
  background-color: #c6bc77;
  color: white;
  padding: 10px 20px;
  font-size: 20px;
  text-align: center;
  text-decoration: none;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  height: 100px;
  width: 200px;
  box-shadow: 0px 2px 2px #6a6a6a;
  line-height: 100px; /* 讓文字垂直置中 */
}

.button-link:hover {
  background-color: #aca269;
}

.advertisement {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  width: 70%;
}

.advertisement img {
  max-width: 100%;
  border-radius: 5px;
}

.second-container {
  display: flex;
  flex-direction: row; /* 水平排列 */
  justify-content: space-between; /* 左右分佈 */
  align-items: flex-start; /* 元素頂部對齊 */
}

.main-content {
  flex: 18; /* 主內容區域占 3 倍空間 */
  display: flex;
  flex-direction: column; /* 垂直排列 SearchForm 和 CaseList */
  gap: 40px; /* 兩個元素之間的間距 */
}

.edit-button {
  width: 100%;
  text-align: center;
  margin: 30px auto;
}

.edit-button button {
  background-color: #edeeef;
  color: rgb(63, 63, 63);
  width: 90%;
  height: 70px;
  font-size: 20px;
  font-weight: 600;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0px 2px 2px #bbb7b7;
}

.edit-button button:hover {
  background-color: #cecccc;
}

.rescue-details {
  margin-top: 70px;
  border: 5px solid transparent;
  border-image: repeating-linear-gradient(
      50deg,
      rgb(194, 188, 161) 0,
      rgb(224, 218, 191) 20px,
      transparent 10px,
      transparent 30px
    )
    80;
  border-radius: 8px;
  padding: 20px;
}

.rescue-reason {
  border-bottom: 1px solid #ddd;
}

.rescue-reason-p {
  margin: 30px;
}

.rescue-reason h3 {
  font-weight: 500;
}

.rescue-progress {
  margin: 30px 0;
}

.rescue-progress h3 {
  font-weight: 500;
}

.comments-section {
  width: 100%;
  margin-top: 30px;
}

.comments-section h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.comments-section textarea {
  width: 100%;
  height: 80px;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
}

.comments-section button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.comments-section button:hover {
  background-color: #0056b3;
}
</style>
