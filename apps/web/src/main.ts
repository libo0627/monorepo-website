import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Vant from 'vant';
import 'vant/lib/index.css';
import App from './App.vue';
import router from './router';
import { arClass } from './directives/arClass';
import cfAudio from './components/cf-audio.vue';
import './style.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(Vant);
app.directive('arClass', arClass);
// 活动模板里直接写 <cfAudio />，这里全局注册
app.component('cfAudio', cfAudio);
app.mount('#app');
