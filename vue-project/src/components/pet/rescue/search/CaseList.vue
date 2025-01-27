<template>
  <div class="case-list">
    <CaseItem
      v-for="caseItem in rescueCaseList"
      :key="caseItem.caseNumber"
      :case-item="caseItem"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import CaseItem from "./CaseItem.vue";

const rescueCaseList = ref([]);

onMounted(() => {
  fetchRescueCaseList();
});

const fetchRescueCaseList = async () => {
  try {
    const response = await axios.get("http://localhost:8080/pet/allCase");
    rescueCaseList.value = response.data;
  } catch (error) {
    console.error("無法獲取救援案件資料:", error);
  }
};
</script>

<style scoped>
.case-list {
  margin-top: 20px;
}
</style>
