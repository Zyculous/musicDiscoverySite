<template>
  <div class="discover-view">
    <div v-for="n in 8" :key="n" class="skeleton-box">
      <div class="skeleton-title"></div>
      <div class="skeleton-content"></div>
      <div class="skeleton-content-2"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DiscoverView',
  data() {
    return {
      // Data will be loaded from the server and populated here
    };
  },
  mounted() {
    // Fetch data from the server and populate the data properties
  }
};
</script>

<style scoped>
.discover-view {
  position: absolute;
  top: 0;
  left: 3%;
  width: 100%;
  height: 100%;
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
}
</style>
