import { createRouter, createWebHistory } from 'vue-router';
import useUserStore from "@/stores/user";
import Home from "@/views/Home.vue";
import NotFound from '@/views/NotFound.vue';
import Forbidden from '@/views/Forbidden.vue';
import Login from '@/views/secure/Login.vue';
import Product from '@/views/pages/Products.vue';
import RescueCase from '@/views/pages/pet/rescue/RescueCases.vue';
import RescueSearch from '@/views/pages/pet/rescue/RescueSearch.vue';
import MemberCenter from '@/views/secure/MemberCenter.vue';
import LineMessage from '@/views/secure/LineMessage.vue';  
import NewRescueCase from '../views/pages/pet/rescue/NewRescueCase.vue';
import GoogleMap from '@/views/pages/pet/map/GoogleMap.vue';

const routes = [
  { path: "/", component: Home, name: "home-link" },
  { path: "/:pathMatch(.*)*", component: NotFound, name: "notfound-link" },
  { path: "/403", component: Forbidden, name: "forbidden-link" },
  { path: "/secure/login", component: Login, name: "secure-login-link" },
  { path: "/pages/products", component: Product, name: "pages-products-link" },
  { path: "/pet/rescue/search", component: RescueSearch, name: "pet-rescueSearch-link"}, 
  { path: "/pet/rescue", component: RescueCase, name: "pet-rescueCase-link"},
  { path:"/member-center", component: MemberCenter, name: "member-center-link" },
  { path:"/advanced-settings", component: LineMessage, name: "advanced-settings-link"},
  { path:"/pet/rescue/add", component: NewRescueCase, name: "newRescueCase-link"},
  { path:"/pet/map", component: GoogleMap, name: "googleMap-link"},
];
const route = createRouter({
  routes: routes,
  history: createWebHistory(),
});


// 全域前置守衛，進行用戶token驗證(持有&時效合法)
route.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const publicPages = ["/secure/login","/403","/","/pet/rescue/search","/pet/map"]; // 不需要驗證的路由
  const authRequired = !publicPages.includes(to.path); // 需要驗證的路由

  if (authRequired) {
    const isValid = await userStore.validateToken();    //自定義方法檢查Token是否有效
    if (!isValid) {
      userStore.logout(); // 清除用戶資訊
      alert("您的登入已過期，請重新登入！");
      return next("/secure/login"); // 跳轉到登入頁面
    }
  }

  next(); // 驗證成功則繼續跳轉 
});
export default route;