<template>
  <div class="case-item">
    <img :src="caseItem.imageUrl" :alt="caseItem.title" />
    <div class="case-details">
      <p><strong>案件編號：</strong>{{ caseItem.caseNumber }}</p>
      <p><strong>標題：</strong>{{ caseItem.title }}</p>
      <p><strong>地點：</strong>{{ caseItem.city }} {{ caseItem.district }}</p>
      <p>
        <strong>救援狀態：</strong>
        <span
          :class="
            caseItem.status === '暫時安置' ? 'status-temp' : 'status-wait'
          "
        >
          {{ caseItem.status }}
        </span>
      </p>
      <p>
        <strong>瀏覽數：</strong>{{ caseItem.viewCount }} |
        <strong>留言數：</strong>{{ caseItem.comments }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps(["caseItem"]);
</script>

<style scoped>
.case-item {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 20px;
  display: flex;
}
.case-details {
  margin-left: 15px;
}
.status-temp {
  color: orange;
}
.status-wait {
  color: red;
}
</style>
