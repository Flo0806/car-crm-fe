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
          {{ address.street }}, <strong>{{ address.zip }}</strong>
          {{ address.city }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Address } from "@/common/interfaces";
import { defineProps, defineEmits } from "vue";

// Props - List of addresses and the id of the current given address
const props = defineProps({
  addresses: Array as () => Array<Address>,
  selectedAddressId: String, // Id of the address (relation)
});

// Click event
const emit = defineEmits(["addressSelected"]);

// Select an address
const selectAddress = (addressId: string) => {
  emit("addressSelected", addressId);
};
</script>

<style lang="scss" scoped>
@use "sass:color";

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
  background-color: color.adjust(
    $error-color,
    $lightness: 40%
  ); // lighten($error-color, 40%);
}

.address-text {
  color: $text-dark;
}
</style>
