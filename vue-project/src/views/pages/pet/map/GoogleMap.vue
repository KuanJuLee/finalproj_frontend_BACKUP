<template>
  <div class="container">
    <!-- 左側篩選欄 -->
    <div class="search-form">
      <div class="search-form-container">
        <p>透過以下分類搜尋:</p>
        <form>
          <font-awesome-icon
            icon="fa-solid fa-thumbtack"
            style="color: #ffd43b"
          />
          <span class="filter-title">案件類別</span>
          <div class="filters">
            <label>
              <input type="checkbox" value="RescueCase" v-model="caseTypes" />
              救援案件
            </label>

            <label>
              <input type="checkbox" value="lostCase" v-model="caseTypes" />
              遺失案件
            </label>

            <label>
              <input type="checkbox" value="adoptCase" v-model="caseTypes" />
              認養案件
            </label>
          </div>
          <font-awesome-icon
            icon="fa-solid fa-thumbtack"
            style="color: #ffd43b"
          />
          <span class="filter-title">案件狀態</span>
          <div class="filters">
            <label v-for="caseState in caseStates" :key="caseState.Id">
              <input
                type="checkbox"
                :value="caseState.caseStateId"
                v-model="selectedcaseStates"
              />
              {{ caseState.caseStatement }}
            </label>
          </div>

          <font-awesome-icon
            icon="fa-solid fa-thumbtack"
            style="color: #ffd43b"
          />
          <span class="filter-title">區域範圍</span>
          <div class="filters">
            <select v-model="city" class="dropdown">
              <option value="">縣市</option>
              <option
                v-for="city in cities"
                :key="city.cityId"
                :value="city.cityId"
              >
                {{ city.city }}
              </option>
            </select>
            <select v-model="district" class="dropdown">
              <option value="">鄉鎮區</option>
              <option
                v-for="dist in districts"
                :key="dist.districtAreaId"
                :value="dist.districtAreaId"
              >
                {{ dist.districtAreaName }}
              </option>
            </select>
          </div>

          <font-awesome-icon
            icon="fa-solid fa-thumbtack"
            style="color: #ffd43b"
          />
          <span class="filter-title">物種</span>
          <div class="filters">
            <label v-for="species in speciesList" :key="species.Id">
              <input
                type="checkbox"
                :value="species.speciesId"
                v-model="selectedspecies"
              />
              {{ species.species }}
            </label>
          </div>

          <font-awesome-icon
            icon="fa-solid fa-thumbtack"
            style="color: #ffd43b"
          />
          <span class="filter-title">品種</span>
          <div class="filters">
            <input
              type="text"
              v-model="selectedBreed"
              list="breedOptions"
              placeholder="請輸入或選擇品種"
              class="input-field"
            />
            <datalist id="breedOptions">
              <option
                v-for="breed in breeds"
                :key="breed.breedId"
                :value="breed.breed"
              >
                {{ breed.breed }}
              </option>
            </datalist>
          </div>

          <font-awesome-icon
            icon="fa-solid fa-thumbtack"
            style="color: #ffd43b"
          />
          <span class="filter-title">是否懷疑走失</span>
          <div class="filters">
            <input type="checkbox" value="true" v-model="suspLost" /> 走失標記
          </div>

          <font-awesome-icon
            icon="fa-solid fa-thumbtack"
            style="color: #ffd43b"
          />
          <span class="filter-title">毛色</span>
          <div class="filters">
            <label v-for="furColor in furColors" :key="furColor.Id">
              <input
                type="checkbox"
                :value="furColor.furColorId"
                v-model="selectedFurColors"
              />
              {{ furColor.furColor }}
            </label>
          </div>

          <font-awesome-icon
            icon="fa-solid fa-thumbtack"
            style="color: #ffd43b"
          />
          <span class="filter-title">案件發布時間</span>
          <div class="filters">
            <input type="date" v-model="startDate" class="input-field" />
            <input type="date" v-model="endDate" class="input-field" />
          </div>
        </form>
      </div>
    </div>
    <!-- 右側地圖 -->
    <div class="map-section">
      <div id="map"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import axios from "axios";

const mapId = import.meta.env.VITE_API_GOOGLE_MAP_ID; //新marker版本需要對應一張特定地圖id
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const googleKey = import.meta.env.VITE_API_GOOGLE_KEY;

let map; // 存儲地圖實例
const markers = ref([]); // 存放標記 (Markers)
const infoWindow = ref(null); // 存放資訊的視窗 (InfoWindow)

//提取表單選項資料
const furColors = ref([]);
const cities = ref([]);
const districts = ref([]);
const breeds = ref([]);
const speciesList = ref([]);
const caseStates = ref([]);

// 透過計算屬性，將選擇的品種轉換為品種 ID傳給後端使用。當selectedBreed值有變化，selectedBreedId都會隨之更新，script中可直接用
const selectedBreedId = computed(() => {
  const breed = breeds.value.find((b) => b.breed === selectedBreed.value);
  return breed ? breed.breedId : null;
});

// 用來傳送條件資料給後端
//單選
const city = ref(""); //單選
const district = ref(""); //單選
const selectedBreed = ref(""); //單選
const startDate = ref(""); //單選
const endDate = ref(""); //單選
const suspLost = ref(false); //單選
//多選
const caseTypes = ref([]); // 多選
const selectedcaseStates = ref([]); // 多選
const selectedspecies = ref([]); // 多選
const selectedFurColors = ref([]); // 多選

//提取物種資料
const fetchSpecies = async () => {
  try {
    const response = await axios.get(`${baseUrl}/pet/allSpecies`);
    speciesList.value = response.data;
  } catch (error) {
    console.error("無法獲取物種資料:", error);
  }
};

//提取毛色資料
const fetchFurColors = async () => {
  try {
    const response = await axios.get(`${baseUrl}/pet/allFurColor`);
    furColors.value = response.data;
  } catch (error) {
    console.error("無法獲取毛色資料:", error);
  }
};

//提取縣市資料
const fetchCities = async () => {
  try {
    const response = await axios.get(`${baseUrl}/pet/allCity`);
    cities.value = response.data;
  } catch (error) {
    console.error("無法獲取縣市資料:", error);
  }
};

//藉由縣市id提取鄉鎮區資料
const fetchDistricts = async (selectedCityId) => {
  if (!selectedCityId) {
    districts.value = []; // 清空鄉鎮區
    return;
  }
  try {
    const response = await axios.get(
      `${baseUrl}/pet/districtAreasByCity/${selectedCityId}`
    );
    districts.value = response.data;
  } catch (error) {
    console.error("無法獲取鄉鎮區資料:", error);
  }
};

//提取案件狀態資料
const fetchCaseStates = async () => {
  try {
    const response = await axios.get(`${baseUrl}/pet/allCaseState`);
    caseStates.value = response.data;
  } catch (error) {
    console.error("無法獲取案件狀態資料:", error);
  }
};

// 監聽 city 的變化，動態加載對應的鄉鎮區
watch(
  () => city.value,
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

// **動態加載 Google Maps API**
const loadGoogleMapsAPI = () => {
  return new Promise((resolve) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleKey}&libraries=marker`;
    script.defer = true;
    script.async = true;
    script.onload = resolve;
    document.head.appendChild(script);
  });
};

// **初始化 Google 地圖**
const initMap = () => {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 25.033, lng: 121.5654 },
    zoom: 12,
    mapId: `${mapId}`,
  });
  infoWindow.value = new google.maps.InfoWindow();
};

//預設載入所有案件
const fetchAllCases = async () => {
  try {
    clearMarkers();
    const caseTypesList = ["RescueCase", "lostCase", "adoptCase"];
    //三種案件請求後端拿座標
    for (const caseType of caseTypesList) {
      const response = await axios.get(`${baseUrl}/${caseType}/getLocations`);
      response.data.forEach((caseData) => {
        addMarker(
          caseData.latitude,
          caseData.longitude,
          caseData.caseTitle,
          caseData.rescueReason,
          caseData.casePictures,
          caseData.caseState,
          caseData.caseType,
          caseData.publicationTime,
          caseData.city,
          caseData.district
        );
      });
    }
  } catch (error) {
    console.error("無法獲取所有案件資料:", error);
  }
};

// 根據篩選條件取得案件
const fetchFilteredCases = async () => {
  try {
    clearMarkers();
    if (caseTypes.value.length === 0) {
      fetchAllCases(); // 若無勾選條件，則顯示所有案件
      return;
    }
    for (const caseType of caseTypes.value) {
      const response = await axios.get(`${baseUrl}/${caseType}/getLocations`, {
        params: {
          caseState: selectedcaseStates.value.length
            ? selectedcaseStates.value
            : null,
          city: city.value || null,
          district: district.value || null,
          species: selectedspecies.value.length ? selectedspecies.value : null,
          breedId: selectedBreedId.value || null,
          furColors: selectedFurColors.value.length
            ? selectedFurColors.value
            : null,
          suspLost: suspLost.value ? true : null,
          startDate: startDate.value || null,
          endDate: endDate.value || null,
        },
      });

      response.data.forEach((caseData) => {
        addMarker(
          caseData.latitude,
          caseData.longitude,
          caseData.caseTitle,
          caseData.rescueReason,
          caseData.casePictures,
          caseData.caseState,
          caseData.caseType,
          caseData.publicationTime,
          caseData.city,
          caseData.district
        );
      });
    }
  } catch (error) {
    console.error("無法獲取篩選後案件資料:", error);
  }
};

// 清除標記
const clearMarkers = () => {
  markers.value.forEach((marker) => marker.setMap(null));
  markers.value = [];
};

// 新增標記並加入點擊事件
const addMarker = (
  lat,
  lng,
  caseTitle,
  rescueReason,
  casePictures,
  caseState,
  caseType,
  publicationTime,
  city,
  district
) => {
  const marker = new google.maps.Marker({
    position: { lat, lng },
    map,
    caseTitle,
  });
  console.log("案件圖片", casePictures);

  // 案件資訊視窗內容
  const contentString = `
    <div style="max-width: 400px; display: flex; align-items: center; gap: 10px;">
      <img src="${casePictures[0].pictureUrl}" alt="案件圖片" style="width: 130px; height: 130px; object-fit: cover; border-radius: 8px;">
      <div>
        <h4 style="margin: 5px 0; font-size: 16px; font-weight: bold;">[${city}${district}]
        ${caseTitle}</h4>
        <div class="case-status" :class="statusClass(caseItem.caseState)">
        ${caseState.caseStatement}
        </div>
         <p style="margin: 5px 0; font-size: 14px; color: #333; font-weight: 500;">${rescueReason}</p>
        <p  style=" font-size: 14px; color: #666;"> 建立日期: ${publicationTime}</p>
      </div>
      </div>
    </div>
    <div class="post">
    <div class="post-image">
      <img
        :src="${casePictures[0]} "
        :alt="${caseTitle}"
      />
    </div>
  </div>
  `;

  // 監聽 `mouseover` 事件來顯示資訊視窗
  marker.addListener("mouseover", () => {
    infoWindow.value.setContent(contentString);
    infoWindow.value.open(map, marker);
  });

  // 監聽 `mouseout` 事件來隱藏資訊視窗
  marker.addListener("mouseout", () => {
    infoWindow.value.close();
  });

  markers.value.push(marker);
};

// 監聽篩選條件變化
watch(
  [
    caseTypes,
    selectedcaseStates,
    city,
    district,
    selectedspecies,
    selectedBreed,
    selectedFurColors,
    suspLost,
    startDate,
    endDate,
  ],
  async () => {
    await fetchFilteredCases();
  }
);

onMounted(async () => {
  await loadGoogleMapsAPI();
  initMap();
  fetchAllCases();
  fetchFurColors();
  fetchCities();
  fetchCaseStates();
  fetchBreeds();
  fetchSpecies();
});
</script>

<style scoped>
.container {
  padding: 0;
  margin: 0;
  display: flex;
  height: 100%; /*視窗的 100% 高度*/
  max-width: 100vw; /* 調整整體容器寬度 */
  overflow: hidden; /* 🔹 確保沒有多餘的滾動條 */
  border-radius: 10px;
}

.filter-title {
  font-weight: 600;
  margin-left: 10px;
}

.search-form {
  border: 1px solid #e1e1e1;
  width: 25%;
  height: 100%;
  background-color: #f8f8f8;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: auto; /* 允許篩選欄在垂直方向上出現滾動條 */
}

.search-form-container {
  border-radius: 10px;
  height: 100%;
  padding: 10px;
  background-color: #f4f4f4;
  border: #ccc 0.5px solid;
}

.map-section {
  flex: 1; /* 地圖部分會根據彈性盒模型的規則占用剩餘空間 */
  height: 100%;
  overflow: hidden;
  position: relative;
}

#map {
  padding: 0;
  width: 100%;
  height: 100%; /* 🔹 讓地圖高度滿版 */
  position: absolute;
}

.input-group {
  margin-bottom: 10px;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form span {
  margin: 0;
}

.filters {
  margin-left: 10px;
  margin-bottom: 10px;
  margin-top: 15px;
  padding-bottom: 10px;
  border-bottom: #ccc 0.5px solid;
}

.filters select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 5px;
  font-size: 14px;
}

.filters label {
  margin-right: 15px;
}

.dropdown {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.animal-type label {
  margin-right: 15px;
}

.tip {
  font-size: 14px;
  color: #666;
  background-color: #fff8e1;
  padding: 10px;
  border: 1px solid #ffe0b2;
  border-radius: 4px;
}

.tip-highlight {
  color: #d32f2f;
  font-weight: bold;
}

.highlight {
  color: #d32f2f;
  font-weight: bold;
}

/* 以下為案件資訊 */
.post-id {
  font-weight: 400;
}

.case-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 4px;
}

/* 待救援 */
.status-pending {
  background-color: #ed6c6c;
  color: #ffffff;
}

/* 已救援 */
.status-completed {
  background-color: #feba07;
  color: #ffffff;
}

.case-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
  transition: color 0.2s ease-in-out, text-decoration 0.2s ease-in-out;
  cursor: pointer;
}

.case-title:hover {
  color: #feba07;
  text-decoration: underline;
}

.case-footer {
  margin-top: 8px;
  margin-left: 23px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
}

.views-and-follows span {
  margin-right: 16px;
}

.author {
  color: #c6bc77;
}

.post {
  display: flex;
  flex: 0 0 70%;
  margin-bottom: 50px;
  margin-top: 50px;
  padding-bottom: 35px;
  border-bottom: #eae9e9 2px solid;
}

.views {
  color: #333;
}

.info {
  display: flex;
  color: #c6bc77;
  font-weight: 600;
  font-size: 17px;
  display: flex;
  justify-content: space-between;
}

.info-3 {
  font-size: 12px;
  margin: 0px;
  padding: 0px;
  margin-bottom: 20px;
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

.post-details p {
  margin: 8px 0;
}

.post-details {
  flex: 1 0 40%;
  width: 250px;
  padding-left: 50px;
}

.post-details-p {
  margin-top: 20px;
  margin-bottom: 5%;
  color: #333;
  font-weight: 400;
  border-left: 2px solid #dbdddc;
  padding-left: 16px;
}

.info-4 {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
</style>
