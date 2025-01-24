<template>
  <div class="profile-page">
    <div class="profile-header">
      <h1 v-if="!isEditing">{{ profile.name }}</h1>
      <input v-else v-model="profile.name" class="edit-input" />
      <button class="edit-profile-btn" @click="toggleEdit">
        {{ isEditing ? 'Save' : 'Edit Profile' }}
      </button>
    </div>
    <div class="profile-body">
      <img :src="profile.image" alt="Profile Image" class="profile-image" @click="editImage" />
      <div class="profile-content">
        <div class="section">
          <h2>Biography</h2>
          <p v-if="!isEditing">{{ profile.biography }}</p>
          <textarea v-else v-model="profile.biography" class="edit-input"></textarea>
        </div>
        <div class="section">
          <h2>Connected Accounts</h2>
          <div v-if="profile.connectedAccounts.length === 0">
            <p :style="{marginBottom: `10px`}">No connected accounts</p>
            <button class="add-link-btn" @click="loginWithSpotifyClick">Add Account</button>
          </div>
          <ul v-else>
            <li v-for="account in profile.connectedAccounts" :key="account.id">
              <a :href="account.link">{{ account.name }}</a>
              <button class="remove-account-btn" @click="removeAccount(account.id)">Remove</button>
            </li>
          </ul>
        </div>
        <div class="profile-footer">
          <button class="logout-btn" @click="logout">Logout</button>
        </div>
      </div>
    </div>
    <ImageEditor v-if="showImageEditor" :show="showImageEditor" :imageSrc="profile.image" @close="closeImageEditor" @save="updateProfileImage" />
  </div>
</template>

<script>
import defaultPFP from '@/assets/defaultPFP.png';
import ImageEditor from '@/components/ImageEditor.vue';

const clientId = '45d6d0678f9c4d9cbce9c7e1bbb2bc8f'; // your clientId
const redirectUrl = 'http://localhost:5173/account/'; // your redirect URL - must be localhost URL and/or HTTPS
const authorizationEndpoint = new URL("https://accounts.spotify.com/authorize");
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = 'user-read-private user-read-email';

export default {
  components: {
    ImageEditor
  },
  data() {
    return {
      profile: {
        name: "Alex Appleton",
        connectedAccounts: [],
        biography: `Lorem ipsum odor amet, consectetuer adipiscing elit...`,
        image: defaultPFP,
      },
      isEditing: false,
      showImageEditor: false,
      currentToken: {
        access_token: localStorage.getItem('access_token') || null,
        refresh_token: localStorage.getItem('refresh_token') || null,
        expires_in: localStorage.getItem('expires_in') || null,
        expires: localStorage.getItem('expires') || null,
        save(response) {
          const { access_token, refresh_token, expires_in } = response;
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          localStorage.setItem('expires_in', expires_in);
          const now = new Date();
          const expiry = new Date(now.getTime() + (expires_in * 1000));
          localStorage.setItem('expires', expiry);
        }
      }
    };
  },
  methods: {
    toggleEdit() {
      this.isEditing = !this.isEditing;
    },
    editImage() {
      if (this.isEditing) {
        this.showImageEditor = true;
      }
    },
    closeImageEditor() {
      this.showImageEditor = false;
    },
    updateProfileImage(imageSrc) {
      console.log('Image saved: ', this.profile.image);
      this.profile.image = imageSrc;
      console.log('Updated image: ', imageSrc);
      this.showImageEditor = false;
    },
    logout() {
      document.cookie = `loggedIn=false; expires=${new Date(0).toUTCString()}; path=/;`;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('expires_in');
      localStorage.removeItem('expires');
      localStorage.removeItem('code_verifier');
      this.$router.push('/signup');
    },
    async loginWithSpotifyClick() {
      await this.redirectToSpotifyAuthorize();
    },
    async redirectToSpotifyAuthorize() {
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const randomValues = crypto.getRandomValues(new Uint8Array(64));
      const randomString = randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");

      const code_verifier = randomString;
      const data = new TextEncoder().encode(code_verifier);
      const hashed = await crypto.subtle.digest('SHA-256', data);

      const code_challenge_base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

      window.localStorage.setItem('code_verifier', code_verifier);

      const authUrl = new URL(authorizationEndpoint);
      const params = {
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        code_challenge_method: 'S256',
        code_challenge: code_challenge_base64,
        redirect_uri: redirectUrl,
      };

      authUrl.search = new URLSearchParams(params).toString();
      window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
    },
    async getToken(code) {
      const code_verifier = localStorage.getItem('code_verifier');

      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUrl,
          code_verifier: code_verifier,
        }),
      });

      return await response.json();
    },
    async getUserData() {
      const response = await fetch("https://api.spotify.com/v1/me", {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + this.currentToken.access_token },
      });

      return await response.json();
    },
    async loadSpotifyData() {
      if (this.currentToken.access_token) {
        const userData = await this.getUserData();
        this.profile.connectedAccounts.push({
          id: userData.id,
          name: 'Spotify',
          link: userData.external_urls.spotify
        });
        this.profile.name = userData.display_name;
        this.profile.image = userData.images.length > 0 ? userData.images[0].url : defaultPFP;
        this.profile.biography = userData.email; // Assuming you want to display the email as biography
      }
    },
    async removeAccount(accountId) {
      // Remove the account from the connectedAccounts array
      this.profile.connectedAccounts = this.profile.connectedAccounts.filter(account => account.id !== accountId);
    }
  },
  async created() {
    const args = new URLSearchParams(window.location.search);
    const code = args.get('code');

    if (code) {
      const token = await this.getToken(code);
      this.currentToken.save(token);

      const url = new URL(window.location.href);
      url.searchParams.delete("code");

      const updatedUrl = url.search ? url.href : url.href.replace('?', '');
      window.history.replaceState({}, document.title, updatedUrl);

    }else if(!localStorage.getItem('access_token')){
      await this.redirectToSpotifyAuthorize();
    }

    await this.loadSpotifyData();
  }
};
</script>

<style scoped>
.profile-page {
  position: absolute;
  top: 0;
  left: 3%;
  width: 97%;
  height: 100%;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #121212; /* Spotify dark background */
  color: #FFFFFF; /* Primary text color */
}
.account-logo {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
.remove-account-btn {
  background-color: #232323; /* Light gray */
  color: #ffffff; /* White text */
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 10px;;
}
.profile-footer {
  margin-top: 20px;
  text-align: center;
}
.logout-btn {
  background-color: #1DB954; /* Spotify green */
  color: #FFFFFF; /* White text */
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
}
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.profile-body {
  display: flex;
  align-items: flex-start;
}
.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-right: 20px;
}
.profile-content {
  flex: 1;
}
.edit-profile-btn {
  background-color: #1DB954; /* Spotify green */
  color: #FFFFFF; /* White text */
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
}
.edit-profile-btn:hover {
  background-color: #1ED760; /* Lighter green */
}
.edit-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.add-link-btn {
  background-color: #1DB954; /* Spotify green */
  color: #FFFFFF; /* White text */
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
}
.add-link-btn:hover {
  background-color: #1ED760; /* Lighter green */
}
.section h2 {
  margin-bottom: 10px;
  color: #FFFFFF; /* Primary text color */
}
.section p {
  margin: 0;
  color: #B3B3B3; /* Secondary text color */
}
.section a {
  color: #1DB954; /* Spotify green */
}
</style>
