<template>
  <div class="pagination">
    <!-- Back button -->
    <button
      class="btn btn-primary"
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
    >
      Vorherige
    </button>

    <!-- Current page and page count-->
    <span style="color: black"
      >Seite {{ currentPage }} von {{ totalPages }}</span
    >

    <!-- Next page -->
    <button
      class="btn btn-primary"
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
    >
      Nächste
    </button>

    <!-- Select for max count per page-->
    <select v-model="selectedPerPage" @change="changePerPage">
      <option v-for="value in perPageOptions" :key="value" :value="value">
        {{ value }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from "vue";

// Props
const props = defineProps({
  totalItems: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    default: 5,
  },
  perPageOptions: {
    type: Array as () => number[],
    default: () => [5, 10, 20],
  },
});

const emit = defineEmits(["pageChanged", "perPageChanged"]);

// Intern data for items per page e.g.
const totalPages = ref(Math.ceil(props.totalItems / props.itemsPerPage));
const selectedPerPage = ref(props.itemsPerPage);

// Watch total items per page
watch([() => props.totalItems, selectedPerPage], () => {
  totalPages.value = Math.ceil(props.totalItems / selectedPerPage.value);
});

// Change the page
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit("pageChanged", page);
  }
};

// Change items per page
const changePerPage = () => {
  emit("perPageChanged", selectedPerPage.value);
};
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: 1rem;
}

button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

select {
  padding: 0.5rem;
}
</style>
