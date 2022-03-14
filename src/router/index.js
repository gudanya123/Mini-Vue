import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/HomeView";
import About from "@/views/AboutView";
import Test from "@/views/TestView";

Vue.use(Router);

//导出工厂函数
export function createRouter() {
  return new Router({
    routes: [
      { path: "/", component: Home },
      { path: "/about", component: About },
      { path: "/test", component: Test }
    ]
  });
}