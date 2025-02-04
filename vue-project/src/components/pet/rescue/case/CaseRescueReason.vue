<template>
  <h3>救援原因</h3>
  <div>
    <p>
      {{ rescueReason.rescueReason }}
    </p>
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

</style>
