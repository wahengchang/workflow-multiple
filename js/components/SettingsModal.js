// SettingsModal.js
// Simple modal for settings
const { ref, watch } = Vue;

export default {
  name: 'SettingsModal',
  props: ['show'],
  emits: ['close'],
  setup(props, { emit }) {
    const apiKey = ref('');
    const saved = ref(false);

    // Load API key from localStorage when modal opens
    watch(() => props.show, (show) => {
      if (show) {
        apiKey.value = localStorage.getItem('openai_api_key') || '';
        saved.value = false;
      }
    });

    function saveApiKey() {
      localStorage.setItem('openai_api_key', apiKey.value);
      saved.value = true;
    }
    function closeModal() {
      emit('close');
    }
    return { apiKey, saved, saveApiKey, closeModal };
  },
  template: `
    <div v-if="show" class="modal-overlay">
      <div class="modal-content">
        <h2 class="modal-title">Settings</h2>
        <div class="modal-body">
          <label for="api-key-input">OpenAI API Key:</label>
          <input id="api-key-input" v-model="apiKey" type="password" class="modal-input" placeholder="Enter API Key" />
          <button class="modal-save-btn" @click="saveApiKey">Save</button>
          <span v-if="saved" class="modal-saved-msg">Saved!</span>
        </div>
        <button class="modal-close-btn" @click="closeModal">Close</button>
      </div>
    </div>
  `
};
