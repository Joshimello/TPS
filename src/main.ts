import App from './main.svelte'
import '@fontsource/space-grotesk'
import '@fontsource/ibm-plex-mono'
import '@fontsource/space-grotesk/300.css'
import '@fontsource/material-icons'
import 'virtual:windi.css'

const app = new App({
  target: document.getElementById('app'),
})

export default app
