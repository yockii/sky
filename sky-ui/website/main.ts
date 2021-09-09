import { createApp } from 'vue'
import App from './App.vue'
import skyui from '../src/install-skyui'
import './index.css'
import '../src/css/index.scss'

createApp(App)
  .use(skyui)
  .mount('#app')
