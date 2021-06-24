
import { createApp } from 'vue'
import App from './App.vue';

import PrimeVue from 'primevue/config';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Card from 'primevue/card';
import ToggleButton from 'primevue/togglebutton';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
//We can import different themes, a list of available themes is on the PrimeVue website
import 'primevue/resources/themes/md-dark-indigo/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(App);

app.use(PrimeVue);
app.use(ToastService);
app.component("TabView", TabView)
app.component("TabPanel", TabPanel)
app.component("Splitter", Splitter)
app.component("SplitterPanel", SplitterPanel)
app.component("ToggleButton", ToggleButton)
app.component('Card', Card);
app.component('InputText', InputText);
app.component('Button', Button);
app.component('Toast', Toast);

app.mount('#app')