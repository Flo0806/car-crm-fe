<template>
  <div class="overview-container">
    <nav class="sidebar">
      <h1>Autohaus Maier</h1>
      <h2>{{ email }}</h2>
      <button type="button" @click="handleLogout" class="btn btn-error">
        Logout
      </button>
      <div class="menu">
        <div class="menu-item" @click="onCsvImportClicked">
          <div class="menu-item-content">
            <i class="pi pi-users"></i> Kunden
          </div>
        </div>
      </div>
    </nav>
    <div class="content">
      <router-view />
    </div>
  </div>

  <upload-csv :isVisible="showUploadModal" @close="uploadClose"></upload-csv>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";
import UploadCsv from "@/components/UploadCsv.vue";

const authStore = useAuthStore();
const router = useRouter();

const email = ref(authStore.email);
const showUploadModal = ref(false);

const handleLogout = async () => {
  await authStore.logout();
  router.push("/login"); // Redirect to login page after logout
};

const onCsvImportClicked = () => {
  showUploadModal.value = true;
};

const uploadClose = () => {
  showUploadModal.value = false;
};
</script>

<style lang="scss">
.overview-container {
  display: flex;
  width: 100%;
  height: 100vh; /* Full viewport height */

  .sidebar {
    width: 250px;
    background-color: $primary-color; /* Use your primary color */
    color: white;
    padding: 1rem;

    h1 {
      margin: 0;
    }

    h2 {
      margin: 1rem 0;
      font-size: 13px;
    }

    .menu {
      margin-top: 2rem;

      .menu-item {
        display: block;
        padding: 0.5rem 1rem;
        color: white;
        text-decoration: none;

        .menu-item-content {
          display: flex;
          align-items: center;

          i {
            &::after {
              content: "";
              margin-right: 1rem;
            }
          }
        }
        &:hover {
          background-color: darken($primary-color, 10%);
        }
      }
    }
  }

  .content {
    flex: 1; /* Take the remaining space */
    padding: 1rem;
    background-color: white; /* Background for the content area */
  }
}
</style>
