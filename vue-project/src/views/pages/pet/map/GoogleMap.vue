<template>
  <div class="container">
    <!-- 左側篩選欄 -->
    <div class="search-form">
      <form>
        <font-awesome-icon
          icon="fa-solid fa-thumbtack"
          style="color: #ffd43b"
        />
        <span class="filter-title">案件類別</span>
        <div class="filters case-type">
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

        <div class="filters caseState">
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
        </div>
        <div class="filters address">
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
        </div>

        <div class="animal-type filters">
          <p>物種</p>
          <label>
            <input type="checkbox" value="狗" v-model="animalType" /> 狗
          </label>
          <label>
            <input type="checkbox" value="貓" v-model="animalType" /> 貓
          </label>
        </div>

        <div class="breed filters">
          <p>品種</p>
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

        <div class="susp-lost filters">
          <label>
            <p>是否懷疑走失</p>
            <input type="checkbox" value="true" v-model="suspLost" /> 走失標記
          </label>
        </div>
        <div class="fur-color filters">
          <p>毛色</p>
          <label v-for="furColor in furColors" :key="furColor.Id">
            <input
              type="checkbox"
              :value="furColor.furColorId"
              v-model="selectedFurColors"
            />
            {{ furColor.furColor }}
          </label>
        </div>

        <div class="date-filter filters">
          <p>案件發布時間</p>
          <input type="date" v-model="startDate" class="input-field" />
          <input type="date" v-model="endDate" class="input-field" />
        </div>
      </form>
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

const mapId = import.meta.env.VITE_API_GOOGLE_MAP_ID;
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

// 用來傳送資料給後端
const selectedcaseStates = ref("");
const city = ref("");
const district = ref("");
const caseTypes = ref([]); // 多選案件類型
const animalType = ref([]);
const selectedFurColors = ref([]);
const selectedBreed = ref("");
const startDate = ref("");
const endDate = ref("");
const suspLost = ref(false);

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

// **從後端獲取座標**
const fetchLocations = async (filters) => {
  try {
    clearMarkers(); // 每次呼叫表示有新的篩選條件，要先清除舊的標記

    for (const caseType of caseTypes.value) {
      const endpoint = `${baseUrl}/${caseType}/getLocations`;
      const response = await axios.get(endpoint, { params: filters });
      response.data.forEach((caseData) => {
        addMarker(
          caseData.latitude,
          caseData.longitude,
          caseData.caseTitle,
          caseData.rescueReason
        );
      });
    }
  } catch (error) {
    console.error("無法獲取座標資料", error);
  }
};

// **清除標記**
const clearMarkers = () => {
  markers.value.forEach((marker) => marker.setMap(null));
  markers.value = [];
};

// **新增標記並加入點擊事件**
const addMarker = (lat, lng, title, rescueReason) => {
  const marker = new google.maps.Marker({
    position: { lat, lng },
    map,
    title,
  });

  marker.addListener("click", () => {
    const contentString = `
      <div style="max-width: 250px;">
        <h4>${title}</h4>
        <p>救援原因: ${rescueReason}</p>
      </div>
    `;
    infoWindow.value.setContent(contentString);
    infoWindow.value.open(map, marker);
  });

  markers.value.push(marker);
};

// **監控篩選條件並更新地圖**
watch([selectedcaseStates, city, district, animalType], () => {
  const filters = {
    selectedcaseStates: selectedcaseStates.value,
    city: city.value,
    district: district.value,
    animalType: animalType.value,
  };
  fetchLocations(filters);
});

onMounted(async () => {
  await loadGoogleMapsAPI();
  initMap();
  fetchLocations({});
  fetchFurColors();
  fetchCities();
  fetchCaseStates();
  fetchBreeds();
});
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh; /*視窗的 100% 高度*/
  max-width: 90vw; /* 調整整體容器寬度 */
  margin: 0 auto; /* 讓容器水平置中 */
}

.filter-title {
  font-weight: 600;
  margin-left: 10px;
}

.search-form {
  width: 35%;
  background-color: #f9f9f9;
  padding: 20px;
  overflow-y: auto; /* 允許篩選欄在垂直方向上出現滾動條 */
}

.map-section {
  flex: 1; /* 地圖部分會根據彈性盒模型的規則占用剩餘空間 */
}

#map {
  height: 600px;
  width: 100%;
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

.caseState {
  margin-bottom: 10px;
}

.filters {
  margin-bottom: 30px;
  margin-top: 10px;
}

.address {
  margin-bottom: 10px;
}

.dropdown {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.animal-type {
  margin-bottom: 10px;
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
</style>
