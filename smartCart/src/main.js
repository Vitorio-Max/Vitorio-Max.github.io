import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Error registrando Service Worker:', err);
    });
  });
}

createApp(App).mount('#app');