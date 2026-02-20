import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'amfe-flexible';
import{Button,Image as VanImage,Uploader,Field,CellGroup,NavBar,Picker,Popup} from 'vant';
import 'vant/lib/index.css';
import { createPinia } from 'pinia';
const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(Button);
app.use(VanImage);
app.use(Uploader);
app.use(Field);
app.use(CellGroup);
app.use(NavBar);
app.use(Picker);
app.use(Popup);
app.mount('#app');