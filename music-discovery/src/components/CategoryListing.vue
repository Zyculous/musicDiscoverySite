<template>
  <div class="category-listing">
    <div v-if="!categoriesLoaded">
      <div
        v-for="n in 30"
        :key="n"
        class="skeleton-content-2"
        :style="{ marginLeft: `${Math.random() * 20}%`, width: `${100 - Math.random() * 20}%` }"
      ></div>
    </div>
    <div v-else>
      <div class="category" v-for="category in categories" :key="category.id">
        <div class="category-header">
          <div @click="toggleCategory(category.id)" class="category-title">
            {{ category.name }}
          </div>
          <button class="remove-category-btn" @click="removeCategory(category.id)">✖</button>
        </div>
        <div v-if="category.open" class="tags">
          <div
            v-for="tag in category.tags"
            :key="tag.id"
            class="tag"
            draggable="true"
            @dragstart="onDragStart($event, tag)"
            @drag="onDrag($event)"
          >
            {{ tag.name }}
            <button class="remove-tag-btn" @click="removeTag(category.id, tag.id)">✖</button>
          </div>
          <div class="add-tag">
            <input
              class="add-tag-input"
              v-model="category.newTag"
              placeholder="Add a tag"
              @keypress="handleKeyPress($event, category.id)"
            />
            <input type="color" v-model="tagColor" @input="changeTagColor" />
            <button @click="addTag(category.id)" class="add-tag-btn">✔</button>
          </div>
        </div>
      </div>
      <div class="add-category">
        <input
          class="add-category-input"
          v-model="newCategory"
          placeholder="Add a category"
          @keypress="handleCategoryKeyPress($event)"
        />
        <button @click="addCategory" class="add-category-btn">✔</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    categories: Array,
    categoriesLoaded: Boolean,
  },
  data() {
    return {
      newCategory: '',
      tagColor: '#1DB954', // Default tag color
    };
  },
  methods: {
    toggleCategory(id) {
      const category = this.categories.find(cat => cat.id === id);
      if (category) {
        category.open = !category.open;
      }
    },
    removeCategory(categoryId) {
      this.$emit('remove-category', categoryId);
    },
    addTag(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId);
      if (category && category.newTag.trim()) {
        category.tags.push({ id: Date.now(), name: category.newTag, color: this.tagColor });
        category.newTag = '';
      }
    },
    removeTag(categoryId, tagId) {
      const category = this.categories.find(cat => cat.id === categoryId);
      if (category) {
        category.tags = category.tags.filter(tag => tag.id !== tagId);
      }
    },
    handleKeyPress(event, categoryId) {
      if (event.key === 'Enter') {
        this.addTag(categoryId);
      }
    },
    handleCategoryKeyPress(event) {
      if (event.key === 'Enter') {
        this.addCategory();
      }
    },
    addCategory() {
      if (!this.newCategory.trim()) return;
      this.$emit('add-category', this.newCategory);
      this.newCategory = '';
    },
    changeTagColor(event) {
      this.tagColor = event.target.value;
    },
    onDragStart(event, tag) {
      event.dataTransfer.setData('tag', JSON.stringify(tag));
      event.dataTransfer.effectAllowed = 'move';

      // Create a custom drag image
      const dragImage = document.createElement('div');
      dragImage.classList.add('drag-image');
      dragImage.textContent = tag.name;
      document.body.appendChild(dragImage);

      event.dataTransfer.setDragImage(dragImage, 0, 0);

      // Store the drag image element in the event for later use
      event.dragImage = dragImage;

      // Remove the custom drag image after the drag ends
      event.target.addEventListener('dragend', () => {
        if (document.body.contains(dragImage)) {
          document.body.removeChild(dragImage);
        }
      });
    },
    onDrag(event) {
      const dragImage = event.target.dragImage;
      if (dragImage) {
        dragImage.style.left = `${event.pageX}px`;
        dragImage.style.top = `${event.pageY}px`;
      }
    }
  },
};
</script>

<style scoped>
/* Add your styles here */
.remove-category-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0 8px;
}
.category-listing {
  grid-area: right-top;
  width: 400px;
  border: /* Spotify border color */ 2px solid #282828;
  padding: 10px;
  border-radius: 10px;
}
.tag {
  margin-left: 5%;
}
.add-tag {
  margin-left: 5%;
}
.add-tag-input {
  padding: 5px;
  border-radius: 4px;
  background-color: #282828; /* Spotify light background */
  color: #ffffff; /* White text */
  margin-right: 8px;
}
.remove-tag-btn {
  background-color: #00000000; /* Invisible color */
  color: #ad0101;
  border: none;
  padding: 5px;
  cursor: pointer;
  border-radius: 4px;
}
.add-tag-btn {
  background-color: /*invisible color*/ #28282800;
  color: #1db954; /* White text */
  border: none;
  padding: 5px;
  cursor: pointer;
  border-radius: 4px;
}
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remove-category-btn {
  background: none;
  border: none;
  color: #ad0101;
  cursor: pointer;
  padding: 0 8px;
}

.add-category {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-category-input {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex-grow: 1;
}

.add-category-btn {
  background: none;
  border: none;
  color: #4caf50;
  cursor: pointer;
  padding: 4px 8px;
}
.drag-image {
  display: flex;
  position: fixed !important;
  top: 0;
  left: 0;
  pointer-events: none;
  background: #fff;
  border: 1px solid #ccc;
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: wiggle 0.3s infinite;
}

@keyframes wiggle {
  0%, 100% {
    transform: rotate(-3deg);
  }
  50% {
    transform: rotate(3deg);
  }
}
</style>
