// Card.js: Vue component for user input and API call
const { ref, reactive, onMounted, watch } = Vue;
import callOpenAIApi, { buildOpenAIMessages } from '../utils/api.js';

export default {
  name: 'Card',
  props: {
    index: { type: [Number, String], required: true },
    active: { type: Boolean, default: false }
  },
  setup(props) {
    const isEditing = ref(false);
    const textareaRef = ref(null);
    const prompt = ref('');
    const loading = ref(false);
    const result = ref(null);
    const error = ref(null);

    // Utility: Resolve {{outputN}} in prompt with that card's result
    function resolvePrompt(rawPrompt) {
      return rawPrompt.replace(/\{\{output(\d+)\}\}/g, (match, idx) => {
        try {
          const data = localStorage.getItem(`card-storage-${idx}`);
          if (data) {
            const parsed = JSON.parse(data);
            if (parsed.result) {
              console.log(`resolvePrompt: {{output${idx}}} resolved to:`, parsed.result);
              return parsed.result;
            } else {
              console.warn(`resolvePrompt: {{output${idx}}} found, but no result.`);
              return '[No output]';
            }
          }
        } catch (e) {
          console.error(`resolvePrompt: error resolving {{output${idx}}}:`, e);
        }
        return '[No output]';
      });
    }

    // Collapsible config section
    const configOpen = ref(false);
    const config = reactive({
      systemPrompt: 'You are a helpful assistant.',
      model: 'gpt-4.1',
      temperature: 0.2,
      top_p: 0.9,
      presence_penalty: 0,
      frequency_penalty: 1,
      max_tokens: 200
    });

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
          if (parsed.config && typeof parsed.config === 'object') {
            Object.assign(config, parsed.config);
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    });

    // Watch config for changes and persist
    watch(config, (newConfig) => {
      const saved = localStorage.getItem(storageKey);
      let parsed = {};
      if (saved) {
        try { parsed = JSON.parse(saved) || {}; } catch {}
      }
      parsed.config = { ...newConfig };
      parsed.prompt = prompt.value;
      parsed.result = result.value;
      localStorage.setItem(storageKey, JSON.stringify(parsed));
    }, { deep: true });

    async function handleStartWorking() {
      error.value = null;
      loading.value = true;
      try {
        const apiKey = localStorage.getItem('openai_api_key') 
      
        if (!apiKey || apiKey === 'YOUR_OPENAI_API_KEY') {
          throw new Error('Please set your OpenAI API key first. Click the settings button on the top right.');
          return;
        }
        console.log('storageKey:', storageKey)
        console.log('prompt:', prompt)
        localStorage.setItem(storageKey, JSON.stringify({ prompt: prompt.value }));

        // --- Resolve prompt with outputs ---
        const resolvedPrompt = resolvePrompt(prompt.value);

        const response = await callOpenAIApi(resolvedPrompt, config);
        result.value = response;
        // Save to localStorage
        localStorage.setItem(storageKey, JSON.stringify({ prompt: prompt.value, result: response, config: { ...config } }));

      } catch (e) {
        error.value = 'API error: ' + (e.message || e);
      } finally {
        loading.value = false;
      }
    }

    // Auto-expand textarea
    function autoResizeTextarea() {
      const el = textareaRef.value;
      if (el) {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
      }
    }

    // Watch prompt and resize
    watch(prompt, () => {
      autoResizeTextarea();
    });
    // Also resize on mount
    onMounted(() => {
      autoResizeTextarea();
    });

    return { prompt, loading, result, error, handleStartWorking, configOpen, config, isEditing, textareaRef };
  },
  template: `
    <div :class="['card', { 'card-active': active, 'card-editing': isEditing }]"
         :style="{
           background: '#fff',
           border: '1.5px solid #d3d3d3',
           borderRadius: '12px',
           boxShadow: isEditing ? '0 0 0 3px #6cf' : '0 2px 8px #0001',
           transition: 'box-shadow 0.2s, border-color 0.2s'
         }">

      <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center;">
          <span class="card-step-icon">📝</span>
          <span class="card-step-label">Step {{ Number(index) + 1 }}</span>
        </div>
        <button class="card-close-btn" @click="$emit('close')" style="background: none; border: none; font-size: 1.2em; cursor: pointer;">✕</button>
      </div>
      <div class="card-content">
        <!-- Collapsible Config Section -->
        <div class="card-config-section">
          <button @click="configOpen = !configOpen" class="card-config-toggle" :aria-expanded="configOpen" :aria-controls="'card-config-'+index">
            <span class="chevron" :class="{ open: configOpen }">&#9662;</span>
            <span>{{ configOpen ? 'Hide' : 'Show' }} Model Config</span>
          </button>
          <div v-if="configOpen" :id="'card-config-'+index" class="card-config-collapse">
            <div class="card-config-fields" style="display: flex; flex-direction: column; gap: 8px;">
              <label class="card-config-label">
                System Prompt:
                <input v-model="config.systemPrompt" class="card-config-input" type="text" style="width: 260px;" />
              </label>
              <label class="card-config-label">
                Model:
                <input v-model="config.model" class="card-config-input" type="text" style="width: 260px;" />
              </label>
              <label class="card-config-label">
                Temperature:
                <input v-model.number="config.temperature" class="card-config-input" type="number" step="0.01" min="0" max="2" style="width: 120px;" />
              </label>
              <label class="card-config-label">
                Top P:
                <input v-model.number="config.top_p" class="card-config-input" type="number" step="0.01" min="0" max="1" style="width: 120px;" />
              </label>
              <label class="card-config-label">
                Presence Penalty:
                <input v-model.number="config.presence_penalty" class="card-config-input" type="number" step="0.01" min="-2" max="2" style="width: 120px;" />
              </label>
              <label class="card-config-label">
                Frequency Penalty:
                <input v-model.number="config.frequency_penalty" class="card-config-input" type="number" step="0.01" min="-2" max="2" style="width: 120px;" />
              </label>
              <label class="card-config-label">
                Max Tokens:
                <input v-model.number="config.max_tokens" class="card-config-input" type="number" min="1" max="4096" style="width: 120px;" />
              </label>
            </div>
          </div>
        </div>
        <!-- End Config Section -->
        <textarea v-model="prompt" placeholder="Enter your text here..." rows="4" class="card-input"
          ref="textareaRef"
          @focus="isEditing = true" @blur="isEditing = false"
          @input="autoResizeTextarea"
        ></textarea>
        <button @click="handleStartWorking" :disabled="loading" class="card-btn">
          <span v-if="loading">Working...</span>
          <span v-else>Start Working</span>
        </button>
        <div v-if="error" class="card-error">{{ error }}</div>
        <div v-if="result" class="card-result">{{ result }}</div>
      </div>
    </div>
  `
};
