import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { auth } from './lib/auth'
import { bootstrap } from './bootstrap'

bootstrap({ App, auth, createApp, router })
