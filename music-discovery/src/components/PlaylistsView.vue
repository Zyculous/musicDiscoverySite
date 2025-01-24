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
            <div v-for="(track, index) in playlist.tracks.items" :key="track.track.id" class="song">
              <div class="track-number">{{ index + 1 }}</div>
              <img :src="track.track.album.images[0]?.url" :alt="track.track.name" class="song-image" />
              <div class="song-details">
                <a :href="track.track.external_urls.spotify" class="song-title">{{ track.track.name }}</a>
                <div class="song-artists">
                  <span v-for="artist in track.track.artists" :key="artist.id" class="song-artist">
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
  mounted() {
    const storedPlaylists = localStorage.getItem('playlists');
    if (storedPlaylists) {
      this.playlists = JSON.parse(storedPlaylists);
      this.playlistsLoaded = true;
    } else {
      this.fetchPlaylists();
    }
  },
  methods: {
    async fetchPlaylists() {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        this.playlists = data.items.map(playlist => ({
          ...playlist,
          tracksLoaded: false,
          tracks: { items: [] }
        }));
        this.playlistsLoaded = true;
        localStorage.setItem('playlists', JSON.stringify(this.playlists));
        this.playlists.forEach(playlist => this.fetchPlaylistTracks(playlist.id));
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    },
    togglePlaylist(playlistId) {
      const playlist = this.playlists.find(pl => pl.id === playlistId);
      if (this.expandedPlaylists.includes(playlistId)) {
        this.expandedPlaylists = this.expandedPlaylists.filter(id => id !== playlistId);
      } else {
        this.expandedPlaylists.push(playlistId);
        if (!playlist.tracksLoaded) {
          this.fetchPlaylistTracks(playlistId);
        }
      }
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
          allTracks = allTracks.concat(data.items);
          totalTracks = data.total;
          offset += limit;
        } while (offset < totalTracks);

        const playlist = this.playlists.find(pl => pl.id === playlistId);
        playlist.tracks = { items: allTracks };
        playlist.tracksLoaded = true;
        localStorage.setItem('playlists', JSON.stringify(this.playlists));
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
