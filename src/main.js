import Vue from 'vue';
import App from './App.vue';

// Provide a fallback token if .env is not set up
window.MAPBOX_TOKEN = process.env.VUE_APP_MAPBOX_TOKEN
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app'); 