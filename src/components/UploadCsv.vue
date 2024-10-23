<template>
  <the-modal
    :isVisible="isVisible"
    @close="closeModal"
    title="CSV Kundenupload"
  >
    <div v-if="!isLoading && !isUploaded">
      <label for="csv-upload" class="btn btn-primary">
        <div class="btn-content icon">
          <i class="pi pi-upload"></i> Choose CSV
        </div>
      </label>
      <input
        id="csv-upload"
        type="file"
        @change="handleFileSelected"
        ref="fileInput"
        accept=".csv"
        style="display: none"
      />
      <p v-if="fileName">{{ fileName }}</p>
      <button
        type="button"
        v-if="file"
        @click="uploadCsv"
        class="btn btn-primary btn-success"
      >
        Upload
      </button>
    </div>

    <!-- Loading screen -->
    <div v-if="isLoading" class="loading-screen">
      <p>Uploading...</p>
    </div>

    <!-- Result screen -->
    <div v-if="isUploaded && !isLoading">
      <p>{{ uploadResult }}</p>
    </div>
  </the-modal>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import TheModal from "./ui/TheModal.vue";
import axios from "axios";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Props for modal visibility
const props = defineProps({
  isVisible: Boolean,
  onClose: Function,
});

// Emits
const emit = defineEmits(["close"]);

// Local state for file upload
const file = ref<File | null>(null);
const fileName = ref<string | null>(null);
const isLoading = ref(false);
const isUploaded = ref(false);
const uploadResult = ref("");

// Handle file selection
const handleFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    file.value = target.files[0];
    fileName.value = file.value.name;
  }
};

watch(
  () => props.isVisible,
  () => {
    if (props.isVisible) {
      file.value = null;
      fileName.value = null;
      isLoading.value = false;
      uploadResult.value = "";
    }
  }
);

// Function to upload file (mocked for demo purposes)
const uploadFile = async () => {
  if (!file.value) return;

  isLoading.value = true;
  isUploaded.value = false;

  // Simulate file upload
  setTimeout(() => {
    isLoading.value = false;
    isUploaded.value = true;
    uploadResult.value = "Upload successful!";
  }, 2000);
};

// Close the modal
const closeModal = () => {
  emit("close");
};

// Upload CSV
const uploadCsv = async () => {
  if (!file.value) {
    return;
  }

  isLoading.value = true;
  isUploaded.value = false;

  try {
    const formData = new FormData();
    formData.append("file", file.value); // Append the file to FormData

    const response = await axios.post(
      VITE_BACKEND_URL + "/import/customers",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Set the correct header for file uploads
        },
      }
    );

    console.log("Customers imported successfully", response.data);
    isLoading.value = false;
    isUploaded.value = true;
    if (response.data.skipped) {
      uploadResult.value = response.data.skipped;
    }
  } catch (error: any) {
    isLoading.value = false;
    isUploaded.value = true;
    console.error("Error uploading CSV:", error);
    if (error.response) {
      console.error("Error details:", error.response.data);
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  min-width: 300px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-close {
  background-color: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.loading-screen {
  text-align: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.btn-success {
  background-color: #28a745;
  color: white;
  border: none;
}

.modal-body {
  margin-top: 1rem;
}
</style>
