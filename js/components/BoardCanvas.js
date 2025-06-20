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
          <Card :index="i-1" :active="i === 1" />
        </template>
      </div>
    </main>
  `
};
