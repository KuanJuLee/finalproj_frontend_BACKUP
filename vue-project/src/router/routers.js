import { createRouter, createWebHistory } from 'vue-router';
import Home from "@/views/Home.vue";
import NotFound from '@/views/NotFound.vue';
import Forbidden from '@/views/Forbidden.vue';
import Login from '@/views/secure/Login.vue';
import Product from '@/views/pages/Products.vue';
import RescueCase from '@/views/pages/pet/rescue/RescueCases.vue';
import MemberCenter from '@/views/secure/MemberCenter.vue';
import LineMessage from '@/views/secure/LineMessage.vue';  
const routes = [
  { path: "/", component: Home, name: "home-link" },
  { path: "/:pathMatch(.*)*", component: NotFound, name: "notfound-link" },
  { path: "/403", component: Forbidden, name: "forbidden-link" },
  { path: "/secure/login", component: Login, name: "secure-login-link" },
  { path: "/pages/products", component: Product, name: "pages-products-link" },
  { path: "/pet/rescue", component: RescueCase, name: "pet-rescueCase-link"},
  { path:"/member-center", component: MemberCenter, name: "member-center-link" },
  { path:"/advanced-settings", component: LineMessage, name: "advanced-settings-link"}
];
const route = createRouter({
  routes: routes,
  history: createWebHistory(),
});
export default route;