<template>
  <div>
    <div id="map" style="width: 100%; height: 600px"></div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";

const mapId = import.meta.env.VITE_API_GOOGLE_MAP_ID;
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const googleKey = import.meta.env.VITE_API_GOOGLE_KEY;

let map; // 存儲地圖實例
const markers = ref([]); // 存放標記 (Markers)
const infoWindow = ref(null); // 存放資訊的視窗 (InfoWindow)

onMounted(async () => {
  await loadGoogleMapsAPI(); // 確保 API 加載完成
  initMap(); // 初始化地圖
  fetchLocations(); // 從後端獲取座標並標記
});

// **動態加載 Google Maps API**
const loadGoogleMapsAPI = () => {
  return new Promise((resolve) => {
    // 如果 Google Maps 已經加載，則直接解決 Promise
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    // 創建 script 標籤來載入 Google Maps API
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleKey}&libraries=marker`;
    script.defer = true;
    script.async = true;
    script.onload = resolve; // 當 script 加載完成時，解析 Promise
    document.head.appendChild(script);
  });
};

// **初始化 Google 地圖**
const initMap = () => {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 25.033, lng: 121.5654 }, // 台北市中心
    zoom: 12,
    mapId: `${mapId}`, //改用新的AdvancedMarkerElement每張地圖需要有獨立的mapId
  });

  //初始化 InfoWindow
  infoWindow.value = new google.maps.InfoWindow();
};

// **從後端獲取座標**
const fetchLocations = async () => {
  try {
    const response = await axios.get(`${baseUrl}/RescueCase/getLocations`);
    console.log(response.data);
    const rescueCases = response.data;
    rescueCases.forEach((rescueCase) => {
      addMarker(
        rescueCase.latitude,
        rescueCase.longitude,
        rescueCase.caseTitle,
        rescueCase.rescueReason
      );
    });
  } catch (error) {
    console.error("無法獲取座標資料", error);
  }
};

// **新增標記並加入點擊事件**
const addMarker = (lat, lng, title, rescueReason) => {
  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: new google.maps.LatLng(lat, lng),
    map, // 直接掛載到地圖
    title,
  });

  // **點擊標記顯示 InfoWindow**
  marker.addListener("click", () => {
    const contentString = `
      <div style="max-width: 250px;">
        <h4>${title}</h4>
        <p>救援原因:${rescueReason}</p>
      </div>
    `;

    infoWindow.value.setContent(contentString);
    infoWindow.value.open(map, marker);
  });

  markers.value.push(marker);
};
</script>
