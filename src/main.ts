import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import axios from "axios";
import setupAxios from "./common/axios-client";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.config.globalProperties.$axios = axios;

app.use(createPinia());

setupAxios();
app.use(router);

app.mount("#app");
