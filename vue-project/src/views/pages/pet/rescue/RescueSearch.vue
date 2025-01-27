<template lang="">
  <div class="rescue-page">
    <SearchTitle></SearchTitle>
    <SearchForm></SearchForm>
    <CaseList> </CaseList>
    <div class="add-info">
      <button @click="addNewCase">新增救援資訊</button>
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
</style>
