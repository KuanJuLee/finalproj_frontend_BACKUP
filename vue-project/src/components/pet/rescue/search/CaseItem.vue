<template>
  <div class="case-item">
    <h3>{{ caseItem.title }}</h3>
    <p>類型：{{ caseItem.type }}</p>
    <p>城市：{{ caseItem.city }}</p>
    <p>狀態：{{ caseItem.status }}</p>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  caseItem: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.case-item {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #f9f9f9;
}
</style>
