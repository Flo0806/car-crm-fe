<template>
  <div class="contact-list-container">
    <h3>Kontaktpersonen</h3>
    <div class="contact-list">
      <div
        v-for="contact in contacts"
        :key="contact._id"
        class="contact-item"
        @click="selectContact(contact)"
      >
        <p class="contact-name">
          {{ contact.firstName }} {{ contact.lastName }}
        </p>
        <p class="contact-details">Email: {{ contact.email }}</p>
        <p class="contact-details">Telefon: {{ contact.phone }}</p>
        <p class="contact-details">Geburtstag: {{ contact.birthDate }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

// Props - Liste der Kontaktpersonen
const props = defineProps({
  contacts: Array as () => Array<{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    address: string;
  }>,
});

// Emits - Das Event, das bei Klick auf eine Kontaktperson zurückgegeben wird
const emit = defineEmits(["contactSelected"]);

// Methode zum Selektieren einer Kontaktperson
const selectContact = (contact: any) => {
  emit("contactSelected", contact); // Emit-Event mit der ausgewählten Kontaktperson
};
</script>

<style lang="scss" scoped>
.contact-list-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  background-color: $background-light;
  padding: 1rem;
  margin-bottom: 1rem;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-item {
  padding: 1rem;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  background-color: $input-bg;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.contact-item:hover {
  background-color: $hover-background-color;
}

.contact-name {
  font-weight: bold;
  color: $primary-color;
}

.contact-details {
  color: $text-dark;
}
</style>
