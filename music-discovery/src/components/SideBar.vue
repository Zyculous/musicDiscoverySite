<template>
  <div>
    <button @click="toggleSidebar" class="hamburger-menu">
      &#9776;
    </button>
    <div :class="['sidebar', { 'sidebar--open': isOpen }]">
      <button @click="toggleSidebar" class="close-sidebar">
        &times;
      </button>
      <nav>
        <ul>
          <li>
            <router-link to="/account" @click="closeSidebar">
              <i class="fas fa-user"></i> Account
            </router-link>
          </li>
          <li>
            <router-link to="/home" @click="closeSidebar">
              <i class="fas fa-home"></i> Home
            </router-link>
          </li>
          <li>
            <router-link to="/organize" @click="closeSidebar">
              <i class="fas fa-tasks"></i> Organize
            </router-link>
          </li>
          <li>
            <router-link to="/share" @click="closeSidebar">
              <i class="fas fa-share-alt"></i> Share
            </router-link>
          </li>
          <li>
            <router-link to="/discover" @click="closeSidebar">
              <i class="fas fa-search"></i> Discover
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        document.addEventListener('click', this.mouseClick);
      } else {
        document.removeEventListener('click', this.mouseClick);
      }
    },
    closeSidebar() {
      this.isOpen = false;
      document.removeEventListener('click', this.mouseClick);
    },
    handleEsc(event) {
      if (event.key === 'Escape' && this.isOpen) {
        this.isOpen = false;
        document.removeEventListener('click', this.mouseClick);
      }
    },
    mouseClick(event) {
      if (!this.$el.contains(event.target) && this.isOpen) {
        this.isOpen = false;
        document.removeEventListener('click', this.mouseClick);
      }
    },
  },
  mounted() {
    document.addEventListener('keydown', this.handleEsc);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleEsc);
  },
};
</script>

<style scoped>
.hamburger-menu {
  font-size: 30px;
  cursor: pointer;
  background: none;
  border: none;
  color: #1DB954; /* Spotify Green */
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
}

.sidebar {
  height: 100%;
  width: 250px;
  position: fixed;
  top: 0;
  left: -250px;
  background-color: #191414; /* Spotify Black */
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
  z-index: 9999; /* Ensure it is above other elements */
}

.sidebar--open {
  left: 0;
}

.sidebar nav ul {
  list-style-type: none;
  padding: 0;
}

.sidebar nav ul li {
  padding: 8px 16px;
  text-align: left;
}

.sidebar nav ul li a {
  color: #1DB954; /* Spotify Green */
  text-decoration: none;
  font-size: 18px;
  display: flex;
  align-items: center;
}

.sidebar nav ul li a i {
  margin-right: 10px;
}

.close-sidebar {
  font-size: 30px;
  cursor: pointer;
  background: none;
  border: none;
  color: #1DB954; /* Spotify Green */
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
