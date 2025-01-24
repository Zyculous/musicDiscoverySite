<template>
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
                <div :style:="{display: `flex`, flexDirection: `row`}">
                  <a class="result-title" v-for="(artist, i) in result.artists" :key="artist.id" :href=artist.external_urls.spotify><span class="result-title" v-if="i > 0">& </span> {{artist.name}}</a>

                </div>
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
</template>

<script>
export default {
  data() {
    return {
      searchValue: '',
      searchTypes: ['album', 'artist', 'track'],
      searchResults: {},
      dropdownOpen: false,
      collapsedTypes: {}
    };
  },
  methods: {
    toggleCollapse(type) {
      this.collapsedTypes[type] = !this.collapsedTypes[type];
    },
    async search(event, type, q) {
      if (event.key !== 'Enter') return;

      type = type.join('%2C');
      console.log(type);
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`https://api.spotify.com/v1/search?q=${q}&type=${type}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data);
        this.searchResults = data;
      } catch (error) {
        console.error('Search error:', error);
      }
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    }
  }
};
</script>

<style scoped>
.listedArtists {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
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
.listedSongs {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
  padding: 8px;
  margin-bottom: 16px;
  height: 100%;
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
.result-details {
  display: flex;
  flex-direction: row;
  gap: 20px;
}
.result-bb {
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  align-items: flex-start;
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
.dropdown-content {
  margin-top: 10px;
  background-color: #282828; /* Slightly lighter gray */
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.filter-options > input {
  margin-right: 10px;
}
</style>
