<template>
  <link rel="stylesheet" href="/jf-openhuninn-2.1.ttf" />
  <div class="post">
    <div class="post-image">
      <img
        :src="caseItem.casePictures?.[0] || '/placeholder-image.jpg'"
        :alt="caseItem.caseTitle"
      />
    </div>
    <div class="post-details">
      <div class="info">
        <div class="post-id">案件編號: {{ caseItem.rescueCaseId }}</div>
      </div>
      <div class="info-3">
        <p>發佈日期: {{ formatDate(caseItem.publicationTime) }}</p>
      </div>
      <div class="tag">{{ caseItem.caseState }}</div>
      <h2 class="case-title">
        [{{ caseItem.cityName }} {{ caseItem.districtAreaName }}]
        {{ caseItem.caseTitle }}
      </h2>
      <div class="post-details-p">
        <p>動物類別：{{ caseItem.species }}</p>
        <!-- <p>動物數量：1</p> -->
        <p>救援需求：{{ caseItem.rescueDemands }}</p>
        <p>通報人可負擔事項：{{ caseItem.canAffords }}</p>
      </div>
      <div class="case-footer">
        <p class="author">發文者：{{ caseItem.memberNickName }}</p>
        <div class="views-and-follows">
          <span>👀 {{ caseItem.viewCount || 0 }}</span>
          <span>❤️ 追蹤 ({{ caseItem.follow || 0 }})</span>
        </div>
      </div>
    </div>
  </div>

  <div class="case-item">
    <div class="case-header">
      <img
        :src="caseItem.casePictures?.[0] || '/placeholder-image.jpg'"
        alt="案件圖片"
        class="case-image"
      />
      <div class="case-info">
        <p class="case-id">救援案件編號：{{ caseItem.rescueCaseId }}</p>
        <p class="case-date">
          建立日期：{{ formatDate(caseItem.publicationTime) }}
        </p>
        <span class="case-status" :class="statusClass(caseItem.caseState)">
          {{ caseItem.caseState }}
        </span>
      </div>
    </div>
    <div class="case-content">
      <h2 class="case-title">
        [{{ caseItem.cityName }} {{ caseItem.districtAreaName }}]
        {{ caseItem.caseTitle }}
      </h2>
      <ul class="case-details">
        <li>動物類別：{{ caseItem.species }}</li>
        <li>動物數量：{{ caseItem.age }}</li>
        <li>救援需求：{{ caseItem.rescueReason }}</li>
        <li>
          通報人可負擔事項：
          {{ caseItem.canAffords.join(" ") }}
        </li>
      </ul>
      <div class="case-footer">
        <p class="author">發文者：{{ caseItem.memberNickName }}</p>
        <div class="views-and-follows">
          <span>👀 {{ caseItem.viewCount || 0 }}</span>
          <span>❤️ 追蹤 ({{ caseItem.follow || 0 }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  caseItem: {
    type: Object,
    required: true,
  },
});

// 格式化日期函數
const formatDate = (date) => {
  if (!date) return "未知日期";
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(date).toLocaleDateString("zh-TW", options);
};

// 狀態樣式類別
const statusClass = (caseState) => {
  switch (caseState) {
    case "待救援":
      return "status-pending";
    case "進行中":
      return "status-in-progress";
    case "已完成":
      return "status-completed";
    default:
      return "status-default";
  }
};
</script>

<style scoped>
@font-face {
  font-family: "jf-openhuninn";
  src: url("/fonts/jf-openhuninn-2.1.ttf") format("truetype");
  font-weight: normal;
}
.case-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.case-header {
  display: flex;
  gap: 16px;
}

.case-image {
  width: 230px;
  height: 230px;
  border-radius: 8px;
  object-fit: cover;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.case-image:hover {
  transform: scale(1.05); /*略微放大圖片 */
}

.case-info {
  display: flex;
  flex-direction: column;
}

.case-id {
  font-size: 20px;
  color: #555;
}

.case-date {
  font-size: 14px;
  color: #555;
}

.case-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  margin-top: 4px;
}

.status-pending {
  background-color: #ffe0e0;
  color: #d32f2f;
}

.status-in-progress {
  background-color: #fff5e0;
  color: #f57c00;
}

.status-completed {
  background-color: #e0f7e0;
  color: #388e3c;
}

.case-content {
  margin-top: 16px;
}

.case-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  transition: color 0.2s ease-in-out, text-decoration 0.2s ease-in-out;
  cursor: pointer;
}

/* 🔹 當鼠標移動到標題時，變成湖綠色並增加底線 */
.case-title:hover {
  color: #50b496; /* 🔹 湖綠色 */
  text-decoration: underline; /* 🔹 增加底線 */
}

.case-details {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 14px;
  color: #666;
}

.case-details li {
  margin-bottom: 4px;
}

.case-footer {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.views-and-follows span {
  margin-right: 16px;
}

.author {
  color: #888;
}

body {
  font-family: "jf-openhuninn", sans-serif;
  margin: 0;
  padding: 0;
}

header {
  background-color: #ffffff;
  padding: 30px;
}

.navbar {
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
}

.logo {
  display: flex;
  align-items: center;
  margin-left: 50px;
}

.logo img {
  height: 90px;
  margin-right: 3px;
}

.logo h1 {
  font-size: 30px;
  color: #333;
  margin: 0;
  font-weight: 560;
}

.nav-links {
  display: flex;
  list-style: none;
  margin-right: 70px;
  padding: 0;
}

.nav-links li {
  margin-left: 50px;
}

.nav-links a {
  text-decoration: none;
  color: #2f3133;
  font-size: 16px;
}

.nav-links a:hover {
  color: #71bca3;
}

.container {
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  max-width: 1100px;
  margin: 20px auto;
  border-radius: 20px;
  padding: 20px;
}

.second-container {
  display: flex;
  justify-content: space-between;
}

.post {
  display: flex;
  flex: 0 0 70%;
}

.post-header {
  width: 100%;
  padding-bottom: 10px;
  margin-bottom: 50px;
}

.post-header h2 {
  font-size: 28px;
  color: #444;
  margin: 0;
  font-weight: 800;
}

.views {
  color: #333;
}

.info {
  color: #71bca3;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
}

.info-2 {
  font-size: 14px;
  margin-top: 10px;
}

.info-3 {
  margin-top: 8px;
  font-size: 12px;
}

.info-3 p {
  margin: 0px;
}

.post-image {
  flex: 0 1 45%;
  max-width: 30%;
  text-align: center;
  order: -1;
}

.post-image img {
  max-width: 100%;
  width: 230px;
  height: 230px;
  border-radius: 8px;
  object-fit: cover;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.post-image img:hover {
  transform: scale(1.05); /*略微放大圖片 */
}

.tag {
  margin: 35px 0 25px 0;
}

.post-details p {
  margin: 12px 0;
}

.post-details {
  flex: 1 0 40%;
  width: 250px;
  padding-left: 40px;
}

.post-details h3 {
  font-size: 20px;
  margin-bottom: 10px;
  border-left: 4px solid #71bca3;
  padding-left: 10px;
  color: #333;
}

.post-details-p {
  margin-top: 25px;
  color: #555;
  border-left: 2px solid #dbdddc;
  padding-left: 10px;
}

.info-4 {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.sidebar {
  flex: 1 1 20%;
  max-width: 100%;
  margin-left: 80px;
  text-align: center;
}

.sidebar .support-button {
  margin-bottom: 40px;
  width: 200px;
}

.support-button button {
  font-weight: 600;
  background-color: #71bca3;
  color: white;
  padding: 10px 20px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  height: 100px;
  width: 200px;
  box-shadow: 0px 2px 2px #444;
}

.support-button button:hover {
  background-color: #68a66b;
}

.advertisement {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
}

.advertisement img {
  max-width: 100%;
  border-radius: 5px;
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

.share-buttons {
  width: 100%;
  text-align: center;
  margin: 20px 0;
}

.share-buttons a {
  display: inline-block;
  margin: 0 10px;
  text-decoration: none;
  font-size: 16px;
  color: #007bff;
}

.share-buttons a:hover {
  text-decoration: underline;
}
</style>
