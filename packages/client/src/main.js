import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ConfirmDialog from 'primevue/confirmdialog'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import '../src/assets/themes/style.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import Sidebar from "primevue/sidebar";
import Tooltip from 'primevue/tooltip';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const app = createApp(App);
app.use(router);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);
app.mount('#app');
app.component('ConfirmDialog', ConfirmDialog);
app.component('Toast', Toast);
app.component('Splitter', Splitter);
app.component('SplitterPanel', SplitterPanel);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('Sidebar', Sidebar);
app.directive('tooltip', Tooltip);
app.component('InputText', InputText);
app.component("Button", Button)