<template>
  <div id="app">
    <BasicMap :language="language" @language-change="setLanguage" />
  </div>
</template>

<script>
import BasicMap from './components/BasicMap.vue';

export default {
  name: 'App',
  components: {
    BasicMap
  },
  data() {
    // Detect browser language for initial setting
    const browserLang = navigator.language || navigator.userLanguage; // Includes fallback
    const initialLanguage = browserLang.toLowerCase().startsWith('fr') ? 'fr' : 'en';
    return {
      language: initialLanguage
    }
  },
  methods: {
    setLanguage(lang) {
      this.language = lang;
    }
  }
};
</script>

<style>
@font-face {
  font-family: 'JigsawStencil';
  src: url('./assets/fonts/header.otf') format('opentype');
  font-weight: bold;
  font-style: normal;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Responsive adjustments for mobile */
@media (max-width: 600px) {
  /* Mobile styles here */
}
</style> 