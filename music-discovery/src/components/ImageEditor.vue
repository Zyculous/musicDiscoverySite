<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <span class="close" @click="close">&times;</span>
      <div class="editor">
        <img class="edit-image" :src="imageSrc" ref="image" />
        <div class="controls">
          <button class="rotate-button" @click="rotate">&#x21bb;</button>
            <button class="crop-button" @click="crop">
            <img :src="cropIcon" alt="Crop" />
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cropIcon from '../assets/crop.png';
export default {
  name: 'ImageEditor',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    imageSrc: {
      type: String,
      required: true
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    rotate() {
      const img = this.$refs.image;
      img.style.transform = `rotate(${(this.rotation = (this.rotation + 90) % 360)}deg)`;
    },
    crop() {
      // Implement cropping logic here
    }
  },
  data() {
    return {
      rotation: 0,
      cropIcon
    };
  }
};
</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.rotate-button {
  background-color: #1DB954;
  color: white;
  font-size: 13pt;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}
.crop-button {
  background-color: #1DB954;
  color: white;
  font-size: 13pt;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}
.crop-button img {
  width: 15px;
  height: 15px;
}
.edit-image {
  max-width: 100%;
  max-height: 100%;
  border: 2px solid #121212;
}
.modal-content {
  background-color: #232323;
  padding: 30px;
  border-radius: 10px;
  position: relative;
}

.close {
  position: absolute;
  top: 0px;
  right: 8px;
  font-size: 24px;
  cursor: pointer;
}

.editor {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.controls {
  margin-top: 10px;
}

.controls button {
  margin: 0 5px;
}
</style>
