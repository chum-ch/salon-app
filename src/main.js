import './assets/main.css'
import '/node_modules/primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import axios from "axios";
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import App from './App.vue'
import API from "./api/api";
import ConstanceVariable from "@/helpers/constanceVariable";
import HelperFun from "@/helpers/helperFun";
import Store from "@/stores/store";

import router from './router'
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import Button from "primevue/button"
import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Password from 'primevue/password';
import InputNumber from 'primevue/inputnumber';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Menu from 'primevue/menu';
import Drawer from 'primevue/drawer';
import Avatar from 'primevue/avatar';
import Badge from 'primevue/badge';
import OverlayBadge from 'primevue/overlaybadge';
import RadioButton from 'primevue/radiobutton';
import RadioButtonGroup from 'primevue/radiobuttongroup';
import InputOtp from 'primevue/inputotp';
import Checkbox from 'primevue/checkbox';
import CheckboxGroup from 'primevue/checkboxgroup';
import Tooltip from 'primevue/tooltip';
import DatePicker from 'primevue/datepicker';
import Skeleton from 'primevue/skeleton';

// My Customs
import CustomButton from "./components/customs/CustomButton.vue";
import CustomDialog from "./components/customs/CustomDialog.vue";
import CustomCard from "./components/customs/CustomCard.vue";
import CustomMenu from "./components/customs/CustomMenu.vue";
import CustomDropdown from "./components/customs/CustomDropdown.vue";
import CustomFullCalender from "./components/customs/CustomFullCalender.vue";
import CustomTable from './components/customs/CustomTable.vue';
const pinia = createPinia()
const app = createApp(App)

// Config Axios
axios.interceptors.request.use(
  (config) => {
    // Add authentication headers to the request
    // const token = localStorage.getItem('token'); // Replace with your authentication token retrieval logic
    // if (token) {
    //   // config.headers.Authorization = `Bearer ${token}`;
    // }
    config.headers.Authorization = "Bearer";
    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);
// axios.defaults.baseURL = "http://localhost:3000";
// axios.defaults.baseURL = 'https://svc-sms.onrender.com'
// axios.defaults.baseURL = 'https://chum-api.onrender.com'
// if (import.meta.env.PROD) {
//   // axios.defaults.baseURL = 'https://svc-sms.onrender.com'
//   axios.defaults.baseURL = "https://chum-api.onrender.com";
// } else {
//   axios.defaults.baseURL = "http://localhost:3000";
// }

app.component('PriButton', Button);
app.component('PriToast', Toast);
app.component('PriInputText', InputText);
app.component('PriMessage', Message);
app.component('PriPassword', Password);
app.component('PriInputNumber', InputNumber);
app.component('PriCard', Card);
app.component('PriTag', Tag);
app.component('PriMenu', Menu);
app.component('PriDrawer', Drawer);
app.component('PriAvatar', Avatar);
app.component('PriBadge', Badge);
app.component('PriOverlayBadge', OverlayBadge);
app.component('PriRadioButton', RadioButton);
app.component('PriRadioButtonGroup', RadioButtonGroup);
app.component('PriInputOtp', InputOtp);
app.component('PriCheckbox', Checkbox);
app.component('PriCheckboxGroup', CheckboxGroup);
app.component('PriDatePicker', DatePicker);
app.component('PriSkeleton', Skeleton);
// Customs
app.component("CustomButton", CustomButton);
app.component("CustomDialog", CustomDialog);
app.component("CustomCard", CustomCard);
app.component("CustomMenu", CustomMenu);
app.component("CustomDropdown", CustomDropdown);
app.component("CustomFullCalender", CustomFullCalender);
app.component("CustomTable", CustomTable);
app.directive('tooltip', Tooltip);
app.provide("$api", API(axios));
app.provide("$constanceVariable", ConstanceVariable);
app.provide("$helperFun", HelperFun);
app.provide("$store", Store);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.use(router)
app.use(ToastService);
app.use(pinia)
app.mount('#app')
