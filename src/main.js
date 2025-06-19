import './assets/main.css'
import '/node_modules/primeflex/primeflex.css'
import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import App from './App.vue'
import router from './router'
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import Button from "primevue/button"
import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Password from 'primevue/password';

const app = createApp(App)

app.component('PriButton', Button);
app.component('PriToast', Toast);
app.component('PriInputText', InputText);
app.component('PriMessage', Message);
app.component('PriPassword', Password);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(router)
app.use(ToastService);
app.mount('#app')
