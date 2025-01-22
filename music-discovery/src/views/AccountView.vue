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
            <button class="add-link-btn">Add Account</button>
          </div>
          <ul v-else>
            <li v-for="account in profile.connectedAccounts" :key="account.id">
              <a :href="account.link">{{ account.name }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <ImageEditor v-if="showImageEditor" :show="showImageEditor" :imageSrc="profile.image" @close="closeImageEditor" />
  </div>
</template>

<script>
import defaultPFP from '@/assets/defaultPFP.png';
import ImageEditor from '@/components/ImageEditor.vue'; // Add this import

export default {
  components: {
    ImageEditor // Register the component
  },
  data() {
    return {
      profile: {
        name: "Alex Appleton",
        connectedAccounts: [],
        biography: `Lorem ipsum odor amet, consectetuer adipiscing elit. Euismod mollis convallis ad himenaeos enim ipsum. Habitasse sem suscipit netus ante urna ante. Libero dapibus ligula facilisi feugiat sapien ex taciti id. Lacinia parturient lectus fringilla interdum scelerisque mattis nulla non. Non morbi dolor nulla efficitur quam eu augue. Lacinia diam proin ullamcorper nam eget cras molestie venenatis tempor. Donec nostra varius tortor; penatibus cras primis donec.c Euismod iaculis libero litora nam aliquam. Vel vivamus conubia posuere fermentum quisque facilisi. Non condimentum diam tortor mauris tristique, pellentesque auctor mauris. Feugiat condimentum nec est; consectetur class praesent habitant. Rutrum quis aenean pharetra sem donec parturient aptent id iaculis. Dignissim fusce magnis eleifend rutrum egestas cras praesent. Dui habitant fringilla venenatis vitae, per curae vivamus praesent volutpat! Metus volutpat nullam aliquam lectus fermentum ridiculus.Non praesent laoreet eleifend morbi facilisis quam rutrum. Fermentum neque tempus posuere dignissim ullamcorper dignissim. Magna lobortis dis neque ad primis mus aliquet. Curae nunc lobortis eu at finibus. Leo justo tempor libero aptent volutpat ex taciti a. Curabitur nisl nam mattis ornare sociosqu. Scelerisque fringilla dui sed nostra volutpat sagittis. Interdum scelerisque dignissim sollicitudin amet; viverra potenti. Vulputate platea cras finibus rhoncus varius adipiscing malesuada eleifend? Natoque habitasse nostra amet odio vel neque adipiscing. Varius auctor quam dolor aenean eu dolor orci porta. Convallis aliquam sapien himenaeos fames cras faucibus aliquam maximus augue. Morbi metus tristique neque tellus maecenas velit molestie ultricies. Fermentum nam netus blandit varius non laoreet augue lacinia. Scelerisque dis ligula class facilisis cursus curae tempor aenean. Suspendisse turpis venenatis viverra; condimentum eget nisl id.Id senectus himenaeos nibh efficitur tempor elit dapibrisus per justo quisque sit faucibus. Luctus aptent tristique non tincidunt imperdiet egestas vel. Pretium ornare nullam libero ad velit consectetur diam semper. Lacus parturient etiam lacus litora lacinia a natoque pretium. Parturient sodales consequat, viverra ante purus donec?Euismod praesent posuere dui quis nam volutpat tincidunt torquent. Velit nullam felis sollicitudin sit nam vestibulum interdum magnis. `,
        image: defaultPFP, // Add the path to the profile image
      },
      isEditing: false,
      showImageEditor: false // Add this property
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
  },
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

.edit-link {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
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
