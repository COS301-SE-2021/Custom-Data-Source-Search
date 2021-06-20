import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/all.css'
import ElementPlus from "element-plus";
import './theme/index.css'

createApp(App).use(router).use(ElementPlus).mount('#app')
