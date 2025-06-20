// BoardCanvas.js
// Main dotted wallpaper area with horizontal scroll and column frames
const { ref } = Vue;
import Card from '../components/Card.js';

export default {
  name: 'BoardCanvas',
  components: { Card },
  setup() {
    const maxCards = 5;
    const visibleCards = ref(1);

    // On mount: check localStorage for existing card-storage-{i}
    if (typeof window !== 'undefined' && window.localStorage) {
      let count = 0;
      for (let i = 0; i < maxCards; i++) {
        if (localStorage.getItem(`card-storage-${i}`)) {
          count = i + 1;
        }
      }
      if (count > 0) visibleCards.value = count;
    }

    const addCard = () => {
      if (visibleCards.value < maxCards) visibleCards.value++;
    };
    return { visibleCards, maxCards, addCard };
  },
  template: `
    <main class="board-canvas">
      <div class="canvas-scroll" style="display: flex; align-items: flex-start;">
        <template v-for="i in visibleCards" :key="i">
          <Card :index="i-1" :active="i === visibleCards" />
        </template>
        <button
          v-if="visibleCards < maxCards"
          class="add-card-btn"
          style="margin-left: 16px; height: 160px; align-self: stretch;"
          @click="addCard"
        >
          ➕ Add Card
        </button>
      </div>
    </main>
  `
};
