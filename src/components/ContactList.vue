<template>
  <div class="contact-list-container">
    <div style="display: flex">
      <h3>Kontaktpersonen</h3>
      <span style="flex-grow: 1"></span>
      <button
        type="button"
        @click="createNewContact"
        class="btn btn-primary icon"
      >
        <i class="pi pi-plus"></i>
      </button>
    </div>
    <div class="contact-list">
      <div
        v-for="contact in contacts"
        :key="contact._id"
        class="contact-item"
        :class="{ highlighted: contact._id === selectedcontactId }"
        @click="selectContact(contact)"
        ref="contactRefs"
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
import type { ContactPerson } from "@/common/interfaces";
import { defineProps, ref, onMounted, defineEmits } from "vue";

// Props - List of contact persons
const props = defineProps({
  contacts: Array as () => Array<ContactPerson>,
  startSelectedContact: String,
});

// Reference for all address items
const contactRefs = ref<HTMLElement[]>([]);

// Selected address ID for highlighting
const selectedcontactId = ref<string | null>(null);

// Click on contact event
const emit = defineEmits(["contactSelected"]);

// If contact is selected, return it to the parent
const selectContact = (contact: ContactPerson) => {
  emit("contactSelected", contact);
};

const createNewContact = () => {
  const newContact = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    address: null,
  } as ContactPerson;
  emit("contactSelected", newContact);
};

// Scroll to the selected address on mount if startSelectedAddress is provided
onMounted(() => {
  if (props.startSelectedContact && props.contacts) {
    selectedcontactId.value = props.startSelectedContact;
    const targetContacts = contactRefs.value.find(
      (refItem: any, index: number) =>
        props.contacts![index]._id === props.startSelectedContact
    );
    if (targetContacts) {
      targetContacts.scrollIntoView({ behavior: "auto", block: "center" });
    }
  }
});
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

.highlighted {
  background-color: #fef9e7; /* Blasses Beige-Gelb */
  box-shadow: 0 0 10px 2px rgba(255, 223, 105, 0.7); /* Gelber Schattenglanz */
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}
</style>
