<template>
  <div class="address-list-container">
    <div style="display: flex">
      <h3>Adressen</h3>
      <span style="flex-grow: 1"></span>
      <button
        @click="createNewAddress"
        type="button"
        class="btn btn-primary icon"
      >
        <i class="pi pi-plus"></i>
      </button>
    </div>
    <div class="address-list">
      <div
        v-for="address in addresses"
        :key="address._id"
        class="address-item"
        :class="{ highlighted: address._id === selectedAddressId }"
        @click="selectAddress(address)"
        ref="addressRefs"
      >
        <p class="address-title">{{ address.companyName }}</p>
        <p class="address-details">{{ address.street }}, {{ address.city }}</p>
        <p class="address-details">{{ address.zip }}, {{ address.country }}</p>
        <p class="address-details">Phone: {{ address.phone }}</p>
        <p class="address-details">Email: {{ address.email }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Address } from "@/common/interfaces";
import { defineProps, ref, onMounted, defineEmits } from "vue";

// Props - List of addresses
const props = defineProps({
  addresses: Array as () => Array<Address>,
  startSelectedAddress: String,
});

// Reference for all address items
const addressRefs = ref<HTMLElement[]>([]);

// Selected address ID for highlighting
const selectedAddressId = ref<string | null>(null);

// Emits - The event emitted when an address is clicked
const emit = defineEmits(["addressSelected"]);

// Method to select an address
const selectAddress = (address: Address | null) => {
  emit("addressSelected", address); // Emit event with the selected address
};

// Method to create a new address
const createNewAddress = () => {
  const newAddress = {
    companyName: "",
    country: "",
    zip: "",
    city: "",
    street: "",
    email: "",
    phone: "",
    fax: "",
  } as Address;
  emit("addressSelected", newAddress);
};

// Scroll to the selected address on mount if startSelectedAddress is provided
onMounted(() => {
  if (props.startSelectedAddress && props.addresses) {
    selectedAddressId.value = props.startSelectedAddress;
    const targetAddress = addressRefs.value.find(
      (refItem: any, index: number) =>
        props.addresses![index]._id === props.startSelectedAddress
    );
    if (targetAddress) {
      targetAddress.scrollIntoView({ behavior: "auto", block: "center" });
    }
  }
});
</script>

<style lang="scss" scoped>
.address-list-container {
  max-height: 300px; // Not to big... Normally it is only in the modal
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

.highlighted {
  background-color: #fef9e7; /* Blasses Beige-Gelb */
  box-shadow: 0 0 10px 2px rgba(255, 223, 105, 0.7); /* Gelber Schattenglanz */
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}
</style>
