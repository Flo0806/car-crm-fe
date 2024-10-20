<template>
  <div class="address-list-container">
    <h3>Adressen</h3>
    <div class="address-list">
      <div
        v-for="address in addresses"
        :key="address._id"
        class="address-item"
        @click="selectAddress(address)"
      >
        <p class="address-title">{{ address.companyName }}</p>
        <p class="address-details">{{ address.street }}, {{ address.city }}</p>
        <p class="address-details">{{ address.zip }}, {{ address.country }}</p>
        <p class="address-details">Telefon: {{ address.phone }}</p>
        <p class="address-details">Email: {{ address.email }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Address } from "@/common/interfaces";
import { defineProps, defineEmits } from "vue";

// Props - Liste der Adressen
const props = defineProps({
  addresses: Array as () => Array<Address>,
});

// Emits - Das Event, das bei Klick auf eine Adresse zurückgegeben wird
const emit = defineEmits(["addressSelected"]);

// Methode zum Selektieren einer Adresse
const selectAddress = (address: any) => {
  emit("addressSelected", address); // Emit-Event mit der ausgewählten Adresse
};
</script>

<style lang="scss" scoped>
.address-list-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  background-color: $background-light;
  padding: 1rem;
  margin-bottom: 1rem;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.address-item {
  padding: 1rem;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  background-color: $input-bg;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.address-item:hover {
  background-color: $hover-background-color;
}

.address-title {
  font-weight: bold;
  color: $primary-color;
}

.address-details {
  color: $text-dark;
}
</style>
