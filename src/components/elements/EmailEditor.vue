<script setup>
import { ref, onMounted } from 'vue';
import Sortable from 'sortablejs';

const editorRef = ref(null);
const emailBlocks = ref([
  { id: 1, type: 'text', content: 'Your text here...' },
  { id: 2, type: 'image', content: 'https://via.placeholder.com/300' },
  { id: 3, type: 'button', content: 'Click Me' }
]);

// Initialize Drag & Drop
onMounted(() => {
  Sortable.create(editorRef.value, {
    animation: 150,
    onEnd(event) {
      const movedBlock = emailBlocks.value.splice(event.oldIndex, 1)[0];
      emailBlocks.value.splice(event.newIndex, 0, movedBlock);
    }
  });
});

// Add New Block
const addBlock = (type) => {
  const newBlock = { id: Date.now(), type, content: type === 'text' ? 'New text' : '' };
  emailBlocks.value.push(newBlock);
};

// Remove Block
const removeBlock = (index) => {
  emailBlocks.value.splice(index, 1);
};

// Export HTML
const exportHtml = () => {
  let html = emailBlocks.value.map(block => {
    if (block.type === 'text') return `<p>${block.content}</p>`;
    if (block.type === 'image') return `<img src="${block.content}" width="100%">`;
    if (block.type === 'button') return `<button style="padding:10px; background:#007bff; color:#fff;">${block.content}</button>`;
  }).join('');

  console.log(html);
  return html;
};
</script>

<template>
  <div class="email-builder">
    <!-- Toolbar -->
    <div class="toolbar">
      <button @click="addBlock('text')">Add Text</button>
      <button @click="addBlock('image')">Add Image</button>
      <button @click="addBlock('button')">Add Button</button>
      <button @click="exportHtml">Export HTML</button>
    </div>

    <!-- Email Editor -->
    <div ref="editorRef" class="editor">
      <div v-for="(block, index) in emailBlocks" :key="block.id" class="block">
        <template v-if="block.type === 'text'">
          <textarea v-model="block.content"></textarea>
        </template>
        <template v-if="block.type === 'image'">
          <input v-model="block.content" type="text" placeholder="Image URL">
          <img :src="block.content" alt="Image Preview">
        </template>
        <template v-if="block.type === 'button'">
          <input v-model="block.content" type="text" placeholder="Button Text">
          <button>{{ block.content }}</button>
        </template>
        <button @click="removeBlock(index)">❌ Remove</button>
      </div>
    </div>
  </div>
</template>

<style>
.email-builder {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.toolbar {
  display: flex;
  gap: 10px;
}
.editor {
  border: 1px solid #ddd;
  padding: 10px;
  min-height: 300px;
}
.block {
  background: #f4f4f4;
  padding: 10px;
  margin-bottom: 5px;
}
textarea, input {
  width: 100%;
  margin-bottom: 5px;
}
</style>

