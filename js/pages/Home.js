import HeaderBar from '../components/HeaderBar.js';
import Sidebar from '../components/Sidebar.js';
import BoardCanvas from '../components/BoardCanvas.js';

export default Vue.defineComponent({
  name: 'Home',
  components: { HeaderBar, Sidebar, BoardCanvas },
  template: `
    <div class="app-root">
      <HeaderBar />
      <div class="main-layout">
        <Sidebar />
        <BoardCanvas />
      </div>
    </div>
  `
});