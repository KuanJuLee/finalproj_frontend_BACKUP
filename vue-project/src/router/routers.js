import { createRouter, createWebHistory } from 'vue-router';
import useUserStore from "@/stores/user";
import Swal from "sweetalert2";

//前台頁面
import Home from "@/views/Home.vue";
import NotFound from '@/views/NotFound.vue';
import Forbidden from '@/views/Forbidden.vue';
import Login from '@/views/secure/Login.vue';   //舊的，先不用了
import RescueCase from '@/views/pages/pet/rescue/RescueCase.vue';
import EditRescueCase from '../views/pages/pet/rescue/EditRescueCase.vue';
import NewRescueProgress from '../views/pages/pet/rescue/NewRescueProgress.vue';
import RescueSearch from '@/views/pages/pet/rescue/RescueSearch.vue';

 
//冠儒相關功能
import NewRescueCase from '../views/pages/pet/rescue/NewRescueCase.vue';
import GoogleMap from '@/views/pages/pet/map/GoogleMap.vue';


//登入相關功能
import LoginMember from '@/views/secure/LoginMember.vue';
import LoginAdmin from '@/views/secure/LoginAdmin.vue';

//會員中心功能
import MemberCenter from '@/views/pages/MemberCenter.vue';
import Register from '@/views/pages/Register.vue';
import MemberCard from '@/views/pages/MemberCard.vue';
import LineMessage from '@/views/secure/LineMessage.vue'; 
import FollowCase from '@/views/secure/FollowCase.vue';
import MemberRescueCase from '../views/secure/MemberRescueCase.vue';

//後臺頁面
import AdminManagement from '../views/AdminManagement.vue';
import RescueManagement from '@/views/admin/kuan/RescueManagement.vue';
import RescueAnalysis from '@/views/admin/kuan/RescueAnalysis.vue';




const routes = [
  { path: "/", component: Home, name: "home-link" },
  { path: "/:pathMatch(.*)*", component: NotFound, name: "notfound-link" },
  { path: "/403", component: Forbidden, name: "forbidden-link" },
  { path: '/secure/login', component: LoginMember, name: 'login-link' },
  { path: '/secure/loginadmin', component: LoginAdmin, name: 'login-admin-link' },
  { path: "/pages/products", component: Product, name: "pages-products-link" },
  { path: "/pet/rescue/search", component: RescueSearch, name: "pet-rescueSearch-link"}, 
  { path: "/pet/rescueCase/:id", component: RescueCase, name: "pet-rescueCase-link",  props: true},  // 使用 props 傳遞參數產生動態路由(新增案件)
  { path: "/pet/rescueCase/edit/:id", component: EditRescueCase, name: "pet-rescueCase-edit-link",  props: true},  // 使用 props 傳遞參數產生動態路由(編輯案件)


  { path:"/pet/rescue/add", component: NewRescueCase, name: "newRescueCase-link"},
  { path:"/pet/map", component: GoogleMap, name: "googleMap-link"},
  {path:"/pet/rescueCase/update/:id", component: NewRescueProgress, name: "newRescueProgress-link"}, // 使用 props 傳遞參數產生動態路由(編輯案件)
   //會員中心功能
   { path:"/pages/MemberCenter", component: MemberCenter, name: "member-center-link" },
  { path: "/pages/Register", component: Register, name: "register-link" },
  { path: "/member-center/followCase", component: FollowCase, name: "followCase-link" },
  { path: "/member-center/rescueCase", component: MemberRescueCase, name: "memberRescueCase-link" },
  { path: "/pages/Register", component: Register, name: "register-link" },
  { path: "/pages/MemberCenter", component: MemberCenter, name: "MemberCenter-link" },
  { path: "/pages/MemberCard", component: MemberCard, name: "MemberCard-link" },
  { path:"/advanced-settings", component: LineMessage, name: "advanced-settings-link"}, 

  //加上 meta 標記，表示這頁面不顯示導航列。
  //這樣 /admin/* 下面的所有路由都會套用 AdminManagement.vue，讓 Sidebar 固定存在！
  { path: "/admin", component: AdminManagement, name: "adminManagement-link", meta: { hideNavbar: true },children: [
    { path: "rescueCase", component: RescueManagement },
    { path: "rescueAnalysis", component: RescueAnalysis },
   
  ],},
  
];

const route = createRouter({
  routes: routes,
  history: createWebHistory(),
});


// 全域前置守衛，進行用戶token驗證(持有&時效合法)
route.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const publicPages = [
    "/secure/login",
    "/403",
    "/",
    "/pet/rescue/search",
    "/pet/map",
    "/member-center",
    "/admin",
    "/admin/rescueCase",
    "/admin/lostCase",
    "/admin/rescueAnalysis",
  ];  // 不需要驗證的路由
  

  //用來判斷救援案件頁面路徑，需要是公開
  const isRescueCaseDetail = to.path.startsWith("/pet/rescueCase/") && to.path.split("/").length === 4; 


  // 需要驗證的路由，startsWith會包括上述路由所有/**`，some() 會逐個檢查 publicPages 陣列中的每個元素，確保 只要前綴匹配就視為公開頁面
  const authRequired = !publicPages.includes(to.path) && !isRescueCaseDetail;
  


  if (authRequired) {
    const isValid = await userStore.validateToken();    //自定義方法檢查Token是否有效
    if (!isValid) {
      userStore.logout(); // 清除用戶資訊

      // ✅ 使用 SweetAlert2 顯示登入過期提示
      await Swal.fire({
      title: "錯誤訊息",
      text: "請先登入再使用本功能",
      icon: "warning",
      confirmButtonText: "確定"
    });

      return next("/secure/login"); // 跳轉到登入頁面
    }
  }

  // 限制 /admin 頁面，只有管理員可以進入
  if (to.path.startsWith("/admin") && !userStore.isAdmin()) {
    return next("/403");  // 轉到「無權限」頁面
  }


  next(); // 驗證成功則繼續跳轉 
});
export default route;