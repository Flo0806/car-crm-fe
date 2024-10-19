<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="visible"
        :class="['snackbar', type]"
        @transitionend="handleTransitionEnd"
      >
        <span>{{ message }}</span>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { SnackbarType } from "@/common/interfaces";

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: SnackbarType.INFO, // "info", // can be 'info', 'success', 'error'
  },
  duration: {
    type: Number,
    default: 5000, // Duration in ms
  },
});

const emit = defineEmits(["close"]);

const visible = ref(false);
let timeoutId: any;

const showSnackbar = () => {
  visible.value = true;

  // Hide snackbar after the specified duration
  timeoutId = setTimeout(() => {
    visible.value = false;
  }, props.duration);
};

// When props.message changes, show the snackbar
watch(
  () => props.message,
  () => {
    if (props.message) {
      showSnackbar();
    }
  }
);

// Clear timeout if component is destroyed before snackbar disappears
onBeforeUnmount(() => {
  clearTimeout(timeoutId);
});

// Handle transition end to ensure the snackbar is removed from the DOM when invisible
const handleTransitionEnd = () => {
  if (!visible.value) {
    emit("close");
  }
};

onMounted(() => {
  showSnackbar();
});
</script>

<style lang="scss" scoped>
.snackbar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 250px;
  padding: 16px;
  background-color: #333;
  color: white;
  border-radius: 4px;
  text-align: center;
  z-index: 1000;
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: 1;
}

.snackbar.info {
  background-color: #2196f3;
}

.snackbar.success {
  background-color: #4caf50;
}

.snackbar.error {
  background-color: #f44336;
}

.snackbar.fade {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
