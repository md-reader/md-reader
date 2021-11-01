import App from './components/app.svelte'
import './index.css'
import '@smui/radio/bare.css'
import '@smui/switch/bare.css'
import '@smui/button/bare.css'
import '@smui/chips/bare.css'
import '@smui/select/bare.css'
import '@smui/form-field/bare.css'

const app = new App({
  target: document.body,
})

export default app
