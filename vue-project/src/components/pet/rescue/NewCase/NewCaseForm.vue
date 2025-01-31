<template>
  <h2 class="form-title">救援通報表單</h2>
  <div class="form-container">
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="caseTitle" class="required">救援標題</label>
        <input
          type="text"
          id="caseTitle"
          v-model="form.caseTitle"
          placeholder="[範例] 廟旁發現受傷流浪貓需協助！"
          required
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="species" class="required">動物類別</label>
          <select id="species" v-model="form.speciesId" required>
            <option value=""></option>
            <option
              v-for="species in speciesList"
              :key="species.speciesId"
              :value="species.speciesId"
            >
              {{ species.species }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="furColor">毛色</label>
          <select v-model="form.furColorId">
            <option value=""></option>
            <option
              v-for="color in furColors"
              :key="color.furColorId"
              :value="color.furColorId"
            >
              {{ color.furColor }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="city" class="required">縣市</label>
          <select id="city" v-model="form.cityId" required>
            <option
              v-for="city in cities"
              :key="city.cityId"
              :value="city.cityId"
            >
              {{ city.city }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="district" class="required">鄉鎮區</label>
          <select id="district" v-model="form.districtAreaId" required>
            <option
              v-for="dist in districts"
              :key="dist.districtAreaId"
              :value="dist.districtAreaId"
            >
              {{ dist.districtAreaName }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-group form-single-row">
        <label for="address">街道地址</label>
        <input
          type="text"
          id="address"
          v-model="form.street"
          placeholder="例如: XX路 XX號"
        />
      </div>

      <div class="form-group form-single-row">
        <label for="mark" class="required">走失標記</label>
        <select id="mark" v-model="form.suspLost" required>
          <option value="1">是</option>
          <option value="0">否</option>
        </select>
        <span class="optional"
          >此欄位代表是否為疑似走失，如果是，我們會增加特殊標示。</span
        >
      </div>

      <div class="form-group form-single-row">
        <label class="required">救援需求(多選)</label>
        <div class="checkbox-group">
          <label
            v-for="rescueDemand in rescueDemands"
            :key="rescueDemand.rescueDemandId"
          >
            <input
              type="checkbox"
              v-model="form.rescueDemands"
              :value="rescueDemand.rescueDemandId"
            />
            {{ rescueDemand.rescueDemand }}</label
          >
        </div>
      </div>

      <div class="form-group form-single-row">
        <label for="reason" class="required">救援原因</label>
        <textarea
          id="reason"
          v-model="form.reason"
          placeholder="請描述救援原因..."
          required
        ></textarea>
      </div>

      <div class="form-group form-single-row">
        <label for="details">詳細說明</label>
        <textarea
          id="details"
          v-model="form.details"
          placeholder="請輸入案件詳細說明..."
        ></textarea>
      </div>

      <div class="form-group form-single-row">
        <label class="required">通報人可負擔事項(多選)</label>
        <div class="checkbox-group">
          <label v-for="canAfford in canAffords" :key="canAfford.canAffordId">
            <input
              type="checkbox"
              v-model="form.canAffords"
              :value="canAfford.canAfford"
            />
            {{ canAfford.canAfford }}</label
          >
        </div>
      </div>

      <div class="form-group form-single-row">
        <label class="required">圖片上傳(至少一張)</label>
        <div class="image-preview">
          <img
            v-for="(image, index) in imageform"
            :key="index"
            :src="image"
            alt="圖片預覽"
            class="preview-image"
          />
        </div>
        <button type="button" @click="openUploadModal">上傳圖片</button>
      </div>
      <button type="submit" class="submit-button">確定送出</button>
    </form>

    <!-- 圖片裁剪模態框 -->
    <ImageUploadModal
      v-if="isModalOpen"
      @close="closeUploadModal"
      @image-cropped="handleImageCropped"
    />
  </div>
</template>

<script setup>
import ImageUploadModal from "@/components/pet/rescue/newCase/ImageUploadModal.vue";
import { ref, onMounted, computed, watch, reactive } from "vue";
import axios from "axios";

//從後端提取表單選項資料
const furColors = ref([]);
const cities = ref([]);
const districts = ref([]);
const breeds = ref([]);
const speciesList = ref([]);
const rescueDemands = ref([]);
const canAffords = ref([]);

// 用來傳送資料給後端
const form = reactive({
  casetitle: "",
  speciesId: "",
  breedId: "",
  furColorId: "",
  cityId: "",
  districtAreaId: "",
  street: "",
  suspLost: "",
  rescueDemands: [],
  tag: "",
  rescueReason: "",
  canAffords: [],
});

const images = ref([]);

//圖片上傳預覽相關
const imageform = ref({
  title: "",
  images: [], // 用於保存已裁剪的圖片
});

//圖片模態框預設為關閉
const isModalOpen = ref(false);
// 打開模態框
const openUploadModal = () => {
  isModalOpen.value = true;
};
// 關閉模態框
const closeUploadModal = () => {
  isModalOpen.value = false;
};

// 處理裁剪後的圖片
const handleImageCropped = (croppedImage) => {
  imageform.value.images.push(croppedImage); // 將裁剪後的圖片加入圖片列表
  closeUploadModal();
};

const handleImageUpload = (event) => {
  const files = event.target.files;
  images.value = Array.from(files);
  console.log("上傳的圖片：", images.value);
};

onMounted(() => {
  fetchFurColors();
  fetchCities();
  fetchBreeds();
  fetchSpecies();
  fetchRescueDemands();
  fetchCanAffords();
});

const submitForm = async () => {
  try {
    const response = await axios.post(
      "http://localhost:8080/RescueCase/add",
      form
    );
    console.log("表單提交成功:", response.data);
    alert("表單提交成功！");
  } catch (error) {
    console.error("表單提交失敗:", error);
    alert("提交失敗，請重試！");
  }
};

//提取物種資料
const fetchSpecies = async () => {
  try {
    const response = await axios.get("http://localhost:8080/pet/allSpecies");
    speciesList.value = response.data;
  } catch (error) {
    console.error("無法獲取物種資料:", error);
  }
};

//提取毛色資料
const fetchFurColors = async () => {
  try {
    const response = await axios.get("http://localhost:8080/pet/allFurColor");
    furColors.value = response.data;
  } catch (error) {
    console.error("無法獲取毛色資料:", error);
  }
};

//提取縣市資料
const fetchCities = async () => {
  try {
    const response = await axios.get("http://localhost:8080/pet/allCity");
    cities.value = response.data;
  } catch (error) {
    console.error("無法獲取縣市資料:", error);
  }
};

//藉由縣市id提取鄉鎮區資料
// 獲取對應縣市的鄉鎮區
const fetchDistricts = async (selectedCityId) => {
  if (!selectedCityId) {
    districts.value = []; // 清空鄉鎮區
    return;
  }
  try {
    const response = await axios.get(
      `http://localhost:8080/pet/districtAreasByCity/${selectedCityId}`
    );
    districts.value = response.data;
  } catch (error) {
    console.error("無法獲取鄉鎮區資料:", error);
  }
};

// 監聽 cityId 的變化，動態加載對應的鄉鎮區
watch(
  () => form.cityId,
  (newCityId) => {
    fetchDistricts(newCityId);
  }
);

//提取品種資料
const fetchBreeds = async () => {
  try {
    const response = await axios.get("http://localhost:8080/pet/allBreed");
    breeds.value = response.data;
  } catch (error) {
    console.error("無法獲取品種資料:", error);
  }
};

//提取救援需求資料
const fetchRescueDemands = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/pet/allRescueDemands"
    );
    rescueDemands.value = response.data;
  } catch (error) {
    console.error("無法獲取救援需求資料:", error);
  }
};

//提取可負擔資料
const fetchCanAffords = async () => {
  try {
    const response = await axios.get("http://localhost:8080/pet/allCanAffords");
    canAffords.value = response.data;
  } catch (error) {}
};
</script>
<style scoped>
.form-container {
  max-width: 2000px;
  margin: 0 20px;
  padding: 65px 50px;
  background: #e5e2e5;
  border-radius: 10px;
  box-shadow: 0 5px 1px #959395;
}

label.required::before {
  content: "*";
  color: red;
  margin-right: 4px;
  font-weight: bold;
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  /* text-align: center; */
}

.form-group {
  color: red;
  margin: 15px 10px 15px 10px;
  font-weight: 600;
}

.optional {
  font-weight: 400;
  font-size: 14px;
}

.form-single-row {
  margin-top: 30px;
}

label {
  display: block;
  font-size: 15px;
  margin-bottom: 5px;
  color: #333;
}

input,
select,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

textarea {
  resize: none;
  height: 80px;
}

.checkbox-group label {
  display: inline-block;
  align-items: center;
  margin-right: 30px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 400;
}

.checkbox-group input {
  width: 8px;
  margin-right: 3px;
  cursor: pointer;
}

.image-upload {
  margin-top: 10px;
  display: flex;
  justify-content: space-between; /* 讓元素平均分配空間 */
  margin-right: 10px;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #feba07;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #f2d17d;
}

.form-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.form-row .form-group {
  flex: 1;
}

.image-preview {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.preview-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
