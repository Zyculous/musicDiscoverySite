<template>
  <div class="playlists-view">
    <h1>Your Playlists</h1>
    <div v-if="!playlistsLoaded" class="loading">Loading...</div>
    <div v-else>
      <div v-for="playlist in playlists" :key="playlist.id" class="playlist">
        <h2 @click="togglePlaylist(playlist.id)">
          <img :src="playlist.images[0]?.url" :alt="playlist.name" class="playlist-image" />
          {{ playlist.name }}
        </h2>
        <div v-if="expandedPlaylists.includes(playlist.id)" class="songs">
          <div v-if="!playlist.tracksLoaded" class="loading-songs">
            <div v-for="n in 10" :key="n" class="skeleton-song"></div>
          </div>
          <div v-else>
            <div v-for="(track, index) in playlist.tracks.items" :key="track.track?.id" class="song">
              <div class="track-number">{{ index + 1 }}</div>
              <img :src="track.track?.album.images[0]?.url" :alt="track.track?.name" class="song-image" />
              <div class="song-details">
                <a :href="track.track?.external_urls.spotify" class="song-title">{{ track.track?.name }}</a>
                <div class="song-artists">
                  <span v-for="artist in track.track?.artists" :key="artist.id" class="song-artist">
                    <a :href="artist.external_urls.spotify">{{ artist.name }}</a>
                  </span>
                </div>
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
      playlists: [],
      playlistsLoaded: false,
      expandedPlaylists: []
    };
  },
  async mounted() {
    const cachedPlaylists = await this.getCachedPlaylists();
    if (cachedPlaylists) {
      this.playlists = cachedPlaylists;
      this.playlistsLoaded = true;
      console.log('Loaded playlists from cache:', this.playlists);
    } else {
      this.fetchPlaylists();
    }
  },
  methods: {
    async getCachedPlaylists() {
      if ('caches' in window) {
        const cache = await caches.open('music-discovery-cache-v1');
        const response = await cache.match('https://api.spotify.com/v1/me/playlists');
        if (response) {
          const data = await response.json();
          return data.items.map(playlist => ({
            ...playlist,
            tracksLoaded: false,
            tracks: { items: [] }
          }));
        }
      }
      return null;
    },
    async fetchPlaylists() {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.items) {
          this.playlists = data.items.map(playlist => ({
            ...playlist,
            tracksLoaded: false,
            tracks: { items: [] }
          }));
          this.playlistsLoaded = true;

          localStorage.setItem('playlists', JSON.stringify(this.playlists));
          console.log('Fetched playlists from Spotify:');
          console.log(this.playlists);
          this.playlists.forEach(playlist => this.fetchPlaylistTracks(playlist.id));
        } else {
          console.error('Error fetching playlists: No items found');
        }
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    },
    togglePlaylist(playlistId) {
      const playlist = this.playlists.find(pl => pl.id === playlistId);
      if (!playlist) {
        console.error('Playlist not found:', playlistId);
        return;
      }
      if (this.expandedPlaylists.includes(playlistId)) {
        this.expandedPlaylists = this.expandedPlaylists.filter(id => id !== playlistId);
      } else {
        this.expandedPlaylists.push(playlistId);
        if (!playlist.tracksLoaded) {
          this.fetchPlaylistTracks(playlistId);
        }
      }
      console.log('Toggled playlist:', playlistId, this.expandedPlaylists);
    },
    async fetchPlaylistTracks(playlistId) {
      try {
        const token = localStorage.getItem('access_token');
        let offset = 0;
        const limit = 50;
        let allTracks = [];
        let totalTracks = 0;

        do {
          const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${offset}&limit=${limit}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (data.items) {
            allTracks = allTracks.concat(data.items);
            offset += limit;
            totalTracks = data.total;
          } else {
            console.error('Error fetching playlist tracks: No items found');
            break;
          }
        } while (offset < totalTracks);

        const playlist = this.playlists.find(pl => pl.id === playlistId);
        if (playlist) {
          playlist.tracks.items = allTracks;
          playlist.tracksLoaded = true;
          console.log('Fetched tracks for playlist from Spotify:', playlistId, playlist.tracks.items);
        } else {
          console.error('Playlist not found when fetching tracks:', playlistId);
        }
      } catch (error) {
        console.error('Error fetching playlist tracks:', error);
      }
    }
  }
};
</script>

<style scoped>
.playlists-view {
  padding: 20px;
  background-color: #121212; /* Spotify dark background */
  color: #FFFFFF; /* White text */
}

.loading {
  text-align: center;
  font-size: 18px;
}

.playlist {
  margin-bottom: 20px;
}

.playlist h2 {
  cursor: pointer;
  color: #1DB954; /* Spotify green */
  display: flex;
  align-items: center;
}

.playlist-image {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.songs {
  margin-top: 10px;
  padding-left: 20px;
}

.loading-songs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-song {
  height: 50px;
  background-color: #333333; /* Dark gray background */
  border-radius: 4px;
}

.song {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.track-number {
  width: 30px;
  text-align: center;
  margin-right: 10px;
}

.song-image {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.song-details {
  display: flex;
  flex-direction: column;
}

.song-title {
  color: #FFFFFF; /* White text */
  font-size: 16px;
  text-decoration: none;
}

.song-artists {
  font-size: 14px;
  color: #B3B3B3; /* Light gray text */
}

.song-artist {
  margin-right: 5px;
}

.song-artist a {
  color: #1DB954; /* Spotify green */
  text-decoration: none;
}
</style>
