// main.js

import Vue from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import moment from "moment";
// import Chart from 'chart.js';

import VueRouter from "vue-router";
Vue.use(VueRouter);

import VueAxios from "vue-axios";
import axios from "axios";

Vue.use(VueAxios, axios, moment);
Vue.config.productionTip = false;

// import components
import StatsComponent from "./components/StatsComponent.vue";
import IndexComponent from "./components/IndexComponent.vue";

// Define each path for each component
const routes = [
  {
    name: "index",
    path: "/",
    component: IndexComponent
  },
  {
    name: "posts",
    path: "/posts",
    component: StatsComponent
  }
  //   {
  //     name: "posts",
  //     path: `/posts?id=${id}`,
  //     component: StatsComponent
  //   }
];

// set router as VueRouter
const router = new VueRouter({
  mode: "history",
  routes: routes
});

//
// Display component in App.vue
new Vue(Vue.util.extend({ router }, App)).$mount("#app");
