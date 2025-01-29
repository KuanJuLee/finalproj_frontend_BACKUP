<template lang="">
  <div class="rescue-page">
    <div class="container">
      <SearchTitle></SearchTitle>
      <div class="second-container">
        <SearchForm></SearchForm>
        <CaseList> </CaseList>
        <div class="sidebar">
          <div class="support-button">
            <button>新增救援資訊</button>
          </div>
          <div class="advertisement">
            <p>工商</p>
            <!-- <img src="@" alt="廣告圖片" /> -->
          </div>
        </div>
        <!-- <div class="add-info">
        <button @click="addNewCase">新增救援資訊</button>
      </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import SearchTitle from "@/components/pet/rescue/search/SearchTitle.vue";
import SearchForm from "@/components/pet/rescue/search/SearchForm.vue";
import CaseList from "@/components/pet/rescue/search/CaseList.vue";

const addNewCase = () => {
  console.log("跳轉到新增案件頁面");
  // 使用路由導航至新增頁面
};
</script>

<style>
.rescue-page {
  margin: 0 auto;
  max-width: 900px;
}
.add-info {
  text-align: right;
  margin-top: 20px;
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

.second-container {
  display: flex;
  justify-content: space-between;
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
</style>
