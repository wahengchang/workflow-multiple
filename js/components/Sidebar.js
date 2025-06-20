// Sidebar.js
// Metallic gray sidebar with Undo glyph and Add Card dropdown

export default {
  name: 'Sidebar',
  template: `
    <aside class="sidebar" role="complementary" aria-label="Sidebar">
      <div class="sidebar-undo">
        <span class="undo-glyph">&#8630;</span>
        <span class="sidebar-label">Undo</span>
      </div>
      <div class="sidebar-add-card">
        <button class="add-card-btn">Add Card ▼</button>
      </div>
    </aside>
  `
};
