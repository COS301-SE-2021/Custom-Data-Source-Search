import {createApp} from 'vue'
import App from './App.vue'
import Vuex from "vuex";
import router from './router'
import store from "@/store/Store";
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
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
import Dropdown from 'primevue/dropdown';
import ScrollPanel from 'primevue/scrollpanel';
import FileUpload from "primevue/fileupload";
import Dialog from "primevue/dialog";
import Password from "primevue/password";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import MultiSelect from 'primevue/multiselect';
import OverlayPanel from 'primevue/overlaypanel';
import Tag from 'primevue/tag';
import Chip from 'primevue/chip';
import Ripple from 'primevue/ripple';
import BadgeDirective from "primevue/badgedirective";
import Divider from 'primevue/divider';
import InputSwitch from 'primevue/inputswitch';
import Toolbar from "primevue/toolbar";
import SplitButton from "primevue/splitbutton";
import SelectButton from "primevue/selectbutton";
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import ContextMenu from "primevue/contextmenu";
import RadioButton from "primevue/radiobutton";
import Menu from 'primevue/menu';
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";


const app = createApp(App);
app.use(router);
app.use(store);
app.use(ConfirmationService);
app.use(ToastService);
app.use(PrimeVue, {ripple: true});
app.use(Vuex);
app.mount('#app');
app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);
app.directive('ripple', Ripple);
app.component("Button", Button);
app.component('ConfirmDialog', ConfirmDialog);
app.component("Checkbox", Checkbox);
app.component("Column", Column);
app.component("ColumnGroup", ColumnGroup);
app.component("Chip", Chip);
app.component("Dialog", Dialog);
app.component('Divider', Divider);
app.component("DataTable",DataTable);
app.component("Dropdown", Dropdown);
app.component('Toast', Toast);
app.component('Splitter', Splitter);
app.component('SplitterPanel', SplitterPanel);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('Sidebar', Sidebar);
app.component('InputText', InputText);
app.component("ScrollPanel", ScrollPanel);
app.component("FileUpload", FileUpload);
app.component("MultiSelect", MultiSelect);
app.component("OverlayPanel", OverlayPanel);
app.component("Tag", Tag);
app.component("Password", Password);
app.component('InputSwitch', InputSwitch);
app.component('Toolbar', Toolbar);
app.component('SplitButton', SplitButton);
app.component('SelectButton', SelectButton);
app.component('InputNumber', InputNumber);
app.component('Textarea', Textarea);
app.component('ContextMenu', ContextMenu);
app.component('RadioButton', RadioButton);
app.component('Menu', Menu);
app.component('Accordion', Accordion);
app.component('AccordionTab', AccordionTab);
