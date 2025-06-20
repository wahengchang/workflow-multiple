// BoardCanvas.js
// Main dotted wallpaper area with horizontal scroll and column frames
import Card from '../components/Card.js';

export default {
  name: 'BoardCanvas',
  components: { Card },
  template: `
    <main class="board-canvas">
      <div class="canvas-scroll">
        <template v-for="i in 3" :key="i">
          <Card :index="i-1" />
          <span v-if="i < 3" class="arrow-connector">
            <svg width="16" height="16"><path d="M0 8 H14 L10 4 M14 8 L10 12" stroke="#000" stroke-width="2" fill="none"/></svg>
          </span>
        </template>
      </div>
    </main>
  `
};
