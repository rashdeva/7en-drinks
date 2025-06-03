export const config = {
    isLocalDev: Boolean(import.meta.env.VITE_LOCAL_DEV),
    botName: import.meta.env.VITE_BOT_NAME,
    appUrl: import.meta.env.VITE_APP_URL,
    apiUrl: import.meta.env.VITE_API_URL,
    questTimeout: 1,
    mapboxApiKey: `pk.eyJ1IjoicmFzaDJ4IiwiYSI6ImNseDlsYnY2cjA1MDMyaXIyeHE1em9tYjgifQ.LIRP8qVsj7qE4hOWA15b_Q`
}