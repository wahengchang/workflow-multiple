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
    <header class="header-bar" role="banner">
      <div class="header-gradient">
        <span class="header-title" aria-label="App Title">Content Rewrite Assistant</span>
        <nav class="header-controls" aria-label="Main Navigation">
          <button class="header-btn" @click="openSettings" aria-label="Settings">⚙️ Settings</button>
        </nav>
      </div>
      <SettingsModal :show="showSettings" @close="closeSettings" />
    </header>
  `
};
