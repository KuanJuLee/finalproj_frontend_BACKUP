import { createApp } from 'vue'
import App from './App.vue'
import routes from './router/routers.js'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import './assets/styles/global.css'; //全局樣式表

// Import Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// Import specific icons
import { faUser, faTrash, faEdit, faCircleXmark, faCirclePlus, faImage,  faThumbtack,  faCircleUser, faEye, faHeart, faEllipsis, faArrowDownShortWide,  faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons';
//選擇性地添加需要的圖標
library.add(faUser, faTrash, faEdit, faCircleXmark,faCirclePlus,faImage,faThumbtack,faCircleUser, faEye, faHeart,faEllipsis, faArrowDownShortWide, faArrowDownWideShort);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

createApp(App)
    .use(pinia)
    .use(routes)
    .component('font-awesome-icon', FontAwesomeIcon)    //讓此子組件全局可用，不須額外import
    .mount('#app')