
import { createApp } from 'vue'
import ConfirmationService from 'primevue/confirmationservice';
import App from './App.vue';
import router from './router'
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
import FileUpload from 'primevue/fileupload';
import Sidebar from 'primevue/sidebar';
import ConfirmDialog from 'primevue/confirmdialog'
//We can import different themes, a list of available themes is on the PrimeVue website. I've edited the below theme to include our primary colour
//There are a few more instances of the original purple that would need to be altered.
import './assets/_theme.scss';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(App);

app.use(PrimeVue);
app.use(ToastService);
app.use(router);
app.use(ConfirmationService);
app.component("ConfirmDialog", ConfirmDialog)
app.component("Sidebar", Sidebar)
app.component("FileUpload", FileUpload)
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