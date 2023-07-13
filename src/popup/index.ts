import App from './components/app.svelte'
import './index.css'
import '@smui/switch/bare.css'
import '@smui/button/bare.css'
import '@smui/tooltip/bare.css'
import '@smui/select/bare.css'
import '@smui/form-field/bare.css'
import '@smui/segmented-button/bare.css'

const app = new App({
  target: document.body,
})

export default app
