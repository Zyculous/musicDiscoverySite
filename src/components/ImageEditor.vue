<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <span class="close" @click="close">&times;</span>
      <div class="editor">
        <div class="image-container" @mousedown="startDragging" @mousemove="drag" @mouseup="stopDragging" @mouseleave="stopDragging">
          <img class="edit-image" :src="imageSrc" ref="image" crossOrigin="anonymous" />
          <div class="crop-rectangle" :style="cropRectangleStyle">
            <button class="rotate-button left" @click="rotate('left')">&#x2939;</button>
            <div class="drag-bar top" @mousedown.stop="startResizing('top', $event)"></div>
            <div class="drag-bar right" @mousedown.stop="startResizing('right', $event)"></div>
            <div class="drag-bar bottom" @mousedown.stop="startResizing('bottom', $event)"></div>
            <div class="drag-bar left" @mousedown.stop="startResizing('left', $event)"></div>
            <div class="drag-bar bottom-right" @mousedown.stop="startResizing('bottom-right', $event)"></div>
            <button class="rotate-button right" @click="rotate('right')">&#x2938;</button>
          </div>
        </div>
        <div class="controls">
          <button class="crop-button" @click="crop">
            <img :src="cropIcon" alt="Crop" />
          </button>
          <button class="save-button" @click="saveImage">Save Image</button>
          <input type="file" @change="uploadImage" class="upload-button" />
        </div>
        <div class="resize-controls">
          <label>
            Width:
            <input type="number" v-model.number="cropRectangle.width" />
          </label>
          <label>
            Height:
            <input type="number" v-model.number="cropRectangle.height" />
          </label>
          <label>
            Lock Aspect Ratio:
            <input type="checkbox" v-model="lockAspectRatio" />
          </label>
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
  data() {
    return {
      rotation: 0,
      cropIcon,
      dragging: false,
      resizing: false,
      resizeDirection: '',
      lockAspectRatio: false,
      cropRectangle: {
        x: 50,
        y: 50,
        width: 100,
        height: 100
      },
      startX: 0,
      startY: 0,
      previousFilePath: ''
    };
  },
  computed: {
    cropRectangleStyle() {
      return {
        left: `${this.cropRectangle.x}px`,
        top: `${this.cropRectangle.y}px`,
        width: `${this.cropRectangle.width}px`,
        height: `${this.cropRectangle.height}px`,
      };
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    rotate(direction) {
      const img = this.$refs.image;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set canvas dimensions based on the rotation
      if (this.rotation % 180 === 0) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      } else {
        canvas.width = img.naturalHeight;
        canvas.height = img.naturalWidth;
      }

      // Translate and rotate the canvas
      ctx.translate(canvas.width / 2, canvas.height / 2);
      const angle = direction === 'right' ? 90 : -90;
      ctx.rotate((angle * Math.PI) / 180);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

      // Update the image source with the rotated image
      img.src = canvas.toDataURL();
      this.rotation = (this.rotation + angle) % 360;
    },
    startDragging(event) {
      this.dragging = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
    },
    drag(event) {
      if (this.dragging) {
        const dx = event.clientX - this.startX;
        const dy = event.clientY - this.startY;
        this.cropRectangle.x = Math.max(0, Math.min(this.cropRectangle.x + dx, this.$refs.image.width - this.cropRectangle.width));
        this.cropRectangle.y = Math.max(0, Math.min(this.cropRectangle.y + dy, this.$refs.image.height - this.cropRectangle.height));
        this.startX = event.clientX;
        this.startY = event.clientY;
      } else if (this.resizing) {
        const dx = event.clientX - this.startX;
        const dy = event.clientY - this.startY;
        if (this.resizeDirection === 'top') {
          const newHeight = this.cropRectangle.height - dy;
          if (this.lockAspectRatio) {
            const newWidth = newHeight;
            this.cropRectangle.width = newWidth;
            this.cropRectangle.height = newHeight;
            this.cropRectangle.y += dy;
          } else {
            this.cropRectangle.height = newHeight;
            this.cropRectangle.y += dy;
          }
        } else if (this.resizeDirection === 'right') {
          const newWidth = this.cropRectangle.width + dx;
          if (this.lockAspectRatio) {
            const newHeight = newWidth;
            this.cropRectangle.width = newWidth;
            this.cropRectangle.height = newHeight;
          } else {
            this.cropRectangle.width = newWidth;
          }
        } else if (this.resizeDirection === 'bottom') {
          const newHeight = this.cropRectangle.height + dy;
          if (this.lockAspectRatio) {
            const newWidth = newHeight;
            this.cropRectangle.width = newWidth;
            this.cropRectangle.height = newHeight;
          } else {
            this.cropRectangle.height = newHeight;
          }
        } else if (this.resizeDirection === 'left') {
          const newWidth = this.cropRectangle.width - dx;
          if (this.lockAspectRatio) {
            const newHeight = newWidth;
            this.cropRectangle.width = newWidth;
            this.cropRectangle.height = newHeight;
            this.cropRectangle.x += dx;
          } else {
            this.cropRectangle.width = newWidth;
            this.cropRectangle.x += dx;
          }
        } else if (this.resizeDirection === 'bottom-right') {
          const newWidth = this.cropRectangle.width + dx;
          const newHeight = this.cropRectangle.height + dy;
          if (this.lockAspectRatio) {
            const newSize = Math.max(newWidth, newHeight);
            this.cropRectangle.width = newSize;
            this.cropRectangle.height = newSize;
          } else {
            this.cropRectangle.width = newWidth;
            this.cropRectangle.height = newHeight;
          }
        }
        this.cropRectangle.x = Math.max(0, Math.min(this.cropRectangle.x, this.$refs.image.width - this.cropRectangle.width));
        this.cropRectangle.y = Math.max(0, Math.min(this.cropRectangle.y, this.$refs.image.height - this.cropRectangle.height));
        this.startX = event.clientX;
        this.startY = event.clientY;
      }
    },
    stopDragging() {
      this.dragging = false;
      this.resizing = false;
    },
    startResizing(direction, event) {
      this.resizing = true;
      this.resizeDirection = direction;
      this.startX = event.clientX;
      this.startY = event.clientY;
    },
    async crop() {
      const img = this.$refs.image;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Calculate the scaling factor
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;

      // Set canvas dimensions to the size of the crop rectangle
      canvas.width = this.cropRectangle.width * scaleX;
      canvas.height = this.cropRectangle.height * scaleY;

      // Draw the cropped area onto the canvas
      ctx.drawImage(
        img,
        this.cropRectangle.x * scaleX,
        this.cropRectangle.y * scaleY,
        this.cropRectangle.width * scaleX,
        this.cropRectangle.height * scaleY,
        0,
        0,
        this.cropRectangle.width * scaleX,
        this.cropRectangle.height * scaleY
      );

      // Convert the canvas to a blob
      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('previousFilePath', this.previousFilePath);

        try {
          const response = await fetch('http://localhost:5000/uploadImage', {
            method: 'POST',
            body: formData
          });
          const data = await response.json();

          // Update the image source with the server image URL
          this.previousFilePath = data.filePath;
          img.src = data.imageUrl;
          //this.$emit('save', data.imageUrl);
        } catch (error) {
          console.error('Error uploading cropped image:', error);
        }
      }, 'image/jpeg');
    },
    async saveImage() {
      const img = this.$refs.image;
      const response = await fetch(img.src);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('file', blob);
      formData.append('previousFilePath', this.previousFilePath);

      try {
        const response = await fetch('http://localhost:5000/uploadImage', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();

        // Update the image source with the server image URL
        this.previousFilePath = data.filePath;
        img.src = data.imageUrl;
        this.$emit('save', data.imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    },
    async uploadImage(event) {
      const file = event.target.files[0];
      const image = this.$refs.image;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('previousFilePath', this.previousFilePath);

        try {
          const response = await fetch('http://localhost:5000/uploadImage', {
            method: 'POST',
            body: formData
          });
          const data = await response.json();

          // Save the image URL in the profile
          this.previousFilePath = data.filePath;
          image.src = data.imageUrl;
          this.$emit('save', data.imageUrl);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    },
    handleEsc(event) {
      if (event.key === 'Escape') {
        const img = this.$refs.image;
        this.$emit('save', img.src);
      }
    },
  },
  mounted() {
    document.addEventListener('keydown', this.handleEsc);
    this.previousFilePath = this.imageSrc; // Initialize previousFilePath with the current imageSrc
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleEsc);
  },
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

.modal-content {
  background-color: #232323;
  padding: 30px;
  border-radius: 10px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
}

.editor {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-container {
  position: relative;
}

.edit-image {
  max-width: 100%;
  max-height: 400px;
  margin-bottom: 20px;
}

.crop-rectangle {
  position: absolute;
  border: 2px dashed #1DB954; /* Spotify green */
  background-color: rgba(0, 0, 0, 0.3);
  cursor: move;
  z-index: 10;
}

.drag-bar {
  position: absolute;
  background-color: #1DB954; /* Spotify green */
  width: 10px;
  height: 10px;
  cursor: pointer;
}

.drag-bar.top {
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
}

.drag-bar.right {
  top: 50%;
  right: -5px;
  transform: translateY(-50%);
}

.drag-bar.bottom {
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
}

.drag-bar.left {
  top: 50%;
  left: -5px;
  transform: translateY(-50%);
}
.drag-bar.bottom-right {
  bottom: -5px;
  right: -5px;
  cursor: se-resize;
}

.rotate-button {
  background-color: #1DB954; /* Spotify green */
  color: #FFFFFF; /* White text */
  border: none;
  cursor: pointer;
  border-radius: 5px;
  z-index: 20;
  position: absolute;
}

.rotate-button.left {
  top: 0;
  left: -30%;
}

.rotate-button.right {
  top: 0;
  right: -30%;
}

.controls {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.resize-controls {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.crop-button,
.save-button {
  background-color: #1DB954; /* Spotify green */
  color: #FFFFFF; /* White text */
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
}

.crop-button:hover,
.save-button:hover {
  background-color: #1ED760; /* Lighter green */
}

.upload-button {
  margin-top: 10px;
}
</style>
