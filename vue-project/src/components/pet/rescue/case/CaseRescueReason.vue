<template>
  <div class="rescue-content">
    <h3>救援原因</h3>
    <div>
      <p>
        {{ rescueReason.rescueReason }}
      </p>
    </div>
  </div>
</template>
<script setup>
//從RescueCase父組件傳遞的caseData
defineProps({
  rescueReason: {
    type: Object,
    required: true,
  },
});
</script>
<style scoped>
h3 {
  font-size: 20px;
  font-weight: 500;
}

p {
  font-size: 16px;
  margin-top: 30px;
}

.rescue-content{
  margin-left: 30px;
}
</style>
