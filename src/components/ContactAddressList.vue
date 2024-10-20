<template>
  <div class="address-list-container">
    <h3>Adresse auswählen</h3>
    <div class="address-list">
      <div
        v-for="address in addresses"
        :key="address._id"
        :class="[
          'address-item',
          { 'selected-address': address._id === selectedAddressId },
        ]"
        @click="selectAddress(address._id)"
      >
        <p class="address-text">
          {{ address._id }}, {{ address.street }}, {{ address.city }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

// Props - Liste der Adressen und ID der aktuell zugewiesenen Adresse
const props = defineProps({
  addresses: Array as () => Array<{
    _id: string;
    street: string;
    city: string;
  }>,
  selectedAddressId: String, // ID der dem Kontakt zugewiesenen Adresse
});

// Emits - Event, das bei Klick auf eine Adresse zurückgegeben wird
const emit = defineEmits(["addressSelected"]);

// Methode zum Selektieren einer Adresse
const selectAddress = (addressId: string) => {
  emit("addressSelected", addressId); // Emit-Event mit der ausgewählten Adress-ID
};
</script>

<style lang="scss" scoped>
.address-list-container {
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  background-color: $background-light;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-x: auto;
}

.address-item {
  padding: 0.5rem 1rem;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  background-color: $input-bg;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.3s ease;
}

.address-item:hover {
  background-color: $hover-background-color;
}

.selected-address {
  border-color: $error-color;
  background-color: lighten($error-color, 40%);
}

.address-text {
  color: $text-dark;
}
</style>
