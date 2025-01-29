<!--  案件主組件
        1. 管理案件數據的狀態。
        2. 監聽滾動事件。
        3. 請求數據並將其傳遞給 CaseItem 組件進行渲染。 -->

<template>
  <div class="case-list" @scroll="handleScroll" ref="scrollContainer">
    <!-- 遍歷案件數據，使用 CaseItem 組件渲染每一個案件 -->
    <CaseItem
      v-for="caseItem in rescueCaseList"
      :key="caseItem.rescueCaseId"
      :caseItem="caseItem"
    />
    <!-- 加載提示 -->
    <div v-if="isLoading" class="loading">加載中...</div>
    <div v-else-if="!hasMore" class="no-more">沒有更多數據</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import CaseItem from "./CaseItem.vue";

// 響應式數據
const rescueCaseList = ref([]); // 案件數據
const offset = ref(0); // 當前偏移量
const limit = 10; // 每次請求數據量
const isLoading = ref(false); // 加載狀態
const hasMore = ref(true); // 是否還有更多數據
const scrollContainer = ref(null); // 滾動容器引用

// 初始化數據加載
onMounted(() => {
  fetchCases();
});

// 請求案件數據
const fetchCases = async () => {
  if (isLoading.value || !hasMore.value) return; // 如果正在加載或沒有更多數據，直接返回

  isLoading.value = true; // 開始加載
  try {
    const response = await axios.get(
      "http://localhost:8080/RescueCase/search/allCases",
      {
        params: { offset: offset.value, limit, sortOrder: "desc" },
      }
    );

    // 更新案件數據
    console.log("後端返回數據：", response.data.cases); // 調試數據結構
    rescueCaseList.value.push(...response.data.cases); // 新數據追加到現有數據中
    offset.value += limit; // 更新偏移量
    hasMore.value = response.data.hasMore; // 更新是否還有更多數據
  } catch (error) {
    console.error("加載案件數據失敗：", error);
  } finally {
    isLoading.value = false; // 加載結束
  }
};

// 滾動事件處理
const handleScroll = () => {
  const container = scrollContainer.value;
  if (!container) return;

  const { scrollTop, scrollHeight, clientHeight } = container;
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    // 當滾動到底部，請求下一批數據
    fetchCases();
  }
};
</script>

<style scoped>
.case-list {
  height: 500px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
}

.loading,
.no-more {
  text-align: center;
  margin-top: 10px;
}
</style>
