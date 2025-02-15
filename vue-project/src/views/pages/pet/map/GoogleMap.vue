<template>
  <div class="container">
    <!-- 左側篩選欄 -->
    <div class="search-form">
      <div class="search-form-container">
        <p>透過以下條件搜尋:</p>
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
import { axiosapi2 } from "@/plugins/axios.js";
const mapId = import.meta.env.VITE_API_GOOGLE_MAP_ID; //新marker版本需要對應一張特定地圖id
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const frontUrl = import.meta.env.VITE_FRONT_URL;
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
const caseTypes = ref(["RescueCase", "lostCase", "adoptCase"]); // 多選
const selectedcaseStates = ref([]); // 多選
const selectedspecies = ref([]); // 多選
const selectedFurColors = ref([]); // 多選

//提取物種資料
const fetchSpecies = async () => {
  try {
    const response = await axiosapi2.get(`/pet/allSpecies`);
    speciesList.value = response.data;
  } catch (error) {
    console.error("無法獲取物種資料:", error);
  }
};

//提取毛色資料
const fetchFurColors = async () => {
  try {
    const response = await axiosapi2.get(`/pet/allFurColor`);
    furColors.value = response.data;
  } catch (error) {
    console.error("無法獲取毛色資料:", error);
  }
};

//提取縣市資料
const fetchCities = async () => {
  try {
    const response = await axiosapi2.get(`/pet/allCity`);
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
    const response = await axiosapi2.get(
      `/pet/districtAreasByCity/${selectedCityId}`
    );
    districts.value = response.data;
  } catch (error) {
    console.error("無法獲取鄉鎮區資料:", error);
  }
};

//提取案件狀態資料
const fetchCaseStates = async () => {
  try {
    const response = await axiosapi2.get(`/pet/allCaseState`);
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
    const response = await axiosapi2.get(`/pet/allBreed`);
    breeds.value = response.data;
  } catch (error) {
    console.error("無法獲取品種資料:", error);
  }
};

//將後端返回的caseType從英文轉回中文字串，顯示於案件圖標資訊中
const translateCaseType = (caseType) => {
  console.log(caseType);
  const typeMap = {
    rescueCase: "救援案件",
    lostCase: "遺失案件",
    adoptCase: "認養案件",
  };
  return typeMap[caseType] || "未知案件"; // 預設為 "未知案件" 以防錯誤
};

// **動態加載 Google Maps API**
const loadGoogleMapsAPI = () => {
  return new Promise((resolve) => {
    if (window.google && window.google.maps && window.google.maps.marker) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleKey}&libraries=marker,maps`;
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

//進入頁面預設載入所有案件
const fetchAllCases = async () => {
  try {
    clearMarkers();
    const caseTypesList = ["RescueCase", "lostCase", "adoptCase"];
    //三種案件請求後端拿座標
    for (const caseType of caseTypesList) {
      const response = await axiosapi2.get(`/${caseType}/getLocations`);
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
          caseData.district,
          caseData.caseId
        );
      });
    }
  } catch (error) {
    console.error("無法獲取所有案件資料:", error);
  }
};

//產生送往後端的篩選條件，產生正確的 Query 參數格式（包含單選和多選）
const buildQueryParams = () => {
  const queryParams = new URLSearchParams();

  // ✅ 處理 **單選** 參數（如果值非空則加入）
  if (city.value) queryParams.append("city", city.value);
  if (district.value) queryParams.append("district", district.value);
  if (selectedBreed.value) queryParams.append("breedId", selectedBreed.value);
  if (startDate.value) queryParams.append("startDate", startDate.value);
  if (endDate.value) queryParams.append("endDate", endDate.value);
  if (suspLost.value !== null) queryParams.append("suspLost", suspLost.value);

  // ✅ 處理 **多選** 參數（確保每個值都正確加入）
  selectedcaseStates.value.forEach((id) => queryParams.append("caseState", id));
  selectedspecies.value.forEach((id) => queryParams.append("species", id));
  selectedFurColors.value.forEach((id) => queryParams.append("furColors", id));

  return queryParams.toString();
};

// 根據篩選條件取得案件
const fetchFilteredCases = async () => {
  try {
    clearMarkers();
    await new Promise((resolve) => setTimeout(resolve, 300)); // 確保標記完全清除

    if (caseTypes.value.length === 0) {
      fetchAllCases(); // 若無勾選條件，則顯示所有案件
      return;
    }
    // axios 在序列化params時，會自動加上[]，導致不符合標準HTTP查詢參數格式，因此手動處理URL參數
    const queryString = buildQueryParams();
    console.log("往後端送的條件參數", queryString);

    for (const caseType of caseTypes.value) {
      const url = `/${caseType}/getLocations/filters?${queryString}`;
      console.log("url", url);
      const response = await axiosapi2.get(url);
      console.log("查詢到的案件", response.data);
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
          caseData.district,
          caseData.caseId
        );
      });

      console.log("✅ 新增標記後，目前標記數量:", markers.value.length);
    }
  } catch (error) {
    console.error("無法獲取篩選後案件資料:", error);
  }
};

const clearMarkers = () => {
  console.log("🛑 清除所有標記！目前標記數量:", markers.value.length);

  if (markers.value.length === 0) {
    console.warn("⚠️ 沒有標記需要清除");
    return;
  }

  // 確保所有標記被完全移除
  markers.value.forEach((marker, index) => {
    if (marker && marker.setMap) {
      marker.setMap(null);
      console.log(`✅ 清除了標記 ${index}: `, marker);
    } else {
      console.warn(`⚠️ 無效標記 ${index}: `, marker);
    }
  });

  // 清空 markers 陣列（確保 Vue 響應式更新）
  markers.value.splice(0, markers.value.length);

  console.log("✅ 標記已全部清除！目前標記數量:", markers.value.length);
};

// 新增標記並加入滑鼠事件
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
  district,
  caseId
) => {
  // 轉換 caseType 為中文
  const caseTypeZh = translateCaseType(caseType);

  // 設定不同案件類型的背景顏色
  const caseTypeStyle = (() => {
    switch (caseTypeZh) {
      case "救援案件":
        return "background-color: #E16A54; color: white; border-radius: 10px; padding: 5px 10px; font-weight: bold;width: 80px; text-align: center;";
      case "遺失案件":
        return "background-color: #ffa726; color: white; border-radius: 10px; padding: 5px 10px; font-weight: bold;width: 80px; text-align: center;";
      case "認養案件":
        return "background-color: #42a5f5; color: white; border-radius: 10px; padding: 5px 10px; font-weight: bold;width: 80px; text-align: center;";
      default:
        return "background-color: #9e9e9e; color: white; border-radius: 20px; padding: 5px 10px; font-weight: bold;width: 80px; text-align: center;";
    }
  })();

  //將 publicationTime 轉換成 YYYY-MM-DD 格式
  const formatDate = (isoString) => {
    return isoString.split("T")[0]; // 只取 "2025-02-03" 部分
  };
  const formattedDate = formatDate(publicationTime);

  //設定案件頁面的 URL
  const caseUrl = `${window.location.origin}/pet/${caseType}/${caseId}`;

  // 設定不同案件狀態的背景顏色
  const caseStateStyle = (() => {
    switch (caseState.caseStatement) {
      case "待救援":
        return "background-color: #ed6c6c; color: white; border-radius: 10px; padding: 3px 4px; font-weight: bold;width: 62px; text-align: center;";
      case "已救援":
        return "background-color: #feba07; color: white; border-radius: 10px; padding: 5px 10px; font-weight: bold;";
      case "待認養":
        return "background-color: #ed6c6c; color: white; border-radius: 10px; padding: 5px 10px; font-weight: bold;";
      case "已認養":
        return "background-color: #feba07; color: white; border-radius: 10px; padding: 5px 10px; font-weight: bold;";
      case "待協尋":
        return "background-color: #ed6c6c; color: white; border-radius: 10px; padding: 5px 10px; font-weight: bold;";
      case "已尋回":
        return "background-color: #feba07; color: white; border-radius: 10px; padding: 5px 10px; font-weight: bold;";
      case "變成小天使":
        return "background-color: #feba07; color: white; border-radius: 10px; padding: 5px 10px; font-weight: bold;";
      case "案件失敗":
        return "background-color: #feba07; color: white; border-radius: 10px; padding: 5px 10px; font-weight: bold;";
      default:
        return "background-color: #9e9e9e; color: white; border-radius: 20px; padding: 5px 10px; font-weight: bold;";
    }
  })();

  // **建立資訊視窗內容**
  const infoWindowContent = `
   <div style="display: flex; flex-direction: column; align-items: flex-start; max-width:430px; gap: 10px;">
    <!-- 案件類型標籤 -->
    <span style="${caseTypeStyle}; margin: 0; ">${caseTypeZh}</span>
    <!-- 主要內容區 -->
    <div style="display: flex; align-items: stretch; gap: 10px;">
      <!-- 左側圖片 -->
      <img src="${casePictures[0].pictureUrl}"
           alt="案件圖片"
           style="height: 150px; object-fit: cover; border-radius: 8px; flex-shrink: 0;">

      <!-- 右側文字內容 -->
      <div style="display: flex; flex-direction: column; justify-content: space-between; max-width: 100%;">
        <h4 style="margin: 5px 0; font-size: 16px; font-weight: bold;">
          [${city}${district}] ${caseTitle}
        </h4>

        <!-- 案件狀態 -->
        <div style="padding: 4px 8px; border-radius: 4px; font-size: 14px;
                    background-color: #ddd; display: inline-block; ${caseStateStyle}">
          ${caseState.caseStatement}
        </div>

        <!-- 內容說明 -->
        <p style="margin: 5px 0; font-size: 14px; color: #333; font-weight: 500;">
          ${rescueReason}
        </p>

        <p style="font-size: 14px; color: #666;">建立日期: ${formattedDate}</p>
      </div>
    </div>
  </div>
  `;

  // 創建標記 (AdvancedMarkerElement)
  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: { lat, lng },
    map,
    title: caseTitle, // 讓 Google Maps 內建 hover 顯示標題
    gmpClickable: true, //開啟滑鼠點擊屬性
  });
  console.log("新marker的案件圖片", casePictures);

  // 創建 InfoWindow
  const infoWindow = new google.maps.InfoWindow({
    content: infoWindowContent,
    disableAutoPan: true, // 防止自動調整
  });

  //InfoWindow 不會再顯示 X 按鈕
  google.maps.event.addListener(infoWindow, "domready", () => {
    const closeButton = document.querySelector(".gm-ui-hover-effect");
    if (closeButton) {
      closeButton.style.display = "none"; // 隱藏 X 按鈕
    }
  });

  // 監聽 `mouseenter` (滑鼠懸停) 來顯示 `InfoWindow`，AdvancedMarkerElement 沒有內建 mouseover 事件，但可以透過 marker.element 來監聽 DOM 事件
  marker.element.addEventListener("mouseenter", () => {
    infoWindow.open(map, marker);
  });

  // 監聽 `mouseleave` (滑鼠離開) 來關閉 `InfoWindow`
  marker.element.addEventListener("mouseleave", () => {
    infoWindow.close();
  });

  // 滑鼠點擊時，開啟新分頁案件頁面
  marker.addListener("click", () => {
    window.open(caseUrl, "_blank"); // 在新分頁開啟案件詳細頁，這個路徑是加諸於原本的
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
    console.log("條件變化了!");
    clearMarkers(); // 確保標記真的清除
    await fetchFilteredCases();
  }
);

onMounted(async () => {
  await loadGoogleMapsAPI();
  initMap();
  window.clearMarkers = clearMarkers;
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
  width: 21%;
  height: 100%;
  background-color: #f0efef;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: auto; /* 允許篩選欄在垂直方向上出現滾動條 */
}

.search-form-container {
  border-radius: 10px;
  height: 100%;
  padding: 10px;
  background-color: #f8f6f6;
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
