import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from "element-plus";
import './theme/index.css'

createApp(App).use(router).use(ElementPlus).mount('#app')
