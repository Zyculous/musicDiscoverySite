<template>
  <div class="organize-view">
    <div>
      <input class="search-bar" type="text" placeholder="Search songs" />
      <div class="song-listing">
        <div v-for="n in 8" :key="n" class="skeleton-box">
          <div class="skeleton-title"></div>
          <div class="skeleton-content"></div>
          <div class="skeleton-content-2"></div>
        </div>
      </div>
    </div>
    <div class="category-listing">
      <div v-if="!categoriesLoaded">
        <div v-for="n in 30" :key="n" class="skeleton-content-2" :style="{ marginLeft: `${Math.random() * 20}%`, width: `${100 - Math.random() * 20}%` }"></div>
      </div>
      <div v-else>
        <div class="category" v-for="category in categories" :key="category.id">
          <div @click="toggleCategory(category.id)" class="category-title">
            {{ category.name }}
          </div>
          <div v-if="category.open" class="tags">
            <div v-for="tag in category.tags" :key="tag.id" class="tag">
              {{ tag.name }}
              <button class="remove-tag-btn" @click="removeTag(category.id, tag.id)">
                ✖
              </button>
            </div>
            <div class="add-tag">
              <input class="add-tag-input" v-model="category.newTag" placeholder="Add a tag" @keypress="handleKeyPress($event, category.id)" />
              <button @click="addTag(category.id)" class="add-tag-btn">
                ✔
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="playlist-listing">

    </div>
  </div>
</template>

<script>
export default {
  name: 'OrganizeView',
  data() {
    return {
      categories: [],
      categoriesLoaded: false,
      newTag: '',
      dropdownOpen: false
    };
  },
  mounted() {
    // Simulate fetching data from the server
    setTimeout(() => {
      this.categories = [
        { id: 1, name: 'Category 1', open: false, tags: [], newTag: '' },
        { id: 2, name: 'Category 2', open: false, tags: [], newTag: '' },
        // Add more categories as needed
      ];
      this.categoriesLoaded = true;
    }, 2000); // Simulate a 2-second delay
  },
  methods: {
    toggleCategory(id) {
      const category = this.categories.find(category => category.id === id);
      category.open = !category.open;
    },
    addTag(categoryId) {
      const category = this.categories.find(category => category.id === categoryId);
      if (category.newTag.trim()) {
      category.tags.push({ id: Date.now(), name: category.newTag });
      category.newTag = '';
      }
    },
    removeTag(categoryId, tagId) {
      const category = this.categories.find(category => category.id === categoryId);
      category.tags = category.tags.filter(tag => tag.id !== tagId);
    },
    handleKeyPress(event, categoryId) {
      if (event.key === 'Enter') {
      this.addTag(categoryId);
      }
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    }
  }
};
</script>

<style scoped>
.organize-view {
  position: absolute;
  top: 0;
  left: 3%;
  width: 96%;
  height: 100%;
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    "left right-top"
    "left right-bottom";
  gap: 16px;
  padding: 16px;
}

.song-listing {
  grid-area: left;
}
.search-bar {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  background-color: #282828; /* Spotify light background */
}
.category-listing {
  grid-area: right-top;
  width: 400px;
  border: /* Spotify border color */ 2px solid #282828;
  padding: 10px;
  border-radius: 10px;
}
.add-tag-input{
  padding: 5px;
  border-radius: 4px;
  background-color: #282828; /* Spotify light background */
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
  color: #1DB954; /* White text */
  border: none;
  padding: 5px;
  cursor: pointer;
  border-radius: 4px;
}
.playlist-listing {
  grid-area: right-bottom;
}
.song-listing {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 16px;
}

.skeleton-box {
  width: 100%;
  height: 300px;
  background-color: #181818; /* Dark gray background */
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.skeleton-title {
  width: 60%;
  height: 20px;
  background-color: #282828; /* Slightly lighter gray */
  margin-bottom: 8px;
  border-radius: 4px;
}

.skeleton-content {
  width: 100%;
  height: 150px;
  background-color: #282828; /* Slightly lighter gray */
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-content-2 {
  width: 100%;
  height: 10px;
  background-color: #282828; /* Slightly lighter gray */
  border-radius: 4px;
  margin-bottom: 10px;
}

.dropdown-btn {
  background-color: #1DB954; /* Spotify green */
  color: #FFFFFF; /* White text */
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
}

.dropdown-btn:hover {
  background-color: #1ED760; /* Lighter green */
}

.dropdown-content {
  margin-top: 10px;
  background-color: #282828; /* Slightly lighter gray */
  border-radius: 4px;
  padding: 10px;
}

.dropdown-content ul {
  list-style-type: none;
  padding: 0;
}

.dropdown-content li {
  padding: 5px 0;
  color: #FFFFFF; /* White text */
}
</style>
