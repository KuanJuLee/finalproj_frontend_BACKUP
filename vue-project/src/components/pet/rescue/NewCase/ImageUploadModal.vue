<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <button class="close-button" @click="$emit('close')">✖</button>
      </div>
      <div class="modal-body">
        <div class="upload-section">
          <input type="file" @change="handleFileUpload" accept="image/*" />
          <div v-if="previewImage" class="cropper-container">
            <img ref="image" :src="previewImage" alt="預覽圖片" />
          </div>
        </div>
        <div class="preview-section">
          <h4>圖片預覽：</h4>
          <div v-if="croppedImage" class="preview">
            <img :src="croppedImage" alt="裁剪後的圖片" />
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="resetCropper">重置</button>
        <button @click="confirmUpload">確定上傳</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

const previewImage = ref(null);
const croppedImage = ref(null);
const cropper = ref(null);
const imageRef = ref(null);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
      nextTick(() => {
        initializeCropper();
      });
    };
    reader.readAsDataURL(file);
  }
};

const initializeCropper = () => {
  if (cropper.value) {
    cropper.value.destroy();
  }
  const image = imageRef.value;
  cropper.value = new Cropper(image, {
    aspectRatio: 1,
    viewMode: 1,
    autoCropArea: 1,
  });
};

const resetCropper = () => {
  if (cropper.value) {
    cropper.value.reset();
  }
};

const confirmUpload = () => {
  if (cropper.value) {
    cropper.value.getCroppedCanvas().toBlob((blob) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        croppedImage.value = e.target.result; // 轉換為 Base64
        $emit("image-cropped", croppedImage.value); // 將圖片傳遞給父組件
      };
      reader.readAsDataURL(blob);
    });
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  width: 600px;
  padding: 20px;
  border-radius: 8px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
}

.preview {
  width: 100px;
  height: 100px;
  border: 1px solid #ddd;
  overflow: hidden;
}
</style>
