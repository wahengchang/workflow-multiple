// HeaderBar.js
// Retro-futuristic top bar with gradient, app name, and Home/Settings buttons

import SettingsModal from './SettingsModal.js';
const { ref } = Vue;

export default {
  name: 'HeaderBar',
  components: { SettingsModal },
  setup() {
    const showSettings = ref(false);
    function openSettings() { showSettings.value = true; }
    function closeSettings() { showSettings.value = false; }
    return { showSettings, openSettings, closeSettings };
  },
  template: `
    <header class="header-bar">
      <div class="header-gradient">
        <span class="header-title">Content Rewrite Assistant</span>
        <div class="header-controls">
          <button class="header-btn">Home</button>
          <button class="header-btn" @click="openSettings">Settings</button>
        </div>
      </div>
      <SettingsModal :show="showSettings" @close="closeSettings" />
    </header>
  `
};
