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
import 'primevue/resources/themes/md-dark-deeppurple/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
const app = createApp(App)
// createApp(App).use(router).mount('#app')
app.use(router)
app.use(PrimeVue)
app.use(ConfirmationService)
app.use(ToastService)
app.mount('#app')

app.component('ConfirmDialog', ConfirmDialog)
app.component('Toast', Toast)
app.component('Splitter', Splitter)
app.component('SplitterPanel', SplitterPanel)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)