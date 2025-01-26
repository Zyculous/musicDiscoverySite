<template>
  <div class="full-page">
    <div class="organize-view">
      <div>
        <div class="nav-bar">
          <button class="nav-bar-option" :class="{ currentPage: currentPage === 'Search' }" @click="navTo('Search')">Search</button>
          <button class="nav-bar-option" :class="{ currentPage: currentPage === 'Playlists' }" @click="navTo('Playlists')">Playlists</button>
          <button class="nav-bar-option" :class="{ currentPage: currentPage === 'Sorted' }" @click="navTo('Sorted')">Sorted</button>
        </div>
        <SearchView v-if="currentPage === 'Search'"/>
        <PlaylistsView v-if="currentPage === 'Playlists'"/>
      </div>
      <CategoryListing
        :categories="categories"
        :categoriesLoaded="categoriesLoaded"
        @toggle-category="toggleCategory"
        @remove-category="removeCategory"
        @add-tag="addTag"
        @remove-tag="removeTag"
        @add-category="addCategory"
        @drag-start="onDragStart"
      />
    </div>
  </div>
</template>

<script>
const clientId = '45d6d0678f9c4d9cbce9c7e1bbb2bc8f'; // your clientId
import SearchView from '@/components/SearchView.vue';
import PlaylistsView from '@/components/PlaylistsView.vue';
import CategoryListing from '@/components/CategoryListing.vue';
import filter from '../assets/filter.png';
export default {
  components: {
    SearchView,
    PlaylistsView,
    CategoryListing,
  },
  name: 'OrganizeView',
  data() {
    return {
      categories: [],
      categoriesLoaded: false,
      newCategory: '',
      newTag: '',
      dropdownOpen: false,
      searchValue: '',
      searchTypes: ['album', 'artist', 'track'],
      searchLoaded: false,
      searchResults: {},
      filter,
      collapsedTypes: {},
      currentPage: 'Search',
    }
  },
  mounted() {
    // Simulate fetching data from the server
    setTimeout(() => {
      this.categories = [
        {
          id: 1,
          name: 'Category 1',
          open: false,
          tags: [{ id: Math.random() + 1, name: 'tag1' }],
          newTag: '',
        },
        { id: 2, name: 'Category 2', open: false, tags: [], newTag: '' },
        // Add more categories as needed
      ]
      this.categoriesLoaded = true
    }, 2000) // Simulate a 2-second delay
  },
  methods: {
    toggleCategory(id) {
      const category = this.categories.find((category) => category.id === id)
      category.open = !category.open
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
    async refreshToken() {
      const refreshToken = localStorage.getItem('refresh_token');
      const url = " https://accounts.spotify.com/api/token";
      const payload = {
        method : 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId
      }),
      }
      const body = await fetch(url, payload)
      const response = await body.json();
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      const token = localStorage.getItem('refresh_token');
      console.log(token);

      try {
        const response = await fetch('http://localhost:5000/spotifyLogin',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email : localStorage.getItem('userEmail'), code : token})
        });
        const data = await response.json();
        if (response.ok) {
          console.log('Code Storage Successful:', data);
          this.$router.push('/account');
        } else {
          console.error('Storage Failed:', data);
        }
      }
      catch (error) {
        console.error('Storage Failed:', error);
      }

    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen
    },
    async search(event, type, q) {
      if (event.key !== 'Enter') return

      type = type.join('%2C')
      console.log(type)
      try {
        const token = localStorage.getItem('access_token')
          //'BQAAf55dy04RKZ8N3xuRWqKYjho9IXLFLUqHLHB-qFYth8Yfvm2CGxxYyLbPdzAwrpyhz1J9PDuKlJU13M5idV35kRAbNe_di-HNM5q5-stSYmoWbSc' // Get this from your auth system
        const response = await fetch(`https://api.spotify.com/v1/search?q=${q}&type=${type}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        console.log(data)
        this.searchResults = data
        this.searchLoaded = true
      } catch (error) {
        console.error('Search error:', error)
      }
    },
    toggleCollapse(type) {
      this.collapsedTypes[type] = !this.collapsedTypes[type];
    },
    navTo(page) {
      this.currentPage = page;
    },
    addCategory() {
      if (!this.newCategory.trim()) return;
      this.$emit('add-category', this.newCategory);
      this.newCategory = '';
    },
    removeCategory(categoryId) {
      this.$emit('remove-category', categoryId);
    },
    addTag(categoryId) {
      const category = this.categories.find((category) => category.id === categoryId);
      if (category.newTag.trim()) {
        this.$emit('add-tag', categoryId, category.newTag);
        category.newTag = '';
      }
    },
    removeTag(categoryId, tagId) {
      this.$emit('remove-tag', { categoryId, tagId });
    },
    onDragStart({ event, tag }) {
      event.dataTransfer.setData('tag', JSON.stringify(tag));
      event.dataTransfer.effectAllowed = 'move';

      // Create a custom drag image
      const dragImage = document.createElement('div');
      dragImage.classList.add('drag-image');
      dragImage.textContent = tag.name;
      document.body.appendChild(dragImage);

      event.dataTransfer.setDragImage(dragImage, 0, 0);

      // Remove the custom drag image after the drag ends
      event.target.addEventListener('dragend', () => {
        if (document.body.contains(dragImage)) {
          document.body.removeChild(dragImage);
        }
      });

    },
  },
};
</script>

<style scoped>
.organize-view {
  position: relative;
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr;
  grid-template-areas:
    'left right-top'
    'left right-bottom';
  gap: 16px;
  padding: 16px;
}
.drag-image {
  position: absolute;
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
.song-listing {
  grid-area: left;
}
.listedSongs {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
  padding: 8px;
  margin-bottom: 16px;
  height: 100%;
}
.listedAlbums {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  padding: 8px;
  margin-bottom: 16px;
  height: 100%;
}
.listedArtists {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  padding: 8px;
  margin-bottom: 16px;
  height: 100%;
}
.listedItems {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
  padding: 8px;
  margin-bottom: 16px;
  height: 100%;
}
.result-title {
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 0;
}
.result-artists {
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 0;
}
.search-bar {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  background-color: #282828; /* Spotify light background */
  color: #ffffff; /* White text */
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
.search-result {
  width: 100%;
  height: fit-content;
  background-color: #181818; /* Dark gray background */
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr;
}
.search-result-artist {
  width: 100%;
  height: fit-content;
  background-color: #181818; /* Dark gray background */
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.search-result-album {
  width: 100%;
  height: fit-content;
  background-color: #181818; /* Dark gray background */
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}
.search-result-song {
  width: 100%;
  height: fit-content;
  background-color: #181818; /* Dark gray background */
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  justify-content: start;

}
.result-image {
  margin-right: 20px;
  width: 5%;
}
.result-details{
  display: flex;
  flex-direction: row;
  gap: 20px;
}
.result-bb{
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  align-items: flex-start;
}
.filter-options > input {
  margin-right: 10px;
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
  background-color: #1db954; /* Spotify green */
  color: #ffffff; /* White text */
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
}

.dropdown-btn:hover {
  background-color: #1ed760; /* Lighter green */
}

.dropdown-content {
  margin-top: 10px;
  background-color: #282828; /* Slightly lighter gray */
  border-radius: 4px;
  padding: 10px;
  display:flex;
  flex-direction: row;
  justify-content: space-around;
}

.dropdown-content ul {
  list-style-type: none;
  padding: 0;
}

.dropdown-content li {
  padding: 5px 0;
  color: #ffffff; /* White text */
}
.full-page{
  display: flex;
  flex-direction: column;
  top: 0;
  left: 3%;
  width: 96%;
  height: 100%;
  position: absolute;

}
.nav-bar {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  margin-bottom: 10px;
  background-color: #282828; /* Spotify light background */
  color: #ffffff; /* White text */
  border-radius: 10px;
  border: 3px solid #282828; /* Spotify border color */
}
.nav-bar-option {
  background: none;
  border: none;
  color: #ffffff; /* White text */
  cursor: pointer;
  padding: 16px 32px;
  border-radius: 4px;
}
.nav-bar-option.currentPage {
  background-color: #121212; /* Spotify green */
}
</style>
