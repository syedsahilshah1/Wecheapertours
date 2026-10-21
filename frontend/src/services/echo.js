import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

let echoInstance = null;

export const getEcho = () => {
  if (echoInstance) return echoInstance;

  try {
    const wsHost = import.meta.env.VITE_REVERB_HOST || window.location.hostname || 'localhost';
    const wsPort = import.meta.env.VITE_REVERB_PORT || 8080;
    const key = import.meta.env.VITE_REVERB_APP_KEY || 'wecheaper_reverb_key';
    const scheme = import.meta.env.VITE_REVERB_SCHEME || 'http';

    echoInstance = new Echo({
      broadcaster: 'reverb',
      key: key,
      wsHost: wsHost,
      wsPort: Number(wsPort),
      wssPort: Number(wsPort),
      forceTLS: scheme === 'https',
      enabledTransports: ['ws', 'wss'],
      disableStats: true,
    });
  } catch (err) {
    console.warn('Reverb WebSocket initialization notice:', err);
  }

  return echoInstance;
};

export default getEcho;
