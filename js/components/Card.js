// Card.js: Vue component for user input and API call
const { ref, onMounted } = Vue;
import callOpenAIApi from '../utils/api.js';

export default {
  name: 'Card',
  props: {
    index: { type: [Number, String], required: true }
  },
  setup(props) {
    const prompt = ref('');
    const loading = ref(false);
    const result = ref(null);
    const error = ref(null);

    // Unique key for this card in localStorage (now uses index)
    const storageKey = `card-storage-${props.index}`;

    // Load saved state on mount
    onMounted(() => {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (typeof parsed.prompt === 'string') prompt.value = parsed.prompt;
          if (typeof parsed.result === 'string') result.value = parsed.result;
        } catch (e) {
          // Ignore parse errors
        }
      }
    });

    async function handleStartWorking() {
      error.value = null;
      loading.value = true;
      try {

        console.log('handleStartWorking:')
        
        const apiKey = localStorage.getItem('openai_api_key') 
      
        if (!apiKey || apiKey === 'YOUR_OPENAI_API_KEY') {
          throw new Error('Please set your OpenAI API key first. Click the settings button on the top right.');
          return;
        }
        console.log('storageKey:', storageKey)
        console.log('prompt:', prompt)
        localStorage.setItem(storageKey, JSON.stringify({ prompt: prompt.value }));
      
        const response = await callOpenAIApi(prompt.value, {storageKey});
        result.value = response;
        // Save to localStorage
        localStorage.setItem(storageKey, JSON.stringify({ prompt: prompt.value, result: response }));

      } catch (e) {
        error.value = 'API error: ' + (e.message || e);
      } finally {
        loading.value = false;
      }
    }

    return { prompt, loading, result, error, handleStartWorking };
  },
  template: `
    <div class="card">
      <textarea v-model="prompt" placeholder="Enter your text here..." rows="4" class="card-input"></textarea>
      <button @click="handleStartWorking" :disabled="loading" class="card-btn">
        <span v-if="loading">Working...</span>
        <span v-else>Start Working</span>
      </button>
      <div v-if="error" class="card-error">{{ error }}</div>
      <div v-if="result" class="card-result">{{ result }}</div>
    </div>
  `
};
