<template>
  <div class="progress-detail">
    <div class="progress-header">
      <span class="create-time">{{ formatDate(createTime) }}</span>
      <span class="edit-button">修改</span>
    </div>
    <div class="progress-body">
      <img v-if="imageUrl" :src="imageUrl" alt="進度圖片" class="progress-image" />
      <p class="progress-text">{{ progressDetail }}</p>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

const route = useRoute();
const rescueProgressList = ref([]);

// 接收父組件的 props
const props = defineProps({
  progressDetail: String,
  createTime: String,
  imageUrl: String,
});

const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(date).toLocaleString("zh-TW", options);
};
</script>

<style scoped>
.progress-detail {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 10px;
  background: #f9f9f9;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.create-time {
  font-size: 14px;
  color: #888;
}

.edit-button {
  color: #007bff;
  cursor: pointer;
}

.progress-body {
  display: flex;
  gap: 20px;
}

.progress-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
}

.progress-text {
  font-size: 16px;
  color: #333;
}
</style>
