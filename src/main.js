import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { createPinia } from "pinia";
import i18n from './i18n';
import './style.css'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

const pinia = createPinia();

createApp(App)
  .use(router)
  .use(pinia)
  .use(i18n)
  .use(Antd)
  .mount('#app')
