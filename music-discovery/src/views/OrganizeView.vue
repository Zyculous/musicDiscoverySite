<template>
  <div class="organize-view">
    <div>
      <div>
        <div style="position: relative; display: inline-block; width: 100%">
          <input
            class="search-bar"
            type="text"
            placeholder="Search songs"
            v-model="searchValue"
            @keypress="search($event, searchTypes, searchValue)"
            style="width: calc(100% - 40px)"
          />
          <button
            class="filter-btn"
            @click="toggleDropdown"
            :style="{
              position: `absolute`,
              right: 0,
              top: `0`,
              height: `100%`,
              width: `40px`,
              backgroundColor: `#232323`,
            }"
          >
            <img src="../assets/filter.png" alt="Filter" style="height: 100%; width: 100%" />
          </button>
        </div>
          <div v-if="dropdownOpen" class="dropdown-content">
            <div class="filter-options">
              <input type="checkbox" id="album" name="album" value="album" v-model="searchTypes" />
              <label for="album">Album</label>
            </div>
            <div class="filter-options">
              <input type="checkbox" id="artist" name="artist" value="artist" v-model="searchTypes" />
              <label for="artist">Artist</label>
            </div>
            <div class="filter-options">
              <input type="checkbox" id="track" name="track" value="track" v-model="searchTypes" />
              <label for="track">Song</label>
            </div>
          </div>
        </div>
      <div>
        <div class="song-listing" v-if="!searchLoaded">
          <div v-for="n in 8" :key="n" class="skeleton-box">
            <div class="skeleton-title"></div>
            <div class="skeleton-content"></div>
            <div class="skeleton-content-2"></div>
          </div>
        </div>
        <div v-else>
          <div v-for="(results, type) in searchResults" :key="type">
            <h2 @click="toggleCollapse(type)">{{ type }}
              <span>{{ collapsedTypes[type] ? '➤' : '▼' }}</span>
            </h2>
            <div v-if="!collapsedTypes[type] && type == 'artists'" class="listedArtists">
              <div v-for="result in results.items" :key="result.id" class="search-result-artist">
                <a class="result-title" :href=result.external_urls.spotify :style="{color:`#ffffff`}">{{ result.name }}</a>
                  <img :src="result.images[0]?.url" :alt="result.name" :style="{width: `100%`, padding: `10px 0px 0px 0px`}" />
              </div>
            </div>
            <div v-if="!collapsedTypes[type] && type == 'albums'" class="listedAlbums">
              <div v-for="result in results.items" :key="result.id" class="search-result-album">
                <a class="result-title" :href=result.external_urls.spotify>{{ result.name }}</a>
                <a class="result-artists" v-for="artist in result.artists" :key="artist.id" :href=artist.external_urls.spotify>{{ artist.name }}</a>
                  <img :src="result.images[0].url" :alt="result.name" :style="{width: `100%`}" />
              </div>
            </div>
            <div v-if="!collapsedTypes[type] && type == 'tracks'" class="listedSongs">
              <div v-for="result in results.items" :key="result.id" class="search-result-song">
                <img class="result-image" :src="result.album.images[0].url" :alt="result.name"/>
                <div class="result-details">
                  <div class="result-bb">
                    <h4>Artists</h4>
                    <a class="result-title" v-for="artist in result.artists" :key="artist.id" :href=artist.external_urls.spotify>{{ artist.name }}</a>
                  </div>
                  <div class="result-bb">
                    <h3>Album</h3>
                    <a class="result-title" :href=result.album.external_urls.spotify>{{ result.album.name }}</a>
                  </div>
                  <div class="result-bb">
                    <h3>Track</h3>
                    <a class="result-title" :href=result.external_urls.spotify>{{ result.name }}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
            <div v-for="tag in category.tags" :key="tag.id" class="tag">
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
    <div class="playlist-listing"></div>
  </div>
</template>

<script>
const clientId = '45d6d0678f9c4d9cbce9c7e1bbb2bc8f'; // your clientId
import filter from '../assets/filter.png'
export default {
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
      collapsedTypes: {}
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
    addTag(categoryId) {
      const category = this.categories.find((category) => category.id === categoryId)
      if (category.newTag.trim()) {
        category.tags.push({ id: Date.now(), name: category.newTag })
        category.newTag = ''
      }
    },
    removeTag(categoryId, tagId) {
      const category = this.categories.find((category) => category.id === categoryId)
      category.tags = category.tags.filter((tag) => tag.id !== tagId)
    },
    handleKeyPress(event, categoryId) {
      if (event.key === 'Enter') {
        this.addTag(categoryId)
      }
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen
    },
    removeCategory(categoryId) {
      this.categories = this.categories.filter((c) => c.id !== categoryId)
    },
    addCategory() {
      if (!this.newCategory.trim()) return
      const newId = Math.max(...this.categories.map((c) => c.id), 0) + 1
      this.categories.push({
        id: newId,
        name: this.newCategory,
        tags: [],
        open: false,
        newTag: '',
      })
      this.newCategory = ''
    },
    handleCategoryKeyPress(event) {
      if (event.key === 'Enter') {
        this.addCategory()
      }
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
    }
  },
}
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
    'left right-top'
    'left right-bottom';
  gap: 16px;
  padding: 16px;
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

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remove-category-btn {
  background: none;
  border: none;
  color: #999;
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
</style>
