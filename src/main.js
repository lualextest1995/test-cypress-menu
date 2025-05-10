import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import permissionDirective from '@/directives/permission'
import elementDirective from '@/directives/element'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.directive('permission', permissionDirective)
app.directive('element', elementDirective)

app.mount('#app')
