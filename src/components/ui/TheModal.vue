<template>
  <Teleport to="body">
    <transition name="modal">
      <!-- Backdrop -->
      <div v-if="isVisible" class="modal-wrapper">
        <div class="backdrop" @click="close"></div>
        <div class="modal-overlay" @click.self="close">
          <div class="modal-content">
            <header class="modal-header">
              <h2>{{ title }}</h2>
              <button @click="close" class="modal-close">&times;</button>
            </header>
            <main class="modal-body">
              <!-- Flexible content with slot -->
              <slot></slot>
            </main>
            <footer class="modal-footer">
              <button class="btn btn-error" @click="close">Schließen</button>
              <!-- Optional slot for custom buttons -->
              <slot name="actions"></slot>
            </footer>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

// Props
defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "Modal Titel",
  },
});

// Close event
const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>

<style lang="scss" scoped>
@use "sass:color";

.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Backdrop */
.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  color: $font-color;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: $primary-color;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  padding: 20px 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  .cancel-button {
    width: 150px;
    background-color: $error-color;
    color: $inverse-font-color;
    padding: 15px 30px;
    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    font-size: 18px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: color.adjust($primary-color, $lightness: -10%);
    }

    &:disabled {
      pointer-events: none;
      opacity: 0.5;
    }
  }
}

/* Animation for opening/closing */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

.modal-enter-from, .modal-leave-to /* .modal-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
